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
import { AIAgent } from './AIAgent'

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
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null)

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
    // This function is now handled by AIAgent component
    console.log('AI Assist called - handled by AIAgent component')
  }

  const handleAIChartSuggestion = (chartSpec: ChartSpec) => {
    // Apply AI suggestions to the form
    setSelectedChartType(chartSpec.mark)
    setXField(chartSpec.encoding.x?.field || '')
    setYField(chartSpec.encoding.y?.field || '')
    setColorField(chartSpec.encoding.color?.field || '')
    setChartTitle(chartSpec.title)
    
    // Show preview if we have X and Y fields
    if (chartSpec.encoding.x?.field && chartSpec.encoding.y?.field) {
      setShowPreview(true)
    }
  }

  const handleAIAnalysisComplete = (result: any) => {
    setAiAnalysisResult(result)
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
                  <Card className="bg-card border-border">
        <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Chart Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Type Selection */}
          <div>
                          <h3 className="text-sm font-medium mb-3 text-foreground">Chart Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CHART_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedChartType(type.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedChartType === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2 text-blue-600 dark:text-blue-400" />
                                          <div className="font-medium text-sm text-foreground">{type.name}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Field Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                              <label className="block text-sm font-medium mb-2 text-foreground">X Axis</label>
              <div className="text-xs text-muted-foreground mb-2">
                💡 Виберіть категоріальне поле або дату для групування даних
              </div>
              <select
                value={xField}
                onChange={(e) => setXField(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
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
                              <label className="block text-sm font-medium mb-2 text-foreground">Y Axis</label>
              <div className="text-xs text-muted-foreground mb-2">
                💡 Виберіть числове поле для відображення значень (суми, кількості, середні значення)
              </div>
              <select
                value={yField}
                onChange={(e) => setYField(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
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
                              <label className="block text-sm font-medium mb-2 text-foreground">Color (Optional)</label>
              <select
                value={colorField}
                onChange={(e) => setColorField(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
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
                            <label className="block text-sm font-medium mb-2 text-foreground">Chart Title</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Enter chart title"
            />
          </div>

          {/* AI Analysis Section */}
          <div className="border-t border-border pt-4">
            <AIAgent 
              dataProfile={dataProfile}
              onChartSuggestion={handleAIChartSuggestion}
              onAnalysisComplete={handleAIAnalysisComplete}
            />
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
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
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
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
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
            <div className="border border-border rounded-lg p-4 bg-muted">
              <h3 className="text-sm font-medium mb-2 text-foreground">Preview</h3>
              <div className="mb-2 text-xs text-muted-foreground">
                Debug Info: Chart Type={selectedChartType}, X={xField}, Y={yField}, 
                Data Rows={dataProfile.sampleData?.length || 0}
              </div>
              <div className="bg-card rounded border border-border p-4">
                {xField && (yField || selectedChartType === 'pie') ? (
                  <div>
                    <div className="mb-2 text-xs text-muted-foreground">
                      Debug: X={xField}, Y={yField}, Data={dataProfile.sampleData?.length || 0} rows
                    </div>
                    <ChartRenderer 
                      chartSpec={{
                        id: 'preview',
                        title: chartTitle,
                        data: {
                          sourceId: dataProfile.id,
                          transform: []
                        },
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
                      data={dataProfile.sampleData || []}
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Виберіть поля X та Y для перегляду чарту
                  </div>
                )}
              </div>
              
              {/* Statistical Analysis Recommendations */}
              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
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
                      <div className="text-sm font-medium text-primary">
                        {analysis.recommendation}
                      </div>
                      
                      {showAnalysisDetails && (
                        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                          <p className="mb-2">{analysis.details}</p>
                          
                          <div className="mt-3 space-y-1">
                            <div className="font-medium text-foreground">📈 Додаткові методи:</div>
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
