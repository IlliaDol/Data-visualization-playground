'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor, Check, Sparkles } from 'lucide-react'

export function ThemeDemo() {
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark' | 'auto'>('auto')
  const [effectiveTheme, setEffectiveTheme] = React.useState<'light' | 'dark'>('light')

  const themes = [
    {
      name: 'Light',
      icon: Sun,
      description: 'Світла тема для денного використання',
      class: 'light',
      features: ['Чіткий контраст', 'Зменшена втома очей', 'Ідеально для денного часу']
    },
    {
      name: 'Dark',
      icon: Moon,
      description: 'Темна тема для нічного використання',
      class: 'dark',
      features: ['Зменшена втома очей', 'Економія батареї', 'Ідеально для нічного часу']
    },
    {
      name: 'Auto',
      icon: Monitor,
      description: 'Автоматичне перемикання за системними налаштуваннями',
      class: 'auto',
      features: ['Адаптивність', 'Системна інтеграція', 'Автоматичне перемикання']
    }
  ]

  const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    
    let newEffectiveTheme: 'light' | 'dark'
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      newEffectiveTheme = prefersDark ? 'dark' : 'light'
      root.classList.add(newEffectiveTheme)
    } else {
      newEffectiveTheme = theme
      root.classList.add(theme)
    }
    
    setCurrentTheme(theme)
    setEffectiveTheme(newEffectiveTheme)
  }

  const getCurrentEffectiveTheme = (): 'light' | 'dark' => {
    if (currentTheme === 'auto') {
      if (typeof window !== 'undefined' && mounted) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return 'light' // fallback для серверного рендерингу
    }
    return currentTheme
  }

  // Додаємо стан для відстеження монтування
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Ініціалізуємо effectiveTheme
    const initialEffectiveTheme = getCurrentEffectiveTheme()
    setEffectiveTheme(initialEffectiveTheme)
  }, [])

  // Не рендеримо нічого до монтування
  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 w-8 animate-pulse bg-muted rounded" />
            <h2 className="text-4xl font-bold text-foreground">
              🎨 Система Тем
            </h2>
            <div className="h-8 w-8 animate-pulse bg-muted rounded" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Завантаження...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="text-4xl font-bold text-foreground">
            🎨 Система Тем
          </h2>
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Виберіть тему, яка найкраще підходить для вашого середовища та стилю роботи
        </p>
      </div>

      {/* Theme Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const Icon = theme.icon
          const isActive = currentTheme === theme.class
          
          return (
            <Card 
              key={theme.class}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isActive 
                  ? 'ring-2 ring-primary shadow-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900' 
                  : 'hover:shadow-lg hover:bg-gradient-to-br hover:from-muted/50 hover:to-muted/30'
              }`}
              onClick={() => applyTheme(theme.class as 'light' | 'dark' | 'auto')}
            >
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                    : 'bg-muted text-muted-foreground hover:bg-primary/10'
                }`}>
                  <Icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">{theme.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {theme.description}
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  {theme.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  className="w-full transition-all duration-200"
                >
                  {isActive ? '✅ Активна' : 'Вибрати'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Theme Info */}
      <Card className={`${
        effectiveTheme === 'dark' 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-primary-50 to-secondary-50 border-gray-200'
      }`}>
        <CardContent className="pt-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success-500 animate-pulse"></div>
              <p className="text-lg font-medium text-foreground">
                Поточна тема: <span className="font-bold text-primary">{themes.find(t => t.class === currentTheme)?.name}</span>
              </p>
              <div className="w-3 h-3 rounded-full bg-success-500 animate-pulse"></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentTheme === 'auto' 
                ? `Системна тема: ${effectiveTheme === 'dark' ? '🌙 Темна' : '☀️ Світла'}`
                : '🎯 Ручне налаштування'
              }
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Monitor className="h-3 w-3" />
              <span>Ефективна тема: {effectiveTheme === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}
