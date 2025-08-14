'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  LineChart, 
  ScatterChart, 
  PieChart, 
  Map, 
  Sparkles,
  Code,
  Download,
  Settings,
  Eye,
  TrendingUp,
  Activity,
  Target,
  Layers,
  Gauge,
  Calendar,
  Globe,
  Database,
  Square,
  Circle,
  Triangle,
  BarChart
} from 'lucide-react'
import { DataProfile, ChartSpec, ChartMark } from '@/types'
import { generatePythonCode, generateRCode, generateImageExportCode, downloadFile } from '@/lib/utils'
import { ChartRenderer } from './ChartRenderer'

interface ChartBuilderProps {
  dataProfile: DataProfile
  onChartCreated: (chart: ChartSpec) => void
}

const CHART_TYPES = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare categories' },
  { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { id: 'scatter', name: 'Scatter Plot', icon: ScatterChart, description: 'Show relationships' },
  { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
  { id: 'area', name: 'Area Chart', icon: TrendingUp, description: 'Show cumulative data' },
  { id: 'histogram', name: 'Histogram', icon: Activity, description: 'Show distribution' },
  { id: 'boxplot', name: 'Box Plot', icon: Square, description: 'Show data distribution' },
  { id: 'heatmap', name: 'Heat Map', icon: Target, description: 'Show correlations' },
  { id: 'gauge', name: 'Gauge Chart', icon: Gauge, description: 'Show progress/KPI' },
  { id: 'bubble', name: 'Bubble Chart', icon: Circle, description: '3D scatter plot' },
  { id: 'stacked', name: 'Stacked Bar', icon: Layers, description: 'Compare parts to whole' },
  { id: 'waterfall', name: 'Waterfall', icon: TrendingUp, description: 'Show cumulative effect' },
  { id: 'funnel', name: 'Funnel Chart', icon: Triangle, description: 'Show conversion process' },
  { id: 'radar', name: 'Radar Chart', icon: Target, description: 'Compare multiple variables' },
  { id: 'tree', name: 'Tree Map', icon: Database, description: 'Hierarchical data' },
  { id: 'sankey', name: 'Sankey Diagram', icon: TrendingUp, description: 'Show flow between categories' },
]

export function ChartBuilder({ dataProfile, onChartCreated }: ChartBuilderProps) {
  const [selectedChartType, setSelectedChartType] = useState('bar')
  const [xField, setXField] = useState('')
  const [yField, setYField] = useState('')
  const [colorField, setColorField] = useState('')
  const [chartTitle, setChartTitle] = useState(`Chart Builder - ${dataProfile.name}`)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [analysisPrompt, setAnalysisPrompt] = useState('')
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(false)

  // Auto-select fields based on data types
  React.useEffect(() => {
    const numericFields = dataProfile.fields.filter(f => f.type === 'number' || f.type === 'integer')
    const categoricalFields = dataProfile.fields.filter(f => f.type === 'string' || f.type === 'categorical')
    
    if (categoricalFields.length > 0 && !xField) {
      setXField(categoricalFields[0].name)
    }
    if (numericFields.length > 0 && !yField) {
      setYField(numericFields[0].name)
    }
  }, [dataProfile, xField, yField])

  // Автоматично показуємо превью коли вибрані поля
  React.useEffect(() => {
    if (xField && yField) {
      setShowPreview(true)
    }
  }, [xField, yField])

  const handleCreateChart = () => {
    console.log('Creating chart with:', {
      title: chartTitle,
      type: selectedChartType,
      xField,
      yField,
      colorField,
      dataProfile: dataProfile.name
    })

    const chartSpec: ChartSpec = {
      id: Math.random().toString(36).substr(2, 9),
      title: chartTitle,
      data: {
        sourceId: dataProfile.id
      },
      mark: selectedChartType as ChartMark,
      encoding: {
        x: xField ? { field: xField, type: 'nominal' } : undefined,
        y: yField ? { field: yField, type: 'quantitative' } : undefined,
        color: colorField ? { field: colorField, type: 'nominal' } : undefined
      },
      config: {
        theme: 'light',
        legend: true,
        labels: true,
        grid: true,
        axis: { x: true, y: true },
        tooltip: true,
        animation: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Chart spec created:', chartSpec)
    onChartCreated(chartSpec)
  }

  const handleAIAssist = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing
    setTimeout(() => {
      // AI analyzes data and suggests best chart type
      console.log('AI analyzing data profile:', dataProfile)
      console.log('User analysis prompt:', analysisPrompt)
      
      // Визначаємо типи полів на основі даних
      const numericFields = dataProfile.fields.filter(f => {
        // Перевіряємо чи поле містить числові значення
        const sampleValues = dataProfile.sampleData?.slice(0, 5).map(row => row[f.name]) || []
        return sampleValues.some(val => !isNaN(Number(val)) && val !== '' && val !== null)
      })
      
      const categoricalFields = dataProfile.fields.filter(f => {
        // Поля які не є числовими
        const sampleValues = dataProfile.sampleData?.slice(0, 5).map(row => row[f.name]) || []
        return !sampleValues.some(val => !isNaN(Number(val)) && val !== '' && val !== null)
      })
      
      console.log('Numeric fields:', numericFields.map(f => f.name))
      console.log('Categorical fields:', categoricalFields.map(f => f.name))
      
      let suggestedChartType = 'bar'
      let suggestedXField = ''
      let suggestedYField = ''
      let suggestedColorField = ''
      
      // Аналізуємо запит користувача
      const userPrompt = analysisPrompt.toLowerCase()
      let userIntent = ''
      
      if (userPrompt.includes('розподіл') || userPrompt.includes('distribution')) {
        userIntent = 'distribution'
      } else if (userPrompt.includes('кореляці') || userPrompt.includes('correlation') || userPrompt.includes('зв\'язок')) {
        userIntent = 'correlation'
      } else if (userPrompt.includes('тренд') || userPrompt.includes('trend') || userPrompt.includes('час')) {
        userIntent = 'trend'
      } else if (userPrompt.includes('порівнян') || userPrompt.includes('compare') || userPrompt.includes('категорі')) {
        userIntent = 'comparison'
      } else if (userPrompt.includes('пропорці') || userPrompt.includes('proportion') || userPrompt.includes('частка')) {
        userIntent = 'proportion'
      } else if (userPrompt.includes('імен') || userPrompt.includes('name')) {
        userIntent = 'names'
      } else if (userPrompt.includes('користувач') || userPrompt.includes('user')) {
        userIntent = 'users'
      }
      
      console.log('User intent detected:', userIntent)
      
      // AI Logic for chart type selection
      console.log('AI Analysis - Available fields:', {
        categorical: categoricalFields.map(f => f.name),
        numeric: numericFields.map(f => f.name),
        all: dataProfile.fields.map(f => ({ name: f.name, type: f.type }))
      })
      
      // Визначаємо тип чарту на основі наміру користувача та доступних полів
      if (userIntent === 'distribution' && numericFields.length > 0) {
        suggestedChartType = 'histogram'
        suggestedXField = numericFields[0].name
        suggestedYField = numericFields[0].name
      } else if (userIntent === 'correlation' && numericFields.length >= 2) {
        suggestedChartType = 'scatter'
        suggestedXField = numericFields[0].name
        suggestedYField = numericFields[1].name
      } else if (userIntent === 'trend' && categoricalFields.length > 0 && numericFields.length > 0) {
        suggestedChartType = 'line'
        suggestedXField = categoricalFields[0].name
        suggestedYField = numericFields[0].name
      } else if (userIntent === 'proportion' && categoricalFields.length > 0) {
        suggestedChartType = 'pie'
        suggestedXField = categoricalFields[0].name
        suggestedYField = ''
      } else if (userIntent === 'names' || userIntent === 'users') {
        // Шукаємо поля з іменами
        const nameFields = categoricalFields.filter(f => 
          f.name.toLowerCase().includes('name') || 
          f.name.toLowerCase().includes('first') || 
          f.name.toLowerCase().includes('last') ||
          f.name.toLowerCase().includes('user')
        )
        if (nameFields.length > 0) {
          suggestedChartType = 'pie'
          suggestedXField = nameFields[0].name
          suggestedYField = ''
        }
      } else if (userIntent === 'comparison' && categoricalFields.length > 0) {
        suggestedChartType = 'bar'
        suggestedXField = categoricalFields[0].name
        if (numericFields.length > 0) {
          suggestedYField = numericFields[0].name
        } else {
          suggestedYField = '' // Буде підраховано автоматично
        }
      } else {
        // Стандартна логіка якщо намір не визначено
        if (categoricalFields.length > 0 && numericFields.length > 0) {
          // Є і категоріальні і числові поля - ідеально для bar chart
          suggestedChartType = 'bar'
          suggestedXField = categoricalFields[0].name
          suggestedYField = numericFields[0].name
          
          if (categoricalFields.length > 1) {
            suggestedColorField = categoricalFields[1].name
          }
        } else if (numericFields.length >= 2) {
          // Два або більше числових полів - scatter plot
          suggestedChartType = 'scatter'
          suggestedXField = numericFields[0].name
          suggestedYField = numericFields[1].name
          
          if (categoricalFields.length > 0) {
            suggestedColorField = categoricalFields[0].name
          }
        } else if (numericFields.length === 1) {
          // Тільки одне числове поле - histogram
          suggestedChartType = 'histogram'
          suggestedXField = numericFields[0].name
          suggestedYField = numericFields[0].name
        } else if (categoricalFields.length >= 2) {
          // Два або більше категоріальних полів - pie chart для пропорцій
          suggestedChartType = 'pie'
          suggestedXField = categoricalFields[0].name
          suggestedYField = ''
        } else if (categoricalFields.length === 1) {
          // Тільки одне категоріальне поле - bar chart з підрахунком
          suggestedChartType = 'bar'
          suggestedXField = categoricalFields[0].name
          suggestedYField = ''
        } else {
          // Fallback - використовуємо перші два поля
          if (dataProfile.fields.length >= 2) {
            suggestedXField = dataProfile.fields[0].name
            suggestedYField = dataProfile.fields[1].name
          } else if (dataProfile.fields.length === 1) {
            suggestedXField = dataProfile.fields[0].name
            suggestedYField = dataProfile.fields[0].name
          }
        }
      }
      
      console.log('AI suggestions:', {
        chartType: suggestedChartType,
        xField: suggestedXField,
        yField: suggestedYField,
        colorField: suggestedColorField
      })
      
      // Apply AI suggestions
      setSelectedChartType(suggestedChartType)
      setXField(suggestedXField)
      setYField(suggestedYField)
      setColorField(suggestedColorField)
      
      setChartTitle(`AI Suggested ${suggestedChartType.charAt(0).toUpperCase() + suggestedChartType.slice(1)} - ${dataProfile.name}`)
      
      // Автоматично показуємо превью якщо є X та Y поля
      if (suggestedXField && suggestedYField) {
        setShowPreview(true)
      }
      
      // Показуємо повідомлення про успішний аналіз
      let message = `✅ AI аналіз завершено!\n\n`
      
      if (userIntent) {
        message += `🎯 Розпізнано намір: ${userIntent}\n`
      }
      
      message += `📊 Рекомендований тип чарту: ${suggestedChartType}\n`
      message += `📈 X Axis: ${suggestedXField}\n`
      if (suggestedYField) {
        message += `📉 Y Axis: ${suggestedYField}\n`
      }
      if (suggestedColorField) {
        message += `🎨 Color: ${suggestedColorField}\n`
      }
      
      message += `\nТепер ви можете створити чарт!`
      
      alert(message)
      
      setIsGenerating(false)
    }, 2000)
  }

  const handleExportCode = (language: 'python' | 'r', library?: string) => {
    setIsExporting(true)
    
    setTimeout(() => {
    const chartSpec: ChartSpec = {
      id: Math.random().toString(36).substr(2, 9),
      title: chartTitle,
      data: {
        sourceId: dataProfile.id
      },
      mark: selectedChartType as ChartMark,
      encoding: {
        x: xField ? { field: xField, type: 'nominal' } : undefined,
        y: yField ? { field: yField, type: 'quantitative' } : undefined,
        color: colorField ? { field: colorField, type: 'nominal' } : undefined
      },
      config: {
        theme: 'light',
        legend: true,
        labels: true,
        grid: true,
        axis: { x: true, y: true },
        tooltip: true,
        animation: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    let code = ''
    let filename = ''
    
    if (language === 'python') {
      const lib = library === 'matplotlib' ? 'matplotlib' : 'plotly'
      code = generatePythonCode(chartSpec, dataProfile, lib)
      filename = `${chartTitle.toLowerCase().replace(/\s+/g, '_')}_${lib}.py`
    } else {
      const lib = library === 'plotly' ? 'plotly' : 'ggplot2'
      code = generateRCode(chartSpec, dataProfile, lib)
      filename = `${chartTitle.toLowerCase().replace(/\s+/g, '_')}_${lib}.R`
    }
    
    downloadFile(code, filename, 'text/plain')
    
      // Показуємо повідомлення про успішний експорт
      const lib = library || (language === 'python' ? 'plotly' : 'ggplot2')
      alert(`✅ Код ${language.toUpperCase()} (${lib}) експортовано успішно!\nФайл: ${filename}`)
      
      setIsExporting(false)
    }, 500)
  }

  const analyzeDataForStatistics = () => {
    if (!dataProfile.sampleData || dataProfile.sampleData.length === 0) {
      return { recommendation: 'Немає даних для аналізу', details: '' }
    }

    const numericFields = dataProfile.fields.filter(f => {
      const sampleValues = dataProfile.sampleData?.slice(0, 5).map(row => row[f.name]) || []
      return sampleValues.some(val => !isNaN(Number(val)) && val !== '' && val !== null)
    })
    
    const categoricalFields = dataProfile.fields.filter(f => {
      const sampleValues = dataProfile.sampleData?.slice(0, 5).map(row => row[f.name]) || []
      return !sampleValues.some(val => !isNaN(Number(val)) && val !== '' && val !== null)
    })

    // Аналізуємо структуру даних
    const hasNumeric = numericFields.length > 0
    const hasCategorical = categoricalFields.length > 0
    const hasMultipleNumeric = numericFields.length >= 2
    const hasMultipleCategorical = categoricalFields.length >= 2
    const sampleSize = dataProfile.sampleData.length

    let recommendation = ''
    let details = ''

    // Якщо вибрані конкретні поля, даємо більш точні рекомендації
    if (xField && yField) {
      const xIsNumeric = numericFields.some(f => f.name === xField)
      const yIsNumeric = numericFields.some(f => f.name === yField)
      
      if (xIsNumeric && yIsNumeric) {
        recommendation = '🔗 Кореляційний аналіз або лінійна регресія'
        details = `Для аналізу зв\'язку між ${xField} та ${yField}. Кореляція Пірсона для нормального розподілу, Спірмена для рангових даних.`
      } else if (xIsNumeric && !yIsNumeric) {
        recommendation = '📊 t-тест або ANOVA'
        details = `Для порівняння середніх значень ${xField} між групами ${yField}. t-тест для двох груп, ANOVA для трьох і більше.`
      } else if (!xIsNumeric && yIsNumeric) {
        recommendation = '📊 t-тест або ANOVA'
        details = `Для порівняння середніх значень ${yField} між групами ${xField}. t-тест для двох груп, ANOVA для трьох і більше.`
      } else {
        recommendation = '📋 Хі-квадрат тест'
        details = `Для перевірки незалежності між ${xField} та ${yField}. Показує чи є зв\'язок між категоріями.`
      }
    } else if (hasNumeric && hasCategorical) {
      if (hasMultipleNumeric) {
        recommendation = '📊 ANOVA або MANOVA'
        details = `Для порівняння середніх значень між категоріями. ANOVA - якщо одна залежна змінна, MANOVA - якщо кілька.`
      } else {
        recommendation = '📈 t-тест або ANOVA'
        details = `Для порівняння середніх значень між групами. t-тест для двох груп, ANOVA для трьох і більше.`
      }
    } else if (hasMultipleNumeric) {
      recommendation = '🔗 Лінійна регресія або кореляція'
      details = `Для виявлення зв\'язків між числовими змінними. Кореляція показує силу зв\'язку, регресія - прогнозування.`
    } else if (hasMultipleCategorical) {
      recommendation = '📋 Хі-квадрат тест'
      details = `Для перевірки незалежності між категоріальними змінними. Показує чи є зв\'язок між категоріями.`
    } else if (hasNumeric) {
      recommendation = '📊 Описова статистика'
      details = `Середнє, медіана, стандартне відхилення, квартилі. Для розуміння розподілу числових даних.`
    } else if (hasCategorical) {
      recommendation = '📈 Частотний аналіз'
      details = `Підрахунок частоти кожної категорії. Для розуміння розподілу категоріальних даних.`
    } else {
      recommendation = '❓ Недостатньо інформації'
      details = `Потрібно більше даних або інші типи змінних для статистичного аналізу.`
    }

    // Додаємо рекомендації по розміру вибірки
    if (sampleSize < 30) {
      details += ` ⚠️ Маленька вибірка (${sampleSize} спостережень) - використовуйте непараметричні тести.`
    } else if (sampleSize > 1000) {
      details += ` ✅ Велика вибірка (${sampleSize} спостережень) - можна використовувати параметричні тести.`
    }

    return { recommendation, details }
  }

  const handleExportImage = async (format: 'png' | 'svg' | 'pdf') => {
    // Перевіряємо чи є дані для експорту
    if (!xField) {
      alert('❌ Виберіть поле X для експорту зображення.')
      return
    }
    
    if (!yField && selectedChartType !== 'pie') {
      alert('❌ Виберіть поле Y для експорту зображення.')
      return
    }
    
    if (!showPreview) {
      alert('❌ Спочатку покажіть превью чарту для експорту.')
      return
    }
    
    setIsExporting(true)
    
    try {
      // Знаходимо елемент з чартом
      const chartElement = document.querySelector('.chart-export-container') || 
                          document.querySelector('.recharts-wrapper') || 
                          document.querySelector('[style*="height: 400px"]')
      
      if (!chartElement) {
        alert('❌ Не вдалося знайти чарт для експорту. Переконайтеся, що чарт відображений.')
        setIsExporting(false)
        return
      }

      // Імпортуємо html2canvas динамічно
      const html2canvas = (await import('html2canvas')).default
      
      // Створюємо зображення
      const canvas = await html2canvas(chartElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Вища якість
        useCORS: true,
        allowTaint: true
      })
      
      // Конвертуємо в потрібний формат
      let dataUrl = ''
      let filename = `${chartTitle.toLowerCase().replace(/\s+/g, '_')}.${format}`
      
      if (format === 'png') {
        dataUrl = canvas.toDataURL('image/png')
      } else if (format === 'svg') {
        // Для SVG використовуємо PNG як fallback
        dataUrl = canvas.toDataURL('image/png')
        filename = filename.replace('.svg', '.png')
      } else if (format === 'pdf') {
        // Для PDF використовуємо PNG як fallback
        dataUrl = canvas.toDataURL('image/png')
        filename = filename.replace('.pdf', '.png')
      }
      
      // Створюємо посилання для завантаження
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      alert(`✅ Зображення ${format.toUpperCase()} експортовано успішно!\nФайл: ${filename}`)
      
    } catch (error) {
      console.error('Export error:', error)
      alert(`❌ Помилка експорту: ${error instanceof Error ? error.message : 'Невідома помилка'}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Chart Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Type Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">Chart Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CHART_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedChartType(type.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedChartType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2 text-blue-600 dark:text-blue-400" />
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{type.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{type.description}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Field Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">X Axis</label>
              <select
                value={xField}
                onChange={(e) => setXField(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select field</option>
                {dataProfile.fields.map((field) => (
                  <option key={field.name} value={field.name}>
                    {field.name} ({field.type})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Y Axis</label>
              <select
                value={yField}
                onChange={(e) => setYField(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select field</option>
                {dataProfile.fields.map((field) => (
                  <option key={field.name} value={field.name}>
                    {field.name} ({field.type})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Color (Optional)</label>
              <select
                value={colorField}
                onChange={(e) => setColorField(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">No color</option>
                {dataProfile.fields.map((field) => (
                  <option key={field.name} value={field.name}>
                    {field.name} ({field.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Chart Title</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter chart title"
            />
          </div>

          {/* AI Analysis Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Auto-Analysis
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Що ви хочете проаналізувати? (необов'язково)
                </label>
                <textarea
                  value={analysisPrompt}
                  onChange={(e) => setAnalysisPrompt(e.target.value)}
                  placeholder="Наприклад: 
• Покажи розподіл користувачів за іменами
• Знайди кореляції між полями  
• Покажи тренди за часом
• Порівняй категорії
• Покажи пропорції"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleAIAssist()}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGenerating ? 'AI Thinking...' : 'AI Auto-Analysis'}
                </Button>
                
                <Button
                  onClick={() => setAnalysisPrompt('')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  Очистити
                </Button>
              </div>
              
              {/* Quick Examples */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setAnalysisPrompt('Покажи розподіл користувачів за іменами')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Розподіл імен
                </Button>
                <Button
                  onClick={() => setAnalysisPrompt('Знайди кореляції між полями')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Кореляції
                </Button>
                <Button
                  onClick={() => setAnalysisPrompt('Покажи тренди за часом')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Тренди
                </Button>
                <Button
                  onClick={() => setAnalysisPrompt('Порівняй категорії')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Порівняння
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCreateChart}
              disabled={!xField || (!yField && selectedChartType !== 'pie')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Create Chart
            </Button>
            
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>

          {/* Code Export */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Code className="h-4 w-4" />
              Export Code
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleExportCode('python', 'plotly')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isExporting}
              >
                <Code className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Python (Plotly)'}
              </Button>
              <Button
                onClick={() => handleExportCode('python', 'matplotlib')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isExporting}
              >
                <Code className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Python (Matplotlib)'}
              </Button>
              <Button
                onClick={() => handleExportCode('r', 'ggplot2')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isExporting}
              >
                <Code className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'R (ggplot2)'}
              </Button>
              <Button
                onClick={() => handleExportCode('r', 'plotly')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isExporting}
              >
                <Code className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'R (Plotly)'}
              </Button>
            </div>
          </div>

          {/* Image Export */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Image
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleExportImage('png')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={!xField || (!yField && selectedChartType !== 'pie') || !showPreview || isExporting}
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'PNG (High Res)'}
              </Button>
              <Button
                onClick={() => handleExportImage('svg')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={!xField || (!yField && selectedChartType !== 'pie') || !showPreview || isExporting}
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'SVG (Vector)'}
              </Button>
              <Button
                onClick={() => handleExportImage('pdf')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={!xField || (!yField && selectedChartType !== 'pie') || !showPreview || isExporting}
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'PDF (Print Ready)'}
              </Button>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Preview</h3>
              <div className="mb-2 text-xs text-gray-500">
                Debug Info: Chart Type={selectedChartType}, X={xField}, Y={yField}, 
                Data Rows={dataProfile.sampleData?.length || 0}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
                {xField && (yField || selectedChartType === 'pie') ? (
                  <div>
                    <div className="mb-2 text-xs text-gray-500">
                      Debug: X={xField}, Y={yField}, Data={dataProfile.sampleData?.length || 0} rows
                    </div>
                    <ChartRenderer 
                      chartSpec={{
                        id: 'preview',
                        title: chartTitle,
                        mark: selectedChartType as ChartMark,
                        encoding: {
                          x: { field: xField, type: 'nominal' },
                          y: { field: yField, type: 'quantitative' },
                          color: colorField ? { field: colorField, type: 'nominal' } : undefined
                        },
                        config: {
                          theme: 'light',
                          legend: true,
                          labels: true,
                          grid: true,
                          axis: { x: true, y: true },
                          tooltip: true,
                          animation: true
                        },
                        createdAt: new Date(),
                        updatedAt: new Date()
                      }}
                      dataProfile={dataProfile}
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Виберіть поля X та Y для перегляду чарту
                  </div>
                )}
              </div>
              
              {/* Statistical Analysis Recommendations */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    📊 Рекомендації по аналізу
                  </h4>
                  <Button
                    onClick={() => setShowAnalysisDetails(!showAnalysisDetails)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {showAnalysisDetails ? 'Сховати деталі' : 'Показати деталі'}
                  </Button>
                </div>
                
                {(() => {
                  const analysis = analyzeDataForStatistics()
                  return (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {analysis.recommendation}
                      </div>
                      
                      {showAnalysisDetails && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                          <p className="mb-2">{analysis.details}</p>
                          
                          <div className="mt-3 space-y-1">
                            <div className="font-medium text-gray-700 dark:text-gray-300">📈 Додаткові методи:</div>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              <li><strong>Кореляційний аналіз:</strong> Пірсона (нормальний розподіл) або Спірмена (рангова)</li>
                              <li><strong>Регресійний аналіз:</strong> Лінійна, поліноміальна, логістична регресія</li>
                              <li><strong>Кластерний аналіз:</strong> K-means, ієрархічна кластеризація</li>
                              <li><strong>Часові ряди:</strong> ARIMA, експоненціальне згладжування</li>
                              <li><strong>Непараметричні тести:</strong> Манна-Уітні, Крускала-Уолліса</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
