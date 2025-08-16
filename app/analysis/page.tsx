'use client'

import { useState, useEffect } from 'react'
import { AIAssistant } from '@/components/AIAssistant'
import { DataProfile } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Database, TrendingUp, Zap } from 'lucide-react'

export default function AnalysisPage() {
  const [dataProfile, setDataProfile] = useState<DataProfile | null>(null)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    // Load current data profile from localStorage or context
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('currentDataProfile')
      if (savedProfile) {
        try {
          setDataProfile(JSON.parse(savedProfile))
        } catch (error) {
          console.error('Error loading data profile:', error)
        }
      }

      // Load all projects
      const savedCharts = localStorage.getItem('userCharts')
      if (savedCharts) {
        try {
          const charts = JSON.parse(savedCharts)
          setProjects(charts)
        } catch (error) {
          console.error('Error loading projects:', error)
        }
      }
    }
  }, [])

  const handleChartSuggestion = (chartSpec: any) => {
    // Save the suggested chart
    const newChart = {
      ...chartSpec,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const updatedCharts = [...projects, newChart]
    setProjects(updatedCharts)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCharts', JSON.stringify(updatedCharts))
    }
    
    console.log('AI chart created from Analysis page:', newChart.title)
  }

  const handleAnalysisComplete = (result: any) => {
    console.log('Analysis completed:', result)
    // You can add additional logic here to handle analysis results
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Brain className="h-10 w-10 text-primary" />
              AI Analysis Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Потужний AI помічник для аналізу даних та управління проєктами
            </p>
          </div>

          {/* Main AI Assistant */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* AI Assistant - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <div className="h-[600px]">
                <AIAssistant 
                  dataProfile={dataProfile} 
                  onChartSuggestion={handleChartSuggestion}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </div>
            </div>

            {/* Project Overview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Data Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5" />
                    Статус даних
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dataProfile ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Назва:</span>
                        <span className="text-sm font-medium">{dataProfile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Рядків:</span>
                        <span className="text-sm font-medium">{dataProfile.rowCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Колонок:</span>
                        <span className="text-sm font-medium">{dataProfile.columnCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Розмір:</span>
                        <span className="text-sm font-medium">{dataProfile.size.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Дані не завантажено</p>
                      <p className="text-xs">Перейдіть на Playground для завантаження</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Статистика проєктів
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Всього чартів</span>
                    <span className="font-semibold text-primary">{projects.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Останній створений</span>
                    <span className="text-sm text-muted-foreground">
                      {projects.length > 0 
                        ? new Date(projects[projects.length - 1]?.createdAt || new Date()).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                  {projects.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-2">Типи чартів:</div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(projects.map(p => p.mark || 'bar'))).map(type => (
                          <span 
                            key={type} 
                            className="px-2 py-1 bg-muted rounded text-xs"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Capabilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5" />
                    AI Можливості
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Автоматичний аналіз даних</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Рекомендації чартів</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Пошук патернів та кореляцій</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Статистичні інсайти</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Управління проєктами</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Експорт та поділ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
