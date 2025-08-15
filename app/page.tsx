'use client'

import React, { useState, useEffect } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ChartBuilder } from '@/components/ChartBuilder'
import { AIAssistant } from '@/components/AIAssistant'
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
    }
  }, [])

  const handleDataUploaded = (profile: DataProfile) => {
    setDataProfile(profile)
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted transition-all duration-300">
      <div className="container mx-auto px-4 py-8" style={{ minHeight: '100vh' }}>
        <div className="max-w-4xl mx-auto">
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* File Upload Section */}
            <div className="lg:col-span-2">
              <FileUpload 
                onFileProcessed={handleDataUploaded} 
                onError={handleFileError} 
              />
              
              {/* Chart Builder */}
              {dataProfile && (
                <ChartBuilder
                  dataProfile={dataProfile}
                  onChartCreated={handleChartCreated}
                />
              )}
            </div>

            {/* AI Assistant Section */}
            <div className="lg:col-span-1">
              <AIAssistant 
                dataProfile={dataProfile} 
                onChartSuggestion={handleAIChartSuggestion}
                onAnalysisComplete={handleAIAnalysisComplete}
              />
              
              {/* AI Analysis Results */}
              {aiAnalysisResult && (
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-900 dark:text-green-100">
                      <Zap className="h-5 w-5" />
                      AI Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium text-green-800 dark:text-green-200 mb-2">
                        Recommended Chart: {aiAnalysisResult.chartType.toUpperCase()}
                      </div>
                      <div className="text-green-700 dark:text-green-300 space-y-1">
                        <div>X Field: {aiAnalysisResult.xField || 'Not specified'}</div>
                        <div>Y Field: {aiAnalysisResult.yField || 'Not specified'}</div>
                        {aiAnalysisResult.colorField && (
                          <div>Color: {aiAnalysisResult.colorField}</div>
                        )}
                      </div>
                    </div>
                    
                    {aiAnalysisResult.insights && aiAnalysisResult.insights.length > 0 && (
                      <div className="text-sm">
                        <div className="font-medium text-green-800 dark:text-green-200 mb-1">
                          Key Insights:
                        </div>
                        <ul className="text-green-700 dark:text-green-300 space-y-1">
                          {aiAnalysisResult.insights.slice(0, 3).map((insight: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Quick Stats */}
              {createdCharts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Charts Created</span>
                      <span className="font-semibold text-primary">{createdCharts.length}</span>
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
                          return 'N/A'
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Supported Formats Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16 transition-all duration-300">
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
