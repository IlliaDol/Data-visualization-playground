'use client'

import React, { useState, useEffect } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ChartBuilder } from '@/components/ChartBuilder'
import { AIAssistant } from '@/components/AIAssistant'
import { DataProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, FileText, Share2, Download, Eye, Settings, BookOpen } from 'lucide-react'

export default function HomePage() {
  const [dataProfile, setDataProfile] = useState<DataProfile | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [createdCharts, setCreatedCharts] = useState<any[]>([])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload & Chart Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <FileUpload 
              onFileProcessed={handleDataUploaded} 
              onError={handleFileError} 
            />
            
            {/* Chart Builder */}
            {dataProfile && (
              <ChartBuilder
                dataProfile={dataProfile}
                showPreview={showPreview}
                onShowPreviewChange={setShowPreview}
                onChartCreated={handleChartCreated}
              />
            )}
          </div>
          
          {/* Right Column - AI Assistant */}
          <div className="space-y-6">
            <AIAssistant 
              dataProfile={dataProfile} 
              onChartSuggestion={handleAIChartSuggestion}
            />
            
            {/* Quick Stats */}
            {createdCharts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Charts Created</span>
                    <span className="font-semibold text-blue-600">{createdCharts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Created</span>
                    <span className="text-sm text-gray-500">
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

      {/* Footer */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Why Choose DataViz Playground?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get intelligent chart recommendations and automatic data analysis powered by advanced AI models.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Code Export</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your visualizations as production-ready code in Python (Plotly, Matplotlib) or R (ggplot2, Plotly).
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Universal Data Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Import data from CSV, Excel, JSON, and more. Process files up to 200MB with advanced data profiling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
