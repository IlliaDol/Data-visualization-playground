import { Table } from 'apache-arrow'
import { Transform, TransformPlan } from '@/types'

/**
 * Детектує локаль для чисел (розділювач десяткових та тисячних)
 */
export function detectLocale(values: any[]): { decimal: '.' | ','; thousands?: '.' | ',' | ' ' } {
  const sampleValues = values.slice(0, 100).filter(v => v && typeof v === 'string')
  
  let commaCount = 0
  let dotCount = 0
  let spaceCount = 0
  
  for (const value of sampleValues) {
    if (value.includes(',')) commaCount++
    if (value.includes('.')) dotCount++
    if (value.includes(' ')) spaceCount++
  }
  
  // Якщо кома частіше за крапку - європейський формат
  if (commaCount > dotCount) {
    return { decimal: ',', thousands: '.' }
  }
  
  // Якщо крапка частіше за кому - американський формат
  if (dotCount > commaCount) {
    return { decimal: '.', thousands: ',' }
  }
  
  // За замовчуванням американський
  return { decimal: '.', thousands: ',' }
}

/**
 * Детектує патерн дати
 */
export function detectDatePattern(values: any[]): string | null {
  const sampleValues = values.slice(0, 50).filter(v => v && typeof v === 'string')
  
  const patterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}\.\d{2}\.\d{4}$/, // DD.MM.YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, // M/D/YYYY
  ]
  
  for (const pattern of patterns) {
    const matches = sampleValues.filter(v => pattern.test(v))
    if (matches.length > sampleValues.length * 0.8) {
      return pattern.source
    }
  }
  
  return null
}

/**
 * Перевіряє чи виглядає як число
 */
export function looksLikeNumber(table: Table, fieldName: string): boolean {
  const column = table.getColumn(fieldName)
  if (!column) return false
  
  const values = column.toArray().slice(0, 100)
  let numericCount = 0
  
  for (const value of values) {
    if (value === null || value === undefined) continue
    if (typeof value === 'number') {
      numericCount++
    } else if (typeof value === 'string') {
      // Перевіряємо чи можна конвертувати в число
      const cleanValue = value.replace(/[,\s]/g, '')
      if (!isNaN(Number(cleanValue))) {
        numericCount++
      }
    }
  }
  
  return numericCount > values.length * 0.7
}

/**
 * Перевіряє чи виглядає як дата
 */
export function looksLikeDate(table: Table, fieldName: string): boolean {
  const column = table.getColumn(fieldName)
  if (!column) return false
  
  const values = column.toArray().slice(0, 100)
  let dateCount = 0
  
  for (const value of values) {
    if (value === null || value === undefined) continue
    if (value instanceof Date) {
      dateCount++
    } else if (typeof value === 'string') {
      // Перевіряємо різні формати дат
      const datePatterns = [
        /^\d{4}-\d{2}-\d{2}/,
        /^\d{2}\/\d{2}\/\d{4}/,
        /^\d{2}\.\d{2}\.\d{4}/,
        /^\d{2}-\d{2}-\d{4}/,
      ]
      
      for (const pattern of datePatterns) {
        if (pattern.test(value)) {
          dateCount++
          break
        }
      }
    }
  }
  
  return dateCount > values.length * 0.5
}

/**
 * Перевіряє чи є дублікати
 */
export function hasDuplicates(table: Table): boolean {
  const rowCount = table.numRows
  const uniqueRows = new Set()
  
  for (let i = 0; i < Math.min(rowCount, 1000); i++) {
    const row = table.get(i)
    const rowString = JSON.stringify(row)
    if (uniqueRows.has(rowString)) {
      return true
    }
    uniqueRows.add(rowString)
  }
  
  return false
}

/**
 * Створює семпл даних для прев'ю
 */
export function sample(table: Table, fieldName: string, count: number = 10): any[] {
  const column = table.getColumn(fieldName)
  if (!column) return []
  
  const values = column.toArray()
  const step = Math.max(1, Math.floor(values.length / count))
  const sample = []
  
  for (let i = 0; i < values.length && sample.length < count; i += step) {
    sample.push(values[i])
  }
  
  return sample
}

/**
 * Створює план очищення даних
 */
export function buildCleanPlan(table: Table): TransformPlan {
  const items: Transform[] = []
  const preview: Array<{ field: string; before: any; after: any }> = []
  const stats: Record<string, any> = {}
  
  // 1) Аналіз типів колонок
  for (const field of table.schema.fields) {
    const fieldName = field.name
    
    if (looksLikeNumber(table, fieldName)) {
      const locale = detectLocale(sample(table, fieldName))
      items.push({ 
        op: 'normalizeDecimal', 
        field: fieldName, 
        decimal: locale.decimal, 
        thousands: locale.thousands 
      })
      items.push({ op: 'setType', field: fieldName, to: 'number' })
      
      // Додаємо в прев'ю
      const sampleValues = sample(table, fieldName, 3)
      if (sampleValues.length > 0) {
        preview.push({
          field: fieldName,
          before: sampleValues[0],
          after: typeof sampleValues[0] === 'string' ? 
            Number(sampleValues[0].replace(/[,\s]/g, '')) : sampleValues[0]
        })
      }
    }
    
    if (looksLikeDate(table, fieldName)) {
      const pattern = detectDatePattern(sample(table, fieldName))
      items.push({ 
        op: 'parseDate', 
        field: fieldName, 
        pattern: pattern || 'auto' 
      })
      items.push({ op: 'setType', field: fieldName, to: 'date' })
      
      // Додаємо в прев'ю
      const sampleValues = sample(table, fieldName, 3)
      if (sampleValues.length > 0) {
        preview.push({
          field: fieldName,
          before: sampleValues[0],
          after: new Date(sampleValues[0]).toISOString().split('T')[0]
        })
      }
    }
  }
  
  // 2) Видалення пробілів
  for (const field of table.schema.fields) {
    items.push({ op: 'trim', field: field.name })
  }
  
  // 3) Видалення дублікатів
  if (hasDuplicates(table)) {
    items.push({ op: 'dropDuplicates' })
    stats.duplicatesRemoved = true
  }
  
  // 4) Статистика
  stats.totalRows = table.numRows
  stats.totalColumns = table.numCols
  stats.transformsCount = items.length
  
  return { items, preview, stats }
}

/**
 * Застосовує трансформацію до таблиці
 */
export function applyTransform(table: Table, transform: Transform): Table {
  // Це спрощена версія - в реальному проекті потрібно реалізувати
  // повну логіку трансформацій з Apache Arrow
  return table
}

/**
 * Застосовує план очищення
 */
export function applyPlan(table: Table, plan: TransformPlan): Table {
  let result = table
  for (const transform of plan.items) {
    result = applyTransform(result, transform)
  }
  return result
}

/**
 * Експортує очищені дані в CSV
 */
export function exportCleanedCSV(table: Table): string {
  const headers = table.schema.fields.map(f => f.name).join(',')
  const rows = []
  
  for (let i = 0; i < table.numRows; i++) {
    const row = table.get(i)
    const values = Object.values(row).map(v => {
      if (v === null || v === undefined) return ''
      if (typeof v === 'string' && v.includes(',')) return `"${v}"`
      return String(v)
    })
    rows.push(values.join(','))
  }
  
  return [headers, ...rows].join('\n')
}
