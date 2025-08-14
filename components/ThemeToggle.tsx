'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon, Monitor, Sparkles, Check, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Theme = 'light' | 'dark' | 'auto'

const themeInfo = {
  light: {
    name: 'Light',
    icon: Sun,
    description: 'Світла тема',
    features: ['Чіткий контраст', 'Денне використання', 'Професійний вигляд'],
    color: 'text-yellow-600'
  },
  dark: {
    name: 'Dark',
    icon: Moon,
    description: 'Темна тема',
    features: ['Зменшена втома очей', 'Нічне використання', 'Економія батареї'],
    color: 'text-blue-400'
  },
  auto: {
    name: 'Auto',
    icon: Monitor,
    description: 'Автоматична',
    features: ['Системна інтеграція', 'Адаптивність', 'Автоматичне перемикання'],
    color: 'text-green-500'
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('auto')
  const [mounted, setMounted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top')

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    
    // Видаляємо всі класи тем
    root.classList.remove('light', 'dark')
    
    if (newTheme === 'auto') {
      // Автоматичний режим - використовуємо системні налаштування
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.add('light')
      }
    } else {
      // Ручний режим
      root.classList.add(newTheme)
    }
    
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    setMounted(true)
    
    // Завантажуємо збережену тему
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      const initialTheme = savedTheme || 'auto'
      setTheme(initialTheme)
      applyTheme(initialTheme)
    }
  }, [])

  // Слухаємо зміни системної теми
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'auto') {
        applyTheme('auto')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-9 h-9 p-0 animate-pulse"
        aria-label="Loading theme toggle"
      >
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
      </Button>
    )
  }

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const newTheme = themes[nextIndex]
    
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const getCurrentEffectiveTheme = (): 'light' | 'dark' => {
    if (theme === 'auto') {
      if (typeof window !== 'undefined' && mounted) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return 'light' // fallback для серверного рендерингу
    }
    return theme
  }

  const getIcon = () => {
    const effectiveTheme = getCurrentEffectiveTheme()
    const currentInfo = themeInfo[theme]
    const Icon = currentInfo.icon
    
    return <Icon className="h-4 w-4" />
  }

  const getLabel = () => {
    if (!mounted) return 'Loading...'
    
    const effectiveTheme = getCurrentEffectiveTheme()
    const currentInfo = themeInfo[theme]
    
    if (theme === 'auto') {
      return `${currentInfo.name} (${effectiveTheme === 'light' ? '☀️ Light' : '🌙 Dark'})`
    }
    
    return `${currentInfo.name} Theme`
  }

  const getCurrentInfo = () => themeInfo[theme]

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const tooltipHeight = 40 // Приблизна висота tooltip
    const tooltipWidth = 200 // Приблизна ширина tooltip
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceLeft = rect.left
    const spaceRight = window.innerWidth - rect.right
    
    // Якщо місця зверху менше ніж знизу, показуємо tooltip знизу
    if (spaceAbove < tooltipHeight + 10 && spaceBelow > tooltipHeight + 10) {
      setTooltipPosition('bottom')
    } else {
      setTooltipPosition('top')
    }
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setShowDetails(!showDetails)}
        onMouseEnter={handleMouseEnter}
        variant="outline"
        size="sm"
        className="w-9 h-9 p-0 relative group hover:bg-primary/5 transition-all duration-200"
        aria-label={getLabel()}
        title={getLabel()}
      >
        {getIcon()}
        
        {/* Tooltip */}
        <div className={`absolute px-3 py-2 text-xs bg-popover text-popover-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border shadow-lg transform -translate-x-1/2 left-1/2 group-hover:animate-tooltip-fade-in z-50 ${
          tooltipPosition === 'top' 
            ? 'bottom-full mb-2' 
            : 'top-full mt-2'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            {getLabel()}
          </div>
          {/* Arrow */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
            tooltipPosition === 'top'
              ? 'top-full border-t-4 border-t-popover'
              : 'bottom-full border-b-4 border-b-popover'
          }`}></div>
        </div>
      </Button>

      {/* Theme Details Dropdown */}
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 min-w-[320px] animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Налаштування Тем</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Поточна тема: <span className="font-medium">{getCurrentInfo().name}</span>
            </p>
          </div>

          {/* Theme Options */}
          <div className="p-3 space-y-2">
            {(['light', 'dark', 'auto'] as Theme[]).map((themeOption) => {
              const info = themeInfo[themeOption]
              const Icon = info.icon
              const isActive = theme === themeOption
              
              return (
                <button
                  key={themeOption}
                  onClick={() => {
                    setTheme(themeOption)
                    applyTheme(themeOption)
                    setShowDetails(false)
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary/10 border border-primary/20 text-primary'
                      : 'hover:bg-muted/50 border border-transparent hover:border-border/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{info.name}</div>
                        <div className="text-xs text-muted-foreground">{info.description}</div>
                      </div>
                    </div>
                    {isActive && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {info.features.map((feature, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isActive
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Current Theme Info */}
          <div className="p-3 border-t border-border bg-muted/30">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center justify-between">
                <span>Ефективна тема:</span>
                <span className="font-medium">
                  {getCurrentEffectiveTheme() === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Режим:</span>
                <span className="font-medium">
                  {theme === 'auto' ? '🔄 Автоматичний' : '🎯 Ручний'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Settings className="h-3 w-3" />
                <span>Налаштування теми</span>
              </div>
              <p>Зміни застосуються миттєво</p>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showDetails && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDetails(false)}
        />
      )}
    </div>
  )
}
