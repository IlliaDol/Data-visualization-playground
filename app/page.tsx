'use client'

import React, { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ChartBuilder } from '@/components/ChartBuilder'
import { DataProfile, ChartSpec } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Upload, Sparkles, Code, Download } from 'lucide-react'
import { AIAssistant } from '@/components/AIAssistant'

export default function HomePage() {
  const [dataProfile, setDataProfile] = useState<DataProfile | null>(null)
  const [currentChart, setCurrentChart] = useState<ChartSpec | null>(null)
  const [step, setStep] = useState<'upload' | 'build' | 'complete'>('upload')

  const handleFileProcessed = (profile: DataProfile) => {
    setDataProfile(profile)
    setStep('build')
  }

  const handleChartCreated = (chart: ChartSpec) => {
    setCurrentChart(chart)
    setStep('complete')
    
    // Зберігаємо чарт в localStorage
    const savedCharts = localStorage.getItem('userCharts')
    let charts = []
    if (savedCharts) {
      try {
        charts = JSON.parse(savedCharts)
      } catch (error) {
        console.error('Помилка завантаження існуючих чартів:', error)
        charts = []
      }
    }
    
    // Додаємо новий чарт
    charts.push(chart)
    localStorage.setItem('userCharts', JSON.stringify(charts))
    
    console.log('Чарт збережено:', chart.title)
  }

  const handleError = (error: string) => {
    console.error('Error:', error)
    // You could show a toast notification here
  }

  const resetToUpload = () => {
    setDataProfile(null)
    setCurrentChart(null)
    setStep('upload')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Data Visualization Playground
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your data, create beautiful visualizations with AI assistance, 
            and export code in Python or R. All in one powerful platform.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="hidden sm:inline">Upload Data</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'build' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'build' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="hidden sm:inline">Build Chart</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'complete' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'complete' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="hidden sm:inline">Export & Share</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {step === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FileUpload 
                onFileProcessed={handleFileProcessed}
                onError={handleError}
              />
            </div>
            <div className="lg:col-span-1">
              <AIAssistant 
                onChartSuggestion={(chartSpec) => {
                  // Handle AI chart suggestion
                  console.log('AI suggested chart:', chartSpec)
                }}
              />
            </div>
          </div>
        )}

        {step === 'build' && dataProfile && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Your Visualization</h2>
                <p className="text-gray-600">
                  Working with: {dataProfile.name} ({dataProfile.rowCount} rows, {dataProfile.columnCount} columns)
                </p>
              </div>
              <Button variant="outline" onClick={resetToUpload}>
                Upload New Data
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartBuilder 
                  dataProfile={dataProfile}
                  onChartCreated={handleChartCreated}
                />
              </div>
              <div className="lg:col-span-1">
                <AIAssistant 
                  dataProfile={dataProfile}
                  onChartSuggestion={(chartSpec) => {
                    // Handle AI chart suggestion
                    console.log('AI suggested chart:', chartSpec)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {step === 'complete' && currentChart && dataProfile && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chart Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your &quot;{currentChart.title}&quot; chart is ready. What would you like to do next?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Export Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    Python (Plotly)
                  </Button>
                  <Button className="w-full" variant="outline">
                    Python (Matplotlib)
                  </Button>
                  <Button className="w-full" variant="outline">
                    R (ggplot2)
                  </Button>
                  <Button className="w-full" variant="outline">
                    R (Plotly)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    PNG (High Res)
                  </Button>
                  <Button className="w-full" variant="outline">
                    SVG (Vector)
                  </Button>
                  <Button className="w-full" variant="outline">
                    PDF (Print Ready)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      // Перевіряємо чи є чарти перед переглядом dashboard
                      const savedCharts = localStorage.getItem('userCharts')
                      if (savedCharts) {
                        try {
                          const charts = JSON.parse(savedCharts)
                          if (charts.length > 0) {
                            window.location.href = '/dashboards'
                          } else {
                            alert('Спочатку створіть хоча б один чарт!')
                          }
                        } catch (error) {
                          alert('Спочатку створіть хоча б один чарт!')
                        }
                      } else {
                        alert('Спочатку створіть хоча б один чарт!')
                      }
                    }}
                  >
                    View Dashboard
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.location.href = '/dashboards'}
                  >
                    View All Dashboards
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      // Перевіряємо чи є чарти перед створенням історії
                      const savedCharts = localStorage.getItem('userCharts')
                      if (savedCharts) {
                        try {
                          const charts = JSON.parse(savedCharts)
                          if (charts.length > 0) {
                            window.location.href = '/stories'
                          } else {
                            alert('Спочатку створіть хоча б один чарт!')
                          }
                        } catch (error) {
                          alert('Спочатку створіть хоча б один чарт!')
                        }
                      } else {
                        alert('Спочатку створіть хоча б один чарт!')
                      }
                    }}
                  >
                    Create Story
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.location.href = '/stories'}
                  >
                    View All Stories
                  </Button>
                  <Button className="w-full" variant="outline">
                    Share Chart
                  </Button>
                  <Button className="w-full" onClick={resetToUpload}>
                    Start Over
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Chart Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Chart Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Title:</span>
                    <span className="ml-2">{currentChart.title}</span>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <span className="ml-2">{currentChart.mark}</span>
                  </div>
                  <div>
                    <span className="font-medium">X Axis:</span>
                    <span className="ml-2">{currentChart.encoding.x?.field || 'None'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Y Axis:</span>
                    <span className="ml-2">{currentChart.encoding.y?.field || 'None'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">🚀 Why Choose DataViz Playground?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Get intelligent chart recommendations and automatic data analysis 
                  powered by advanced AI models.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Code Export</h3>
                <p className="text-gray-600">
                  Export your visualizations as production-ready code in Python 
                  (Plotly, Matplotlib) or R (ggplot2, Plotly).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Universal Data Support</h3>
                <p className="text-gray-600">
                  Import data from CSV, Excel, JSON, and more. Process files up to 
                  200MB with advanced data profiling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
