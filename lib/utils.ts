import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsm'],
  
  // JSON форматы
  'application/json': ['.json'],
  'application/ld+json': ['.jsonld'],
  
  // XML форматы
  'application/xml': ['.xml'],
  'text/xml': ['.xml'],
  
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
  if (fileName.endsWith('.parquet')) return 'parquet'
  if (fileName.endsWith('.npz') || fileName.endsWith('.npy')) return 'numpy'
  if (fileName.endsWith('.pkl') || fileName.endsWith('.pickle')) return 'pickle'
  if (fileName.endsWith('.h5') || fileName.endsWith('.hdf5')) return 'hdf5'
  if (fileName.endsWith('.feather')) return 'feather'
  if (fileName.endsWith('.arrow')) return 'arrow'
  if (fileName.endsWith('.avro')) return 'avro'
  if (fileName.endsWith('.orc')) return 'orc'
  if (fileName.endsWith('.log')) return 'log'
  if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'yaml'
  if (fileName.endsWith('.toml')) return 'toml'
  if (fileName.endsWith('.ini') || fileName.endsWith('.cfg') || fileName.endsWith('.conf')) return 'ini'
  if (fileName.endsWith('.gz') || fileName.endsWith('.gzip')) return 'gzip'
  if (fileName.endsWith('.zip')) return 'zip'
  
  // Определяем по MIME типу
  if (fileType.includes('csv')) return 'csv'
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'excel'
  if (fileType.includes('json')) return 'json'
  if (fileType.includes('xml')) return 'xml'
  if (fileType.includes('gzip')) return 'gzip'
  if (fileType.includes('zip')) return 'zip'
  
  return 'unknown'
}

// File parsing utilities
export async function parseCSV(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length === 0) {
          reject(new Error('Empty CSV file'))
          return
        }
        
        // Автоматично визначаємо роздільник
        const firstLine = lines[0]
        let delimiter = ','
        
        // Перевіряємо чи є крапка з комою
        if (firstLine.includes(';')) {
          delimiter = ';'
        } else if (firstLine.includes('\t')) {
          delimiter = '\t'
        }
        
        console.log('CSV delimiter detected:', delimiter)
        console.log('First line:', firstLine)
        
        const headers = firstLine.split(delimiter).map(h => h.trim().replace(/"/g, ''))
        console.log('Headers:', headers)
        
        const data = lines.slice(1).map(line => {
          const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''))
          const row: Record<string, any> = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || null
          })
          return row
        })
        
        console.log('Parsed data sample:', data.slice(0, 2))
        
        resolve({ data, fields: headers })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read CSV file'))
    reader.readAsText(file)
  })
}

export async function parseTSV(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length === 0) {
          reject(new Error('Empty TSV file'))
          return
        }
        
        const headers = lines[0].split('\t').map(h => h.trim())
        const data = lines.slice(1).map(line => {
          const values = line.split('\t').map(v => v.trim())
          const row: Record<string, any> = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || null
          })
          return row
        })
        
        resolve({ data, fields: headers })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read TSV file'))
    reader.readAsText(file)
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
        // Простой парсинг YAML (в реальном приложении используйте js-yaml)
        const lines = text.split('\n').filter(line => line.trim())
        const data: Record<string, any>[] = []
        const fields = new Set<string>()
        
        let currentObject: Record<string, any> = {}
        
        lines.forEach(line => {
          const trimmed = line.trim()
          if (trimmed && !trimmed.startsWith('#')) {
            const colonIndex = trimmed.indexOf(':')
            if (colonIndex > 0) {
              const key = trimmed.substring(0, colonIndex).trim()
              const value = trimmed.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
              currentObject[key] = value
              fields.add(key)
            }
          } else if (trimmed === '' && Object.keys(currentObject).length > 0) {
            data.push({ ...currentObject })
            currentObject = {}
          }
        })
        
        // Добавляем последний объект
        if (Object.keys(currentObject).length > 0) {
          data.push(currentObject)
        }
        
        const fieldArray = Array.from(fields)
        resolve({ data, fields: fieldArray })
      } catch (error) {
        reject(error)
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
        // Простой парсинг TOML (в реальном приложении используйте @iarna/toml)
        const lines = text.split('\n').filter(line => line.trim())
        const data: Record<string, any>[] = []
        const fields = new Set<string>()
        
        let currentObject: Record<string, any> = {}
        
        lines.forEach(line => {
          const trimmed = line.trim()
          if (trimmed && !trimmed.startsWith('#')) {
            const equalIndex = trimmed.indexOf('=')
            if (equalIndex > 0) {
              const key = trimmed.substring(0, equalIndex).trim()
              const value = trimmed.substring(equalIndex + 1).trim().replace(/^["']|["']$/g, '')
              currentObject[key] = value
              fields.add(key)
            }
          } else if (trimmed.startsWith('[') && Object.keys(currentObject).length > 0) {
            data.push({ ...currentObject })
            currentObject = {}
          }
        })
        
        // Добавляем последний объект
        if (Object.keys(currentObject).length > 0) {
          data.push(currentObject)
        }
        
        const fieldArray = Array.from(fields)
        resolve({ data, fields: fieldArray })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read TOML file'))
    reader.readAsText(file)
  })
}

export async function parseExcel(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  // For now, return a simple implementation
  // In a real app, you'd use SheetJS or similar
  return new Promise((resolve, reject) => {
    try {
      // Simulate Excel parsing with more realistic data
      const mockData = [
        { 'Month': 'Jan', 'Region': 'EU', 'Revenue': 12000, 'Units': 320 },
        { 'Month': 'Feb', 'Region': 'EU', 'Revenue': 15000, 'Units': 360 },
        { 'Month': 'Mar', 'Region': 'EU', 'Revenue': 18000, 'Units': 410 },
        { 'Month': 'Jan', 'Region': 'US', 'Revenue': 14000, 'Units': 300 },
        { 'Month': 'Feb', 'Region': 'US', 'Revenue': 13000, 'Units': 280 },
        { 'Month': 'Mar', 'Region': 'US', 'Revenue': 17000, 'Units': 350 }
      ]
      const fields = ['Month', 'Region', 'Revenue', 'Units']
      resolve({ data: mockData, fields })
    } catch (error) {
      reject(new Error('Failed to parse Excel file'))
    }
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
  // В реальном приложении здесь была бы логика распаковки
  // Для демонстрации возвращаем ошибку
  throw new Error('Compressed file parsing not implemented in demo. Use uncompressed files.')
}

// Функция для парсинга бинарных форматов
export async function parseBinaryFile(file: File): Promise<{ data: Record<string, any>[], fields: string[] }> {
  // В реальном приложении здесь была бы логика парсинга бинарных форматов
  // Для демонстрации возвращаем ошибку
  throw new Error('Binary file parsing not implemented in demo. Use text-based formats.')
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
