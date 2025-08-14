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
          setCreatedCharts(charts)
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

  const handleChartCreated = (chartSpec: any) => {
    const newChart = {
      ...chartSpec,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const updatedCharts = [...createdCharts, newChart]
    setCreatedCharts(updatedCharts)
    
    // Зберігаємо в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCharts', JSON.stringify(updatedCharts))
    }
    
    console.log('Чарт створено та збережено:', newChart.title)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">DataViz Playground</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
                             <Button
                 variant="outline"
                 onClick={() => window.location.href = './dashboards'}
                 disabled={createdCharts.length === 0}
                 className="flex items-center gap-2"
               >
                 <FileText className="h-4 w-4" />
                 View Dashboard
               </Button>
               
               <Button
                 variant="outline"
                 onClick={() => window.location.href = './stories'}
                 disabled={createdCharts.length === 0}
                 className="flex items-center gap-2"
               >
                 <BookOpen className="h-4 w-4" />
                 Create Story
               </Button>
               
               <Button
                 variant="outline"
                 onClick={() => window.location.href = './settings'}
                 className="flex items-center gap-2"
               >
                 <Settings className="h-4 w-4" />
                 Settings
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload & Chart Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <FileUpload onDataUploaded={handleDataUploaded} />
            
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
            <AIAssistant dataProfile={dataProfile} />
            
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
                      {createdCharts[createdCharts.length - 1]?.createdAt?.toLocaleDateString() || 'N/A'}
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
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 Why Choose DataViz Playground?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Get intelligent chart recommendations and automatic data analysis powered by advanced AI models.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Export</h3>
                <p className="text-gray-600">
                  Your visualizations as production-ready code in Python (Plotly, Matplotlib) or R (ggplot2, Plotly).
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Universal Data Support</h3>
                <p className="text-gray-600">
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
