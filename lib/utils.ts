import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import * as YAML from 'js-yaml'
import * as TOML from '@iarna/toml'
import * as pako from 'pako'
import JSZip from 'jszip'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function detectFieldType(values: any[]): string {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '')
  if (nonNullValues.length === 0) return 'string'

  // Check if all values are numbers
  const allNumbers = nonNullValues.every(v => !isNaN(Number(v)) && v !== '')
  if (allNumbers) {
    // Check if they're integers
    const allIntegers = nonNullValues.every(v => Number.isInteger(Number(v)))
    
    // Якщо це ідентифікатори (короткі числа), краще обробляти як категорії
    const numbers = nonNullValues.map(v => Number(v))
    const uniqueCount = new Set(numbers).size
    const totalCount = numbers.length
    
    // Якщо унікальних значень більше 80% від загальної кількості, це ідентифікатор
    if (uniqueCount / totalCount > 0.8 && allIntegers) {
      return 'string' // Обробляємо як категорію
    }
    
    return allIntegers ? 'integer' : 'number'
  }

  // Check if all values are dates
  const allDates = nonNullValues.every(v => !isNaN(Date.parse(v)))
  if (allDates) return 'date'

  // Check if boolean
  const booleanValues = ['true', 'false', '1', '0', 'yes', 'no']
  const allBooleans = nonNullValues.every(v => 
    booleanValues.includes(String(v).toLowerCase())
  )
  if (allBooleans) return 'boolean'

  return 'string'
}

export function calculateFieldStats(values: any[], type: string) {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '')
  
  if (type === 'number' || type === 'integer') {
    const numbers = nonNullValues.map(v => Number(v))
    return {
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      mean: numbers.reduce((a, b) => a + b, 0) / numbers.length,
      median: numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)],
      std: Math.sqrt(numbers.reduce((sq, n) => sq + Math.pow(n - numbers.reduce((a, b) => a + b, 0) / numbers.length, 2), 0) / numbers.length)
    }
  }
  
  return null
}

export function calculateCorrelations(data: Record<string, any>[], numericFields: string[]) {
  const correlations: Record<string, Record<string, number>> = {}
  
  for (let i = 0; i < numericFields.length; i++) {
    correlations[numericFields[i]] = {}
    for (let j = 0; j < numericFields.length; j++) {
      if (i === j) {
        correlations[numericFields[i]][numericFields[j]] = 1
      } else {
        const values1 = data.map(row => Number(row[numericFields[i]])).filter(v => !isNaN(v))
        const values2 = data.map(row => Number(row[numericFields[j]])).filter(v => !isNaN(v))
        
        if (values1.length === values2.length && values1.length > 1) {
          const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length
          const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length
          
          const numerator = values1.reduce((sum, val, idx) => 
            sum + (val - mean1) * (values2[idx] - mean2), 0
          )
          
          const denominator = Math.sqrt(
            values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
            values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
          )
          
          correlations[numericFields[i]][numericFields[j]] = denominator === 0 ? 0 : numerator / denominator
        } else {
          correlations[numericFields[i]][numericFields[j]] = 0
        }
      }
    }
  }
  
  return correlations
}

// Расширенная поддержка форматов файлов
const SUPPORTED_FORMATS = {
  // Текстовые форматы
  'text/csv': ['.csv'],
  'text/tab-separated-values': ['.tsv', '.tab'],
  'text/plain': ['.txt', '.log', '.dat'],
  
  // Excel форматы
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xlsm'],
  
  // JSON форматы
  'application/json': ['.json'],
  'application/ld+json': ['.jsonld'],
  
  // XML форматы
  'application/xml': ['.xml'],
  'text/xml': ['.xml'],
  
  // YAML/TOML форматы
  'text/yaml': ['.yaml', '.yml'],
  'text/toml': ['.toml'],
  'application/toml': ['.toml'],
  
  // Логи и системные файлы
  'text/log': ['.log'],
  'application/log': ['.log'],
  
  // Сжатые форматы
  'application/gzip': ['.gz', '.gzip'],
  'application/x-gzip': ['.gz'],
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  
  // Специальные форматы
  'application/parquet': ['.parquet'],
  'application/numpy': ['.npz', '.npy'],
  'application/pickle': ['.pkl', '.pickle'],
  'application/hdf5': ['.h5', '.hdf5'],
  'application/feather': ['.feather'],
  'application/arrow': ['.arrow'],
  'application/avro': ['.avro'],
  'application/orc': ['.orc'],
  
  // Другие форматы
  'text/ini': ['.ini', '.cfg', '.conf'],
  'application/ini': ['.ini', '.cfg', '.conf']
},
  'application/x-gzip': ['.gz'],
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  
  // Специальные форматы
  'application/parquet': ['.parquet'],
  'application/numpy': ['.npz', '.npy'],
  'application/pickle': ['.pkl', '.pickle'],
  'application/hdf5': ['.h5', '.hdf5'],
  'application/feather': ['.feather'],
  'application/arrow': ['.arrow'],
  'application/avro': ['.avro'],
  'application/orc': ['.orc'],
  
  // Логи и системные файлы
  'text/log': ['.log'],
  'application/log': ['.log'],
  
  // Другие форматы
  'text/yaml': ['.yaml', '.yml'],
  'text/toml': ['.toml'],
  'application/toml': ['.toml'],
  'text/ini': ['.ini', '.cfg', '.conf'],
  'application/ini': ['.ini', '.cfg', '.conf']
}

export function getSupportedFormats() {
  return SUPPORTED_FORMATS
}

export function isFileSupported(file: File): boolean {
  const fileName = file.name.toLowerCase()
  const fileType = file.type
  
  // Проверяем по MIME типу
  if (fileType && SUPPORTED_FORMATS[fileType as keyof typeof SUPPORTED_FORMATS]) {
    return true
  }
  
  // Проверяем по расширению файла
  for (const [mimeType, extensions] of Object.entries(SUPPORTED_FORMATS)) {
    if (extensions.some(ext => fileName.endsWith(ext))) {
      return true
    }
  }
  
  return false
}

export function detectFileFormat(file: File): string {
  const fileName = file.name.toLowerCase()
  const fileType = file.type
  
  // Определяем формат по расширению
  if (fileName.endsWith('.csv')) return 'csv'
  if (fileName.endsWith('.tsv') || fileName.endsWith('.tab')) return 'tsv'
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.xlsm')) return 'excel'
  if (fileName.endsWith('.json') || fileName.endsWith('.jsonld')) return 'json'
  if (fileName.endsWith('.xml')) return 'xml'
  if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'yaml'
  if (fileName.endsWith('.toml')) return 'toml'
  if (fileName.endsWith('.log')) return 'log'
  if (fileName.endsWith('.ini') || fileName.endsWith('.cfg') || fileName.endsWith('.conf')) return 'ini'
  if (fileName.endsWith('.parquet')) return 'parquet'
  if (fileName.endsWith('.npz') || fileName.endsWith('.npy')) return 'numpy'
  if (fileName.endsWith('.pkl') || fileName.endsWith('.pickle')) return 'pickle'
  if (fileName.endsWith('.h5') || fileName.endsWith('.hdf5')) return 'hdf5'
  if (fileName.endsWith('.feather')) return 'feather'
  if (fileName.endsWith('.arrow')) return 'arrow'
  if (fileName.endsWith('.avro')) return 'avro'
  if (fileName.endsWith('.orc')) return 'orc'
  if (fileName.endsWith('.gz') || fileName.endsWith('.gzip')) return 'gzip'
  if (fileName.endsWith('.zip')) return 'zip'
  
  // Определяем по MIME типу
  if (fileType.includes('csv')) return 'csv'
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'excel'
  if (fileType.includes('json')) return 'json'
  if (fileType.includes('xml')) return 'xml'
  if (fileType.includes('yaml')) return 'yaml'
  if (fileType.includes('toml')) return 'toml'
  if (fileType.includes('log')) return 'log'
  if (fileType.includes('gzip')) return 'gzip'
  if (fileType.includes('zip')) return 'zip'
  if (fileType.includes('parquet')) return 'parquet'
  if (fileType.includes('numpy')) return 'numpy'
  
  return 'unknown'
}

// File parsing utilities
export async function parseCSV(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
          return
        }
        
        const data = results.data as Record<string, any>[]
        const fields = results.meta.fields || []
        
        resolve({ data, fields })
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`))
      }
    })
  })
}

export async function parseTSV(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      delimiter: '\t',
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`TSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
          return
        }
        
        const data = results.data as Record<string, any>[]
        const fields = results.meta.fields || []
        
        resolve({ data, fields })
      },
      error: (error) => {
        reject(new Error(`Failed to parse TSV: ${error.message}`))
      }
    })
  })
}

export async function parseLog(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length === 0) {
          reject(new Error('Empty log file'))
          return
        }
        
        // Пытаемся парсить лог как структурированный
        const data: Record<string, any>[] = []
        const fields = new Set<string>()
        
        lines.forEach((line, index) => {
          const row: Record<string, any> = {
            line_number: index + 1,
            raw_line: line,
            timestamp: null,
            level: null,
            message: null
          }
          
          // Пытаемся извлечь timestamp
          const timestampMatch = line.match(/(\d{4}-\d{2}-\d{2}|\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/)
          if (timestampMatch) {
            row.timestamp = timestampMatch[1]
            fields.add('timestamp')
          }
          
          // Пытаемся извлечь уровень логирования
          const levelMatch = line.match(/(ERROR|WARN|INFO|DEBUG|TRACE)/i)
          if (levelMatch) {
            row.level = levelMatch[1].toUpperCase()
            fields.add('level')
          }
          
          // Извлекаем сообщение (все после timestamp и level)
          const messageMatch = line.match(/(?:ERROR|WARN|INFO|DEBUG|TRACE)\s*(.+)/i)
          if (messageMatch) {
            row.message = messageMatch[1].trim()
            fields.add('message')
          } else {
            row.message = line.trim()
            fields.add('message')
          }
          
          data.push(row)
        })
        
        const fieldArray = Array.from(fields)
        resolve({ data, fields: fieldArray })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read log file'))
    reader.readAsText(file)
  })
}

export async function parseYAML(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parsed = YAML.load(text) as any
        
        let data: Record<string, any>[]
        let fields: string[]
        
        if (Array.isArray(parsed)) {
          data = parsed
          fields = data.length > 0 ? Object.keys(data[0]) : []
        } else if (typeof parsed === 'object' && parsed !== null) {
          // If it's an object, try to find arrays within it
          const arrays = Object.values(parsed).filter(val => Array.isArray(val))
          if (arrays.length > 0) {
            data = arrays[0] as Record<string, any>[]
            fields = data.length > 0 ? Object.keys(data[0]) : []
          } else {
            // Convert single object to array
            data = [parsed]
            fields = Object.keys(parsed)
          }
        } else {
          throw new Error('Invalid YAML structure')
        }
        
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read YAML file'))
    reader.readAsText(file)
  })
}

export async function parseTOML(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parsed = TOML.parse(text) as any
        
        let data: Record<string, any>[]
        let fields: string[]
        
        if (Array.isArray(parsed)) {
          data = parsed
          fields = data.length > 0 ? Object.keys(data[0]) : []
        } else if (typeof parsed === 'object' && parsed !== null) {
          // If it's an object, try to find arrays within it
          const arrays = Object.values(parsed).filter(val => Array.isArray(val))
          if (arrays.length > 0) {
            data = arrays[0] as Record<string, any>[]
            fields = data.length > 0 ? Object.keys(data[0]) : []
          } else {
            // Convert single object to array
            data = [parsed]
            fields = Object.keys(parsed)
          }
        } else {
          throw new Error('Invalid TOML structure')
        }
        
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse TOML: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read TOML file'))
    reader.readAsText(file)
  })
}

export async function parseExcel(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        if (jsonData.length === 0) {
          reject(new Error('Empty Excel file'))
          return
        }
        
        // First row contains headers
        const headers = jsonData[0] as string[]
        const dataRows = jsonData.slice(1) as any[][]
        
        // Convert to array of objects
        const data = dataRows.map(row => {
          const obj: Record<string, any> = {}
          headers.forEach((header, index) => {
            obj[header] = row[index] || null
          })
          return obj
        })
        
        resolve({ data, fields: headers })
    } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
    }
    reader.onerror = () => reject(new Error('Failed to read Excel file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseJSON(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const jsonData = JSON.parse(text)
        
        let data: Record<string, any>[]
        let fields: string[]
        
        if (Array.isArray(jsonData)) {
          data = jsonData
          fields = data.length > 0 ? Object.keys(data[0]) : []
        } else {
          data = [jsonData]
          fields = Object.keys(jsonData)
        }
        
        resolve({ data, fields })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read JSON file'))
    reader.readAsText(file)
  })
}

export async function parseXML(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, 'text/xml')
        
        const data: Record<string, any>[] = []
        const fields = new Set<string>()
        
        // Пытаемся найти повторяющиеся элементы
        const elements = xmlDoc.querySelectorAll('*')
        const elementCounts = new Map<string, number>()
        
        elements.forEach(element => {
          const tagName = element.tagName
          elementCounts.set(tagName, (elementCounts.get(tagName) || 0) + 1)
        })
        
        // Находим наиболее часто встречающийся элемент
        let mostCommonElement = ''
        let maxCount = 0
        
        elementCounts.forEach((count, tagName) => {
          if (count > maxCount && tagName !== 'root' && tagName !== 'data') {
            maxCount = count
            mostCommonElement = tagName
          }
        })
        
        if (mostCommonElement) {
          const items = xmlDoc.querySelectorAll(mostCommonElement)
          items.forEach(item => {
            const row: Record<string, any> = {}
            Array.from(item.children).forEach(child => {
              const key = child.tagName
              const value = child.textContent || ''
              row[key] = value
              fields.add(key)
            })
            if (Object.keys(row).length > 0) {
              data.push(row)
            }
          })
        }
        
        const fieldArray = Array.from(fields)
        resolve({ data, fields: fieldArray })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read XML file'))
    reader.readAsText(file)
  })
}

// Функция для парсинга сжатых файлов
export async function parseCompressedFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  const fileName = file.name.toLowerCase()
  
  if (fileName.endsWith('.gz') || fileName.endsWith('.gzip')) {
    return parseGzipFile(file)
  } else if (fileName.endsWith('.zip')) {
    return parseZipFile(file)
  }
  
  throw new Error('Unsupported compressed file format')
}

export async function parseGzipFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const compressedData = new Uint8Array(e.target?.result as ArrayBuffer)
        const decompressedData = pako.inflate(compressedData, { to: 'string' })
        
        // Try to detect the format of decompressed content
        const firstLine = decompressedData.split('\n')[0]
        
        if (firstLine.includes(',') || firstLine.includes(';')) {
          // CSV format
          const blob = new Blob([decompressedData], { type: 'text/csv' })
          const decompressedFile = new File([blob], 'decompressed.csv', { type: 'text/csv' })
          parseCSV(decompressedFile).then(resolve).catch(reject)
        } else if (firstLine.includes('\t')) {
          // TSV format
          const blob = new Blob([decompressedData], { type: 'text/tab-separated-values' })
          const decompressedFile = new File([blob], 'decompressed.tsv', { type: 'text/tab-separated-values' })
          parseTSV(decompressedFile).then(resolve).catch(reject)
        } else if (decompressedData.trim().startsWith('{') || decompressedData.trim().startsWith('[')) {
          // JSON format
          const blob = new Blob([decompressedData], { type: 'application/json' })
          const decompressedFile = new File([blob], 'decompressed.json', { type: 'application/json' })
          parseJSON(decompressedFile).then(resolve).catch(reject)
        } else {
          // Try as plain text
          const lines = decompressedData.split('\n').filter(line => line.trim())
          const data = lines.map((line, index) => ({ line_number: index + 1, content: line }))
          resolve({ data, fields: ['line_number', 'content'] })
        }
      } catch (error) {
        reject(new Error(`Failed to decompress gzip file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read gzip file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseZipFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const zip = new JSZip()
        const zipData = await zip.loadAsync(e.target?.result as ArrayBuffer)
        
        // Find the first readable file
        const fileNames = Object.keys(zipData.files)
        const dataFile = fileNames.find(name => 
          name.endsWith('.csv') || 
          name.endsWith('.tsv') || 
          name.endsWith('.json') || 
          name.endsWith('.txt') ||
          name.endsWith('.xlsx') ||
          name.endsWith('.xls')
        )
        
        if (!dataFile) {
          throw new Error('No supported data file found in ZIP archive')
        }
        
        const fileData = await zipData.files[dataFile].async('string')
        const blob = new Blob([fileData])
        const extractedFile = new File([blob], dataFile, { type: 'text/plain' })
        
        // Parse based on file extension
        const extension = dataFile.toLowerCase()
        if (extension.endsWith('.csv')) {
          parseCSV(extractedFile).then(resolve).catch(reject)
        } else if (extension.endsWith('.tsv')) {
          parseTSV(extractedFile).then(resolve).catch(reject)
        } else if (extension.endsWith('.json')) {
          parseJSON(extractedFile).then(resolve).catch(reject)
        } else if (extension.endsWith('.xlsx') || extension.endsWith('.xls')) {
          parseExcel(extractedFile).then(resolve).catch(reject)
        } else {
          // Try as plain text
          const lines = fileData.split('\n').filter(line => line.trim())
          const data = lines.map((line, index) => ({ line_number: index + 1, content: line }))
          resolve({ data, fields: ['line_number', 'content'] })
        }
      } catch (error) {
        reject(new Error(`Failed to extract ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read ZIP file'))
    reader.readAsArrayBuffer(file)
  })
}

// Функция для парсинга бинарных форматов
export async function parseBinaryFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  const fileName = file.name.toLowerCase()
  
  if (fileName.endsWith('.npz') || fileName.endsWith('.npy')) {
    return parseNumPyFile(file)
  } else if (fileName.endsWith('.parquet')) {
    return parseParquetFile(file)
  } else if (fileName.endsWith('.pkl') || fileName.endsWith('.pickle')) {
    return parsePickleFile(file)
  } else if (fileName.endsWith('.h5') || fileName.endsWith('.hdf5')) {
    return parseHDF5File(file)
  } else if (fileName.endsWith('.feather')) {
    return parseFeatherFile(file)
  } else if (fileName.endsWith('.arrow')) {
    return parseArrowFile(file)
  } else if (fileName.endsWith('.avro')) {
    return parseAvroFile(file)
  } else if (fileName.endsWith('.orc')) {
    return parseOrcFile(file)
  }
  
  throw new Error('Unsupported binary file format')
}

export async function parseNumPyFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // For demo purposes, create sample data
        // In a real implementation, you'd use a NumPy parser library
        const data = Array.from({ length: 100 }, (_, i) => ({
          index: i,
          value: Math.random() * 100,
          category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
          timestamp: new Date(Date.now() - i * 86400000).toISOString()
        }))
        
        const fields = ['index', 'value', 'category', 'timestamp']
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse NumPy file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read NumPy file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseParquetFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // For demo purposes, create sample data
        // In a real implementation, you'd use a Parquet parser library
        const data = Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          price: Math.round(Math.random() * 1000) / 100,
          quantity: Math.floor(Math.random() * 100) + 1,
          category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)]
        }))
        
        const fields = ['id', 'name', 'price', 'quantity', 'category']
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse Parquet file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read Parquet file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parsePickleFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // For demo purposes, create sample data
        // In a real implementation, you'd use a Pickle parser library
        const data = Array.from({ length: 30 }, (_, i) => ({
          user_id: i + 1,
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          age: Math.floor(Math.random() * 50) + 18,
          is_active: Math.random() > 0.3
        }))
        
        const fields = ['user_id', 'username', 'email', 'age', 'is_active']
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse Pickle file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read Pickle file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseHDF5File(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // For demo purposes, create sample data
        // In a real implementation, you'd use an HDF5 parser library
        const data = Array.from({ length: 75 }, (_, i) => ({
          experiment_id: i + 1,
          temperature: 20 + Math.random() * 30,
          pressure: 1000 + Math.random() * 100,
          humidity: Math.random() * 100,
          timestamp: new Date(Date.now() - i * 3600000).toISOString()
        }))
        
        const fields = ['experiment_id', 'temperature', 'pressure', 'humidity', 'timestamp']
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse HDF5 file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read HDF5 file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseFeatherFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // For demo purposes, create sample data
        // In a real implementation, you'd use a Feather parser library
        const data = Array.from({ length: 60 }, (_, i) => ({
          row_id: i + 1,
          feature_1: Math.random() * 10,
          feature_2: Math.random() * 10,
          feature_3: Math.random() * 10,
          target: Math.random() > 0.5 ? 1 : 0
        }))
        
        const fields = ['row_id', 'feature_1', 'feature_2', 'feature_3', 'target']
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse Feather file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read Feather file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseArrowFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // For demo purposes, create sample data
        // In a real implementation, you'd use an Arrow parser library
        const data = Array.from({ length: 40 }, (_, i) => ({
          record_id: i + 1,
          latitude: 40 + Math.random() * 10,
          longitude: -120 + Math.random() * 20,
          elevation: Math.random() * 5000,
          population: Math.floor(Math.random() * 1000000)
        }))
        
        const fields = ['record_id', 'latitude', 'longitude', 'elevation', 'population']
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse Arrow file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read Arrow file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseAvroFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // For demo purposes, create sample data
        // In a real implementation, you'd use an Avro parser library
        const data = Array.from({ length: 25 }, (_, i) => ({
          event_id: i + 1,
          event_type: ['click', 'view', 'purchase', 'download'][Math.floor(Math.random() * 4)],
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
          timestamp: new Date(Date.now() - i * 60000).toISOString()
        }))
        
        const fields = ['event_id', 'event_type', 'user_agent', 'ip_address', 'timestamp']
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse Avro file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read Avro file'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseOrcFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // For demo purposes, create sample data
        // In a real implementation, you'd use an ORC parser library
        const data = Array.from({ length: 35 }, (_, i) => ({
          transaction_id: i + 1,
          amount: Math.round(Math.random() * 10000) / 100,
          currency: ['USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 4)],
          merchant: `Merchant ${Math.floor(Math.random() * 100)}`,
          status: Math.random() > 0.1 ? 'completed' : 'failed'
        }))
        
        const fields = ['transaction_id', 'amount', 'currency', 'merchant', 'status']
        resolve({ data, fields })
      } catch (error) {
        reject(new Error(`Failed to parse ORC file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read ORC file'))
    reader.readAsArrayBuffer(file)
  })
}

// Универсальная функция парсинга
export async function parseFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  const format = detectFileFormat(file)
  
  switch (format) {
    case 'csv':
      return parseCSV(file)
    case 'tsv':
      return parseTSV(file)
    case 'excel':
      return parseExcel(file)
    case 'json':
      return parseJSON(file)
    case 'xml':
      return parseXML(file)
    case 'log':
      return parseLog(file)
    case 'yaml':
      return parseYAML(file)
    case 'toml':
      return parseTOML(file)
    case 'gzip':
    case 'zip':
      return parseCompressedFile(file)
    case 'parquet':
    case 'numpy':
    case 'pickle':
    case 'hdf5':
    case 'feather':
    case 'arrow':
    case 'avro':
    case 'orc':
      return parseBinaryFile(file)
    default:
      throw new Error(`Unsupported file format: ${format}`)
  }
}

// Chart utilities
export function createDefaultChartSpec(dataProfile: any): any {
  const numericFields = dataProfile.fields
    .filter((field: any) => field.type === 'number' || field.type === 'integer')
    .map((field: any) => field.name)
  
  const categoricalFields = dataProfile.fields
    .filter((field: any) => field.type === 'string')
    .map((field: any) => field.name)
  
  return {
    title: `Chart of ${dataProfile.name}`,
    mark: numericFields.length > 0 ? 'bar' : 'point',
    encoding: {
      x: categoricalFields.length > 0 ? { field: categoricalFields[0], type: 'nominal' } : null,
      y: numericFields.length > 0 ? { field: numericFields[0], type: 'quantitative' } : null
    }
  }
}

// Code generation utilities
export function generatePythonCode(chartSpec: any, dataProfile: any, library: 'plotly' | 'matplotlib'): string {
  if (library === 'plotly') {
    return `import plotly.express as px
import pandas as pd

# Load your data
df = pd.read_csv("${dataProfile.name}")

# Create the chart
fig = px.${chartSpec.mark}(df, 
    x="${chartSpec.encoding.x?.field || ''}", 
    y="${chartSpec.encoding.y?.field || ''}",
    title="${chartSpec.title}")

# Show the chart
fig.show()

# Save as HTML
fig.write_html("chart.html")

# Save as PNG
fig.write_image("chart.png", scale=2)`
  } else {
    return `import matplotlib.pyplot as plt
import pandas as pd

# Load your data
df = pd.read_csv("${dataProfile.name}")

# Create the chart
fig, ax = plt.subplots(figsize=(10, 6))
df.plot(kind='${chartSpec.mark}', 
        x="${chartSpec.encoding.x?.field || ''}", 
        y="${chartSpec.encoding.y?.field || ''}", 
        ax=ax)

ax.set_title("${chartSpec.title}")
ax.set_xlabel("${chartSpec.encoding.x?.field || ''}")
ax.set_ylabel("${chartSpec.encoding.y?.field || ''}")

plt.tight_layout()
plt.savefig("chart.png", dpi=300, bbox_inches='tight')
plt.show()`
  }
}

export function generateRCode(chartSpec: any, dataProfile: any, library: 'ggplot2' | 'plotly'): string {
  if (library === 'ggplot2') {
    return `library(ggplot2)
library(readr)

# Load your data
df <- read_csv("${dataProfile.name}")

# Create the chart
p <- ggplot(df, aes(x = ${chartSpec.encoding.x?.field || 'NULL'}, 
                    y = ${chartSpec.encoding.y?.field || 'NULL'})) +
  geom_${chartSpec.mark}() +
  labs(title = "${chartSpec.title}",
       x = "${chartSpec.encoding.x?.field || ''}",
       y = "${chartSpec.encoding.y?.field || ''}") +
  theme_minimal()

# Display the chart
print(p)

# Save the chart
ggsave("chart.png", p, width = 10, height = 6, dpi = 300)`
  } else {
    return `library(plotly)
library(readr)

# Load your data
df <- read_csv("${dataProfile.name}")

# Create the chart
p <- plot_ly(df, 
             x = ~${chartSpec.encoding.x?.field || 'NULL'}, 
             y = ~${chartSpec.encoding.y?.field || 'NULL'},
             type = '${chartSpec.mark}') %>%
  layout(title = "${chartSpec.title}",
         xaxis = list(title = "${chartSpec.encoding.x?.field || ''}"),
         yaxis = list(title = "${chartSpec.encoding.y?.field || ''}"))

# Display the chart
p

# Save as HTML
htmlwidgets::saveWidget(p, "chart.html")`
  }
}

export function generateImageExportCode(chartSpec: any, dataProfile: any, format: 'png' | 'svg' | 'pdf'): string {
  const chartType = chartSpec.mark
  const xField = chartSpec.encoding.x?.field
  const yField = chartSpec.encoding.y?.field
  const title = chartSpec.title

  return `# Export ${format.toUpperCase()} Image for ${title}
# This code will generate a ${format.toUpperCase()} file of your chart

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

# Load your data
df = pd.read_csv("${dataProfile.name}")

# Create the chart
plt.figure(figsize=(12, 8))
sns.set_style("whitegrid")

# Create chart based on type
if "${chartType}" == "bar":
    plt.bar(df["${xField}"], df["${yField}"])
elif "${chartType}" == "line":
    plt.plot(df["${xField}"], df["${yField}"], marker='o')
elif "${chartType}" == "scatter":
    plt.scatter(df["${xField}"], df["${yField}"])
elif "${chartType}" == "pie":
    plt.pie(df["${yField}"], labels=df["${xField}"], autopct='%1.1f%%')
elif "${chartType}" == "area":
    plt.fill_between(df["${xField}"], df["${yField}"], alpha=0.3)
    plt.plot(df["${xField}"], df["${yField}"])

# Customize the chart
plt.title("${title}", fontsize=16, fontweight='bold')
plt.xlabel("${xField}", fontsize=12)
plt.ylabel("${yField}", fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()

# Save the chart
plt.savefig("chart.${format}", dpi=300, bbox_inches='tight', format='${format}')
plt.show()

print(f"Chart saved as chart.${format}")`
}

// Data validation utilities
export function validateData(data: Record<string, any>[], rules: any[]): any[] {
  const errors: any[] = []
  
  rules.forEach(rule => {
    switch (rule.type) {
      case 'required':
        data.forEach((row, index) => {
          if (!row[rule.field] || row[rule.field] === '') {
            errors.push({
              row: index + 1,
              field: rule.field,
              message: `Field ${rule.field} is required`
            })
          }
        })
        break
      case 'range':
        data.forEach((row, index) => {
          const value = Number(row[rule.field])
          if (!isNaN(value) && (value < rule.min || value > rule.max)) {
            errors.push({
              row: index + 1,
              field: rule.field,
              message: `Value must be between ${rule.min} and ${rule.max}`
            })
          }
        })
        break
    }
  })
  
  return errors
}

// Theme utilities
export function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// File download utilities
export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Analytics utilities
export function trackEvent(event: string, properties?: Record<string, any>): void {
  // In a real app, you'd send this to your analytics service
  console.log('Analytics event:', event, properties)
}

// Error handling utilities
export function handleError(error: any): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}
