'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ScatterChart,
  LineChart,
  Activity,
  Target,
  Layers,
  Gauge,
  Database,
  Square,
  Circle,
  Triangle,
  Calendar,
  Globe,
  Zap,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { DataProfile, ChartSpec, ChartMark } from '@/types'

interface AIAnalysisResult {
  chartType: string
  xField: string
  yField: string
  colorField?: string
  confidence: number
  reasoning: string
  insights: string[]
  recommendations: string[]
  statisticalTests: string[]
}

interface AIAgentProps {
  dataProfile: DataProfile
  onChartSuggestion: (chartSpec: ChartSpec) => void
  onAnalysisComplete: (result: AIAnalysisResult) => void
}

const CHART_TYPE_ICONS = {
  bar: BarChart3,
  line: LineChart,
  scatter: ScatterChart,
  pie: PieChart,
  area: TrendingUp,
  histogram: Activity,
  boxplot: Square,
  heatmap: Target,
  gauge: Gauge,
  bubble: Circle,
  stacked: Layers,
  waterfall: TrendingUp,
  funnel: Triangle,
  radar: Target,
  tree: Database,
  sankey: TrendingUp
}

export function AIAgent({ dataProfile, onChartSuggestion, onAnalysisComplete }: AIAgentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [userPrompt, setUserPrompt] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const analyzeDataStructure = (): any => {
    const fields = dataProfile.fields
    const sampleData = dataProfile.sampleData || []
    
    // Анализируем типы полей
    const fieldAnalysis = fields.map(field => {
      const values = sampleData.map(row => row[field.name])
      const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '')
      
      // Определяем тип данных
      let dataType = 'unknown'
      let isNumeric = false
      let isDate = false
      let isCategorical = false
      let uniqueCount = 0
      let missingCount = 0
      
      if (nonNullValues.length > 0) {
        // Проверяем на числа
        const numericValues = nonNullValues.filter(v => !isNaN(Number(v)) && v !== '')
        if (numericValues.length === nonNullValues.length) {
          dataType = 'numeric'
          isNumeric = true
        } else {
          // Проверяем на даты
          const dateValues = nonNullValues.filter(v => !isNaN(Date.parse(v)))
          if (dateValues.length === nonNullValues.length) {
            dataType = 'date'
            isDate = true
          } else {
            dataType = 'categorical'
            isCategorical = true
          }
        }
        
        uniqueCount = new Set(nonNullValues).size
        missingCount = values.length - nonNullValues.length
      }
      
      return {
        name: field.name,
        dataType,
        isNumeric,
        isDate,
        isCategorical,
        uniqueCount,
        missingCount,
        totalCount: values.length,
        sampleValues: nonNullValues.slice(0, 5)
      }
    })
    
    // Анализируем размеры данных
    const dataSize = {
      rows: dataProfile.rowCount,
      columns: dataProfile.columnCount,
      totalCells: dataProfile.rowCount * dataProfile.columnCount
    }
    
    // Анализируем качество данных
    const qualityMetrics = {
      completeness: fields.reduce((sum, field) => {
        const missing = field.missingValues
        const total = dataProfile.rowCount
        return sum + ((total - missing) / total)
      }, 0) / fields.length,
      uniqueness: fields.reduce((sum, field) => {
        return sum + (field.uniqueValues / dataProfile.rowCount)
      }, 0) / fields.length
    }
    
    return {
      fields: fieldAnalysis,
      dataSize,
      qualityMetrics,
      sampleData
    }
  }

  const detectDataPatterns = (analysis: any): any => {
    const patterns = {
      hasTimeSeries: false,
      hasGeographicData: false,
      hasHierarchicalData: false,
      hasCorrelations: false,
      hasOutliers: false,
      hasSeasonality: false,
      hasTrends: false
    }
    
    // Проверяем временные ряды
    const dateFields = analysis.fields.filter((f: any) => f.isDate)
    if (dateFields.length > 0) {
      patterns.hasTimeSeries = true
      // Простая проверка на сезонность и тренды
      patterns.hasSeasonality = true // Упрощенно
      patterns.hasTrends = true // Упрощенно
    }
    
    // Проверяем географические данные
    const geoKeywords = ['country', 'city', 'region', 'state', 'province', 'location', 'lat', 'lng', 'latitude', 'longitude']
    const geoFields = analysis.fields.filter((f: any) => 
      geoKeywords.some(keyword => f.name.toLowerCase().includes(keyword))
    )
    if (geoFields.length > 0) {
      patterns.hasGeographicData = true
    }
    
    // Проверяем иерархические данные
    const hierarchicalKeywords = ['category', 'subcategory', 'parent', 'child', 'level', 'department', 'division']
    const hierarchicalFields = analysis.fields.filter((f: any) => 
      hierarchicalKeywords.some(keyword => f.name.toLowerCase().includes(keyword))
    )
    if (hierarchicalFields.length > 0) {
      patterns.hasHierarchicalData = true
    }
    
    // Проверяем корреляции
    const numericFields = analysis.fields.filter((f: any) => f.isNumeric)
    if (numericFields.length >= 2) {
      patterns.hasCorrelations = true
    }
    
    return patterns
  }

  const suggestChartTypes = (analysis: any, patterns: any, userIntent: string = ''): AIAnalysisResult => {
    const numericFields = analysis.fields.filter((f: any) => f.isNumeric)
    const categoricalFields = analysis.fields.filter((f: any) => f.isCategorical)
    const dateFields = analysis.fields.filter((f: any) => f.isDate)
    
    let chartType = 'bar'
    let xField = ''
    let yField = ''
    let colorField = ''
    let confidence = 0.7
    let reasoning = ''
    let insights: string[] = []
    let recommendations: string[] = []
    let statisticalTests: string[] = []
    
    // Анализируем намерение пользователя
    const intent = userIntent.toLowerCase()
    
    if (intent.includes('розподіл') || intent.includes('distribution')) {
      if (numericFields.length > 0) {
        chartType = 'histogram'
        xField = numericFields[0].name
        yField = numericFields[0].name
        reasoning = 'Гистограмма идеально подходит для показа распределения числовых данных'
        insights.push(`Поле ${xField} имеет ${numericFields[0].uniqueCount} уникальных значений`)
        statisticalTests.push('Тест на нормальность (Shapiro-Wilk)')
      } else if (categoricalFields.length > 0) {
        chartType = 'bar'
        xField = categoricalFields[0].name
        yField = ''
        reasoning = 'Столбчатая диаграмма показывает распределение категорий'
        insights.push(`Поле ${xField} содержит ${categoricalFields[0].uniqueCount} категорий`)
        statisticalTests.push('Хи-квадрат тест на равномерность')
      }
    } else if (intent.includes('кореляці') || intent.includes('correlation') || intent.includes('зв\'язок')) {
      if (numericFields.length >= 2) {
        chartType = 'scatter'
        xField = numericFields[0].name
        yField = numericFields[1].name
        reasoning = 'Диаграмма рассеяния показывает корреляцию между двумя числовыми переменными'
        insights.push(`Анализируем связь между ${xField} и ${yField}`)
        statisticalTests.push('Корреляция Пирсона')
        statisticalTests.push('Корреляция Спирмена')
        if (categoricalFields.length > 0) {
          colorField = categoricalFields[0].name
          insights.push(`Цветовая группировка по ${colorField}`)
        }
      }
    } else if (intent.includes('тренд') || intent.includes('trend') || intent.includes('час')) {
      if (dateFields.length > 0 && numericFields.length > 0) {
        chartType = 'line'
        xField = dateFields[0].name
        yField = numericFields[0].name
        reasoning = 'Линейный график показывает тренды во времени'
        insights.push(`Анализируем тренд ${yField} по времени`)
        statisticalTests.push('Тест на тренд (Mann-Kendall)')
        statisticalTests.push('Линейная регрессия')
      }
    } else if (intent.includes('порівнян') || intent.includes('compare')) {
      if (categoricalFields.length > 0 && numericFields.length > 0) {
        chartType = 'bar'
        xField = categoricalFields[0].name
        yField = numericFields[0].name
        reasoning = 'Столбчатая диаграмма для сравнения категорий'
        insights.push(`Сравниваем ${yField} между категориями ${xField}`)
        statisticalTests.push('ANOVA или t-тест')
      }
    } else if (intent.includes('пропорці') || intent.includes('proportion')) {
      if (categoricalFields.length > 0) {
        chartType = 'pie'
        xField = categoricalFields[0].name
        yField = ''
        reasoning = 'Круговая диаграмма показывает пропорции'
        insights.push(`Показываем пропорции категорий в ${xField}`)
        statisticalTests.push('Хи-квадрат тест на пропорции')
      }
    } else {
      // Автоматический выбор на основе структуры данных
      if (patterns.hasTimeSeries && numericFields.length > 0) {
        chartType = 'line'
        xField = dateFields[0].name
        yField = numericFields[0].name
        reasoning = 'Обнаружены временные данные - используем линейный график'
        insights.push('Данные содержат временную компоненту')
      } else if (patterns.hasGeographicData) {
        chartType = 'scatter'
        // Находим координаты
        const coordFields = analysis.fields.filter((f: any) => 
          f.name.toLowerCase().includes('lat') || f.name.toLowerCase().includes('lng')
        )
        if (coordFields.length >= 2) {
          xField = coordFields[0].name
          yField = coordFields[1].name
          reasoning = 'Обнаружены географические координаты - используем диаграмму рассеяния'
          insights.push('Данные содержат географическую информацию')
        }
      } else if (numericFields.length >= 2) {
        chartType = 'scatter'
        xField = numericFields[0].name
        yField = numericFields[1].name
        reasoning = 'Множественные числовые поля - анализируем корреляции'
        insights.push('Обнаружены потенциальные корреляции')
        statisticalTests.push('Корреляционный анализ')
      } else if (categoricalFields.length > 0 && numericFields.length > 0) {
        chartType = 'bar'
        xField = categoricalFields[0].name
        yField = numericFields[0].name
        reasoning = 'Смешанные типы данных - сравниваем категории'
        insights.push('Сравнительный анализ категорий')
      } else if (categoricalFields.length >= 2) {
        chartType = 'pie'
        xField = categoricalFields[0].name
        yField = ''
        reasoning = 'Категориальные данные - показываем пропорции'
        insights.push('Анализ пропорций категорий')
      } else if (numericFields.length === 1) {
        chartType = 'histogram'
        xField = numericFields[0].name
        yField = numericFields[0].name
        reasoning = 'Одно числовое поле - анализируем распределение'
        insights.push('Анализ распределения числовых данных')
      }
    }
    
    // Генерируем рекомендации
    if (numericFields.length > 0) {
      recommendations.push('Проведите описательную статистику')
    }
    if (patterns.hasCorrelations) {
      recommendations.push('Выполните корреляционный анализ')
    }
    if (patterns.hasTimeSeries) {
      recommendations.push('Анализируйте сезонность и тренды')
    }
    if (analysis.qualityMetrics.completeness < 0.9) {
      recommendations.push('Обработайте пропущенные значения')
    }
    
    return {
      chartType,
      xField,
      yField,
      colorField,
      confidence,
      reasoning,
      insights,
      recommendations,
      statisticalTests
    }
  }

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    try {
      // Шаг 1: Анализ структуры данных
      setAnalysisStep('Анализирую структуру данных...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      const structureAnalysis = analyzeDataStructure()
      
      // Шаг 2: Поиск паттернов
      setAnalysisStep('Ищу паттерны в данных...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      const patterns = detectDataPatterns(structureAnalysis)
      
      // Шаг 3: Генерация рекомендаций
      setAnalysisStep('Генерирую рекомендации...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      const result = suggestChartTypes(structureAnalysis, patterns, userPrompt)
      
      setAnalysisResult(result)
      setAnalysisStep('')
      
      // Создаем ChartSpec для автоматического применения
      const chartSpec: ChartSpec = {
        id: Math.random().toString(36).substr(2, 9),
        title: `AI Suggested ${result.chartType.charAt(0).toUpperCase() + result.chartType.slice(1)} - ${dataProfile.name}`,
        data: {
          sourceId: dataProfile.id
        },
        mark: result.chartType as ChartMark,
        encoding: {
          x: result.xField ? { field: result.xField, type: 'nominal' } : undefined,
          y: result.yField ? { field: result.yField, type: 'quantitative' } : undefined,
          color: result.colorField ? { field: result.colorField, type: 'nominal' } : undefined
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
      
      onChartSuggestion(chartSpec)
      onAnalysisComplete(result)
      
    } catch (error) {
      console.error('AI Analysis error:', error)
      setAnalysisStep('Ошибка анализа')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getChartIcon = (chartType: string) => {
    const Icon = CHART_TYPE_ICONS[chartType as keyof typeof CHART_TYPE_ICONS] || BarChart3
    return <Icon className="h-5 w-5" />
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Brain className="h-5 w-5" />
            AI Data Analyst
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Prompt */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Что вы хотите проанализировать?
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Например:
• Покажи розподіл користувачів за іменами
• Знайди кореляції між полями  
• Покажи тренди за часом
• Порівняй категорії
• Покажи пропорції
• Автоматичний аналіз (оставьте пустым)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setUserPrompt('Покажи розподіл даних')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Activity className="h-3 w-3 mr-1" />
              Розподіл
            </Button>
            <Button
              onClick={() => setUserPrompt('Знайди кореляції між полями')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Кореляції
            </Button>
            <Button
              onClick={() => setUserPrompt('Покажи тренди за часом')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Тренди
            </Button>
            <Button
              onClick={() => setUserPrompt('Порівняй категорії')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Порівняння
            </Button>
            <Button
              onClick={() => setUserPrompt('Покажи пропорції')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <PieChart className="h-3 w-3 mr-1" />
              Пропорції
            </Button>
          </div>

          {/* Analysis Button */}
          <div className="flex gap-3">
            <Button
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  {analysisStep}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Запустити AI Аналіз
                </>
              )}
            </Button>
            
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              size="sm"
            >
              {showAdvanced ? 'Скрыть детали' : 'Показать детали'}
            </Button>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  AI анализирует данные...
                </span>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                {analysisStep}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    AI Анализ завершен
                  </h4>
                </div>
                
                {/* Chart Recommendation */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getChartIcon(analysisResult.chartType)}
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Рекомендуемый тип: {analysisResult.chartType.toUpperCase()}
                    </span>
                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      Уверенность: {Math.round(analysisResult.confidence * 100)}%
                    </span>
                  </div>
                  
                  <div className="text-sm text-green-700 dark:text-green-300 mb-2">
                    <strong>Поля:</strong> X: {analysisResult.xField || 'не выбрано'}, 
                    Y: {analysisResult.yField || 'не выбрано'}
                    {analysisResult.colorField && `, Цвет: ${analysisResult.colorField}`}
                  </div>
                  
                  <div className="text-sm text-green-700 dark:text-green-300">
                    <strong>Обоснование:</strong> {analysisResult.reasoning}
                  </div>
                </div>

                {/* Insights */}
                {analysisResult.insights.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      Инсайты
                    </h5>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      {analysisResult.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {analysisResult.recommendations.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      Рекомендации
                    </h5>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Statistical Tests */}
                {analysisResult.statisticalTests.length > 0 && (
                  <div>
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Статистические тесты
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.statisticalTests.map((test, index) => (
                        <span key={index} className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced Details */}
          {showAdvanced && (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Детали анализа данных
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Структура данных
                  </h5>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400">
                    <div>Строк: {dataProfile.rowCount}</div>
                    <div>Колонок: {dataProfile.columnCount}</div>
                    <div>Размер: {Math.round(dataProfile.size / 1024)} KB</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Типы полей
                  </h5>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400">
                    {dataProfile.fields.map(field => (
                      <div key={field.name}>
                        {field.name}: {field.type} ({field.uniqueValues} уникальных)
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
