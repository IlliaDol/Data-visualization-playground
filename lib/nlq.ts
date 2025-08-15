import { ChartSpecV1, ChartSpecZ } from '@/types'

/**
 * Простий NLQ агент для створення ChartSpec з природної мови
 * В реальному проекті тут буде інтеграція з OpenAI/Anthropic
 */
export async function createChartSpecFromNLQ(
  prompt: string, 
  dataContext: {
    fields: string[]
    data: any[]
    fieldTypes: Record<string, string>
  }
): Promise<ChartSpecV1> {
  // Простий парсер запитів
  const lowerPrompt = prompt.toLowerCase()
  
  // Визначаємо тип графіка
  let mark: ChartSpecV1['mark'] = 'bar'
  if (lowerPrompt.includes('лінія') || lowerPrompt.includes('тренд') || lowerPrompt.includes('час')) {
    mark = 'line'
  } else if (lowerPrompt.includes('точка') || lowerPrompt.includes('розсіювання')) {
    mark = 'point'
  } else if (lowerPrompt.includes('область') || lowerPrompt.includes('area')) {
    mark = 'area'
  } else if (lowerPrompt.includes('теплова') || lowerPrompt.includes('heatmap')) {
    mark = 'heatmap'
  } else if (lowerPrompt.includes('кругова') || lowerPrompt.includes('pie')) {
    mark = 'pie'
  }
  
  // Знаходимо поля для осей
  let xField = ''
  let yField = ''
  let colorField = ''
  
  // Шукаємо числові поля для Y осі
  const numericFields = dataContext.fields.filter(field => 
    dataContext.fieldTypes[field] === 'number' || 
    dataContext.fieldTypes[field] === 'quantitative'
  )
  
  // Шукаємо категоріальні поля для X осі
  const categoricalFields = dataContext.fields.filter(field => 
    dataContext.fieldTypes[field] === 'string' || 
    dataContext.fieldTypes[field] === 'nominal' ||
    dataContext.fieldTypes[field] === 'ordinal'
  )
  
  // Шукаємо часові поля
  const temporalFields = dataContext.fields.filter(field => 
    dataContext.fieldTypes[field] === 'date' || 
    dataContext.fieldTypes[field] === 'temporal'
  )
  
  // Автоматичний вибір полів
  if (temporalFields.length > 0) {
    xField = temporalFields[0]
  } else if (categoricalFields.length > 0) {
    xField = categoricalFields[0]
  } else if (dataContext.fields.length > 0) {
    xField = dataContext.fields[0]
  }
  
  if (numericFields.length > 0) {
    yField = numericFields[0]
  } else if (dataContext.fields.length > 1) {
    yField = dataContext.fields[1]
  }
  
  // Шукаємо поле для кольору
  if (categoricalFields.length > 1) {
    colorField = categoricalFields[1]
  }
  
  // Створюємо ChartSpec
  const spec: ChartSpecV1 = {
    version: '1',
    data: { values: dataContext.data },
    encoding: {
      x: xField ? {
        field: xField,
        type: temporalFields.includes(xField) ? 'temporal' : 
              numericFields.includes(xField) ? 'quantitative' : 'nominal'
      } : undefined,
      y: yField ? {
        field: yField,
        type: numericFields.includes(yField) ? 'quantitative' : 'nominal'
      } : undefined,
      color: colorField ? {
        field: colorField,
        type: 'nominal'
      } : undefined
    },
    mark,
    title: `Графік: ${prompt}`,
    meta: {
      createdAt: new Date().toISOString(),
      prompt
    }
  }
  
  // Валідуємо специфікацію
  return ChartSpecZ.parse(spec)
}

/**
 * Генерує пропозиції графіків на основі даних
 */
export function generateChartSuggestions(dataContext: {
  fields: string[]
  data: any[]
  fieldTypes: Record<string, string>
}): Array<{ title: string; prompt: string; spec: ChartSpecV1 }> {
  const suggestions = []
  
  const numericFields = dataContext.fields.filter(field => 
    dataContext.fieldTypes[field] === 'number' || 
    dataContext.fieldTypes[field] === 'quantitative'
  )
  
  const categoricalFields = dataContext.fields.filter(field => 
    dataContext.fieldTypes[field] === 'string' || 
    dataContext.fieldTypes[field] === 'nominal'
  )
  
  const temporalFields = dataContext.fields.filter(field => 
    dataContext.fieldTypes[field] === 'date' || 
    dataContext.fieldTypes[field] === 'temporal'
  )
  
  // Пропозиція 1: Бар-графік для категорій
  if (categoricalFields.length > 0 && numericFields.length > 0) {
    const spec: ChartSpecV1 = {
      version: '1',
      data: { values: dataContext.data },
      encoding: {
        x: { field: categoricalFields[0], type: 'nominal' },
        y: { field: numericFields[0], type: 'quantitative' }
      },
      mark: 'bar',
      title: `Розподіл ${numericFields[0]} по ${categoricalFields[0]}`,
      meta: {
        createdAt: new Date().toISOString(),
        prompt: `Покажи розподіл ${numericFields[0]} по ${categoricalFields[0]}`
      }
    }
    
    suggestions.push({
      title: `Розподіл ${numericFields[0]} по ${categoricalFields[0]}`,
      prompt: `Покажи розподіл ${numericFields[0]} по ${categoricalFields[0]}`,
      spec: ChartSpecZ.parse(spec)
    })
  }
  
  // Пропозиція 2: Лінійний графік для часу
  if (temporalFields.length > 0 && numericFields.length > 0) {
    const spec: ChartSpecV1 = {
      version: '1',
      data: { values: dataContext.data },
      encoding: {
        x: { field: temporalFields[0], type: 'temporal' },
        y: { field: numericFields[0], type: 'quantitative' }
      },
      mark: 'line',
      title: `Тренд ${numericFields[0]} за часом`,
      meta: {
        createdAt: new Date().toISOString(),
        prompt: `Покажи тренд ${numericFields[0]} за часом`
      }
    }
    
    suggestions.push({
      title: `Тренд ${numericFields[0]} за часом`,
      prompt: `Покажи тренд ${numericFields[0]} за часом`,
      spec: ChartSpecZ.parse(spec)
    })
  }
  
  // Пропозиція 3: Scatter plot для кореляції
  if (numericFields.length >= 2) {
    const spec: ChartSpecV1 = {
      version: '1',
      data: { values: dataContext.data },
      encoding: {
        x: { field: numericFields[0], type: 'quantitative' },
        y: { field: numericFields[1], type: 'quantitative' }
      },
      mark: 'point',
      title: `Кореляція між ${numericFields[0]} та ${numericFields[1]}`,
      meta: {
        createdAt: new Date().toISOString(),
        prompt: `Покажи кореляцію між ${numericFields[0]} та ${numericFields[1]}`
      }
    }
    
    suggestions.push({
      title: `Кореляція між ${numericFields[0]} та ${numericFields[1]}`,
      prompt: `Покажи кореляцію між ${numericFields[0]} та ${numericFields[1]}`,
      spec: ChartSpecZ.parse(spec)
    })
  }
  
  return suggestions
}
