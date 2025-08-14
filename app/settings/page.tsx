'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  Key, 
  Palette, 
  Globe, 
  Download, 
  Upload,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    autoSave: true,
    notifications: true,
    openAIKey: 'sk-...',
    anthropicKey: 'sk-ant-...',
    deepseekKey: 'sk-09ee0e2559ef4beda180ebdc00b4c63b'
  })

  // Отримуємо статистику даних
  const getDataStats = () => {
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

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('dataviz-settings', JSON.stringify(settings))
    console.log('Settings saved:', settings)
  }

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dataviz-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
        } catch (error) {
          console.error('Error importing settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure your Data Visualization Playground preferences
          </p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="en">English</option>
                  <option value="uk">Українська</option>
                  <option value="de">Deutsch</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Auto-save charts
                  </label>
                  <p className="text-sm text-gray-500">
                    Automatically save your work as you create charts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Show notifications for chart completion and errors
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.openAIKey}
                  onChange={(e) => handleSettingChange('openAIKey', e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                  placeholder="sk-..."
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-2"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anthropic API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.anthropicKey}
                  onChange={(e) => handleSettingChange('anthropicKey', e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                  placeholder="sk-ant-..."
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-2"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DeepSeek API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.deepseekKey}
                  onChange={(e) => handleSettingChange('deepseekKey', e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                  placeholder="sk-..."
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-2"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export/Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Settings Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleExportSettings}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Settings
              </Button>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                  id="import-settings"
                />
                <label htmlFor="import-settings">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                      Import Settings
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
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
                }}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export All Data
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Це видалить всі ваші чарти та історії. Це дію неможливо скасувати. Продовжити?')) {
                    localStorage.removeItem('userCharts')
                    localStorage.removeItem('userStories')
                    alert('Всі дані видалено!')
                    window.location.href = '/'
                  }
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Download className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>• <strong>Export All Data:</strong> Зберегти всі ваші чарти та історії як файл</p>
              <p>• <strong>Clear All Data:</strong> Видалити всі ваші чарти та історії (незворотньо)</p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Ваші дані:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Чарти:</span>
                  <span className="ml-2 font-medium">{getDataStats().chartsCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Історії:</span>
                  <span className="ml-2 font-medium">{getDataStats().storiesCount}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/dashboards'}
                  disabled={getDataStats().chartsCount === 0}
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/stories'}
                  disabled={getDataStats().storiesCount === 0}
                >
                  View Stories
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
