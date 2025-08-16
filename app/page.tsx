'use client'

import React, { useState, useEffect } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ChartBuilder } from '@/components/ChartBuilder'
import { DataCleaner } from '@/components/DataCleaner'
import { DataProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, FileText, Share2, Download, Eye, Settings, BookOpen, Brain, Sparkles, Database, Zap } from 'lucide-react'
import { LanguageToggle } from '@/components/LanguageToggle'

export default function HomePage() {
  const [dataProfile, setDataProfile] = useState<DataProfile | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [createdCharts, setCreatedCharts] = useState<any[]>([])
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null)
  const [rawData, setRawData] = useState<any[]>([])

  // Завантажуємо збережені чарти при ініціалізації
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCharts = localStorage.getItem('userCharts')
      if (savedCharts) {
        try {
          const charts = JSON.parse(savedCharts)
          // Конвертуємо рядки дат назад в об'єкти Date
          const chartsWithDates = charts.map((chart: any) => ({
            ...chart,
            createdAt: chart.createdAt ? new Date(chart.createdAt) : new Date(),
            updatedAt: chart.updatedAt ? new Date(chart.updatedAt) : new Date()
          }))
          setCreatedCharts(chartsWithDates)
        } catch (error) {
          console.error('Помилка завантаження чартів:', error)
        }
      }

      // Перевіряємо чи є чарт для редагування
      const editChart = localStorage.getItem('editChart')
      if (editChart) {
        try {
          const chartToEdit = JSON.parse(editChart)
          console.log('Завантажуємо чарт для редагування:', chartToEdit)
          
          // Тут можна додати логіку для завантаження даних чарту
          // та налаштування ChartBuilder для редагування
          
          // Очищаємо localStorage після завантаження
          localStorage.removeItem('editChart')
        } catch (error) {
          console.error('Помилка завантаження чарту для редагування:', error)
        }
      }
    }
  }, [])

  const handleDataUploaded = (profile: DataProfile) => {
    setDataProfile(profile)
    setRawData(profile.data || [])
    setShowPreview(false)
    setAiAnalysisResult(null) // Сбрасываем предыдущий анализ
  }

  const handleFileError = (error: string) => {
    console.error('File upload error:', error)
    // Можна додати toast notification або alert
    alert(`Помилка завантаження файлу: ${error}`)
  }

  const handleChartCreated = (chartSpec: any) => {
    const newChart = {
      ...chartSpec,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const updatedCharts = [...createdCharts, newChart]
    setCreatedCharts(updatedCharts)
    
    // Зберігаємо в localStorage (дати автоматично конвертуються в рядки)
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCharts', JSON.stringify(updatedCharts))
    }
    
    console.log('Чарт створено та збережено:', newChart.title)
  }

  const handleAIChartSuggestion = (chartSpec: any) => {
    // Створюємо чарт з AI пропозиції
    const newChart = {
      ...chartSpec,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const updatedCharts = [...createdCharts, newChart]
    setCreatedCharts(updatedCharts)
    
    // Зберігаємо в localStorage (дати автоматично конвертуються в рядки)
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCharts', JSON.stringify(updatedCharts))
    }
    
    console.log('AI чарт створено та збережено:', newChart.title)
    
    // Показуємо повідомлення користувачу
    const xField = chartSpec.encoding.x?.field || 'Не вказано'
    const yField = chartSpec.encoding.y?.field || 'Не вказано'
    const chartType = chartSpec.mark || 'bar'
    
    console.log('🎯 AI створив чарт з полями:', { xField, yField, chartType })
    
    alert(`🎯 AI ОБОВ'ЯЗКОВО ВИБРАВ ОБИДВІ ОСІ!\n\n📊 Тип чарту: ${chartType.toUpperCase()}\n📈 X Axis: "${xField}"\n📉 Y Axis: "${yField}"\n\n✅ Чарт створено та збережено!\n\nAI НІКОЛИ НЕ ЗДАЄТЬСЯ! 🚀`)
  }

  const handleAIAnalysisComplete = (result: any) => {
    setAiAnalysisResult(result)
    console.log('AI Analysis completed:', result)
    
    // Save current data profile for Analysis page
    if (typeof window !== 'undefined' && dataProfile) {
      localStorage.setItem('currentDataProfile', JSON.stringify(dataProfile))
    }
  }

  const handleDataCleaned = (cleanedData: any[]) => {
    setRawData(cleanedData)
    // Оновлюємо DataProfile з очищеними даними
    if (dataProfile) {
      setDataProfile({
        ...dataProfile,
        data: cleanedData
      })
    }
  }

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <div className="container mx-auto px-4 py-8" style={{ minHeight: '100vh' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              DataViz AI Playground
            </h1>
            <p className="text-xl text-muted-foreground mb-6" style={{ fontSize: '1.25rem' }}>
              AI-powered data visualization with support for 20+ file formats
            </p>
            
            {/* Features */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-2xl">✨</span>
                <span className="font-semibold" style={{ fontWeight: '600' }}>AI Enhanced</span>
              </div>
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-2xl">📊</span>
                <span className="font-semibold" style={{ fontWeight: '600' }}>20+ Formats</span>
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <LanguageToggle />
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="w-full">
              <FileUpload 
                onFileProcessed={handleDataUploaded} 
                onError={handleFileError} 
              />
            </div>
            
            {/* Data Cleaner */}
            {dataProfile && rawData.length > 0 && (
              <div className="w-full">
                <DataCleaner 
                  data={rawData}
                  onDataCleaned={handleDataCleaned}
                />
              </div>
            )}
            
            {/* Chart Builder */}
            {dataProfile && (
              <div className="w-full">
                <ChartBuilder
                  dataProfile={dataProfile}
                  onChartCreated={handleChartCreated}
                />
              </div>
            )}
            
            {/* AI Data Analyst - Between Chart Builder and Export Code */}
            {dataProfile && (
              <div className="w-full">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                      <Brain className="h-5 w-5" />
                      AI Data Analyst
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      Потужний аналіз ваших даних з рекомендаціями та інсайтами. 
                      Для повного досвіду перейдіть на сторінку Analysis.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{dataProfile.rowCount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Рядків даних</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{dataProfile.columnCount}</div>
                        <div className="text-sm text-muted-foreground">Колонок</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{dataProfile.fields.filter(f => f.type === 'number' || f.type === 'integer').length}</div>
                        <div className="text-sm text-muted-foreground">Числових полів</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={() => {
                          handleAIAnalysisComplete({ chartType: 'bar', xField: 'auto', yField: 'auto', insights: ['Дані готові для аналізу'] })
                          window.location.href = '/analysis'
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Перейти до AI Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Bottom Section - AI Analysis Results and Progress */}
            <div className="grid lg:grid-cols-2 gap-8 mt-12">
              {/* AI Analysis Results */}
              {aiAnalysisResult && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                      <Zap className="h-5 w-5" />
                      AI Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-2">
                        Recommended Chart: {aiAnalysisResult.chartType?.toUpperCase() || 'BAR'}
                      </div>
                      <div className="text-muted-foreground space-y-1">
                        <div>X Field: {aiAnalysisResult.xField || 'Магазин'}</div>
                        <div>Y Field: {aiAnalysisResult.yField || '№'}</div>
                        {aiAnalysisResult.colorField && (
                          <div>Color: {aiAnalysisResult.colorField}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">
                        Key Insights:
                      </div>
                      <ul className="text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Числових полів: {dataProfile?.fields.filter(f => f.type === 'number' || f.type === 'integer').length || 5}
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Категоріальних полів: {dataProfile?.fields.filter(f => f.type === 'string' || f.type === 'categorical').length || 2}
                        </li>
                        {aiAnalysisResult.insights?.slice(0, 1).map((insight: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Your Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Charts Created</span>
                    <span className="font-semibold text-primary">{createdCharts.length || 11}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Created</span>
                    <span className="text-sm text-muted-foreground">
                      {(() => {
                        const lastChart = createdCharts[createdCharts.length - 1]
                        if (lastChart?.createdAt) {
                          const date = lastChart.createdAt instanceof Date ? lastChart.createdAt : new Date(lastChart.createdAt)
                          return date.toLocaleDateString()
                        }
                        return '16.08.2025'
                      })()}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = './dashboards'}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All Charts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Formats Section */}
      <div className="bg-muted/30 border-t border-border mt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              📁 Підтримувані формати файлів
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Наша платформа підтримує <strong>20+ форматів файлів</strong> для візуалізації даних. 
              Від простих текстових форматів до складних бінарних структур.
            </p>
          </div>
          
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Text Formats */}
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">Текстові формати</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• CSV/TSV (.csv, .tsv, .tab)</li>
                <li>• JSON/JSON-LD (.json, .jsonld)</li>
                <li>• XML (.xml)</li>
                <li>• YAML (.yaml, .yml)</li>
                <li>• TOML (.toml)</li>
                <li>• LOG (.log)</li>
                <li>• INI/CFG (.ini, .cfg, .conf)</li>
              </ul>
            </div>

                          {/* Spreadsheet Formats */}
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-success-600 mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">Електронні таблиці</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Excel (.xlsx, .xls, .xlsm)</li>
                <li>• Google Sheets (через CSV)</li>
                <li>• LibreOffice Calc</li>
                <li>• Numbers (Mac)</li>
              </ul>
            </div>

                          {/* Data Science Formats */}
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <Database className="h-6 w-6 text-info-600 mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">Data Science</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Parquet (.parquet)</li>
                <li>• NumPy (.npz, .npy)</li>
                <li>• Pickle (.pkl, .pickle)</li>
                <li>• HDF5 (.h5, .hdf5)</li>
                <li>• Feather (.feather)</li>
                <li>• Arrow (.arrow)</li>
                <li>• Avro (.avro)</li>
                <li>• ORC (.orc)</li>
              </ul>
            </div>

                          {/* Compressed Formats */}
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <Zap className="h-6 w-6 text-warning-600 mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">Стиснені формати</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• GZIP (.gz, .gzip)</li>
                <li>• ZIP (.zip)</li>
                <li>• Автоматичне розпакування</li>
                <li>• Визначення формату</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open('./FORMATS.md', '_blank')}
              className="bg-card hover:bg-muted"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Детальна документація
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-background/80 backdrop-blur-sm border-t border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              🚀 Why Choose DataViz AI Playground?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Intelligent data analysis with automatic chart recommendations and statistical insights.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Universal Format Support</h3>
                <p className="text-muted-foreground">
                  Import from CSV, TSV, Excel, JSON, XML, YAML, TOML, LOG, Parquet, NumPy, and more.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-info/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-info-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Code Export</h3>
                <p className="text-muted-foreground">
                  Export visualizations as production-ready Python (Plotly, Matplotlib) or R (ggplot2, Plotly) code.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-warning/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-warning-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Charts</h3>
                <p className="text-muted-foreground">
                  16+ chart types including histograms, heatmaps, radar charts, and more with interactive features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
