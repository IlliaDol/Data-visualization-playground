'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Download } from 'lucide-react'



export default function SettingsPage() {
  const [settings, setSettings] = useState({
    language: 'uk'
  })

  // Отримуємо статистику даних
  const getDataStats = () => {
    if (typeof window === 'undefined') return { chartsCount: 0, storiesCount: 0 }
    
    const savedCharts = localStorage.getItem('userCharts')
    const savedStories = localStorage.getItem('userStories')
    
    let chartsCount = 0
    let storiesCount = 0
    
    if (savedCharts) {
      try {
        const charts = JSON.parse(savedCharts)
        chartsCount = charts.length
      } catch (error) {
        chartsCount = 0
      }
    }
    
    if (savedStories) {
      try {
        const stories = JSON.parse(savedStories)
        storiesCount = stories.length
      } catch (error) {
        storiesCount = 0
      }
    }
    
    return { chartsCount, storiesCount }
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }




  return (
    <div className="min-h-screen bg-background p-8 transition-all duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Налаштування</h1>
          <p className="text-muted-foreground mt-1">
            Налаштуйте ваші уподобання для Data Visualization Playground
          </p>
        </div>



        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground font-bold">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-md">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Мова / Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground text-lg"
                >
                  <option value="uk">🇺🇦 Українська</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="ru">🇷🇺 Русский</option>
                </select>
                <p className="text-sm text-muted-foreground mt-2">
                  Оберіть мову інтерфейсу для кращого досвіду користування
                </p>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground font-bold">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const savedCharts = localStorage.getItem('userCharts')
                    const savedStories = localStorage.getItem('userStories')
                    const data = {
                      charts: savedCharts ? JSON.parse(savedCharts) : [],
                      stories: savedStories ? JSON.parse(savedStories) : [],
                      exportDate: new Date().toISOString()
                    }
                    const dataStr = JSON.stringify(data, null, 2)
                    const dataBlob = new Blob([dataStr], { type: 'application/json' })
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'dataviz-data.json'
                    link.click()
                    URL.revokeObjectURL(url)
                  }
                }}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export All Data
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (typeof window !== 'undefined' && confirm('Це видалить всі ваші чарти та історії. Це дію неможливо скасувати. Продовжити?')) {
                    localStorage.removeItem('userCharts')
                    localStorage.removeItem('userStories')
                    alert('Всі дані видалено!')
                    window.location.href = './'
                  }
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Download className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>• <strong>Export All Data:</strong> Зберегти всі ваші чарти та історії як файл</p>
              <p>• <strong>Clear All Data:</strong> Видалити всі ваші чарти та історії (незворотньо)</p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-foreground mb-2">Ваші дані:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Чарти:</span>
                  <span className="ml-2 font-medium text-foreground">{getDataStats().chartsCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Історії:</span>
                  <span className="ml-2 font-medium text-foreground">{getDataStats().storiesCount}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = './dashboards'}
                  disabled={getDataStats().chartsCount === 0}
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = './stories'}
                  disabled={getDataStats().storiesCount === 0}
                >
                  View Stories
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}
