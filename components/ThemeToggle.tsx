'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon, Monitor, Sparkles, Check, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

type Theme = 'light' | 'dark' | 'system'

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
  system: {
    name: 'Auto',
    icon: Monitor,
    description: 'Автоматична',
    features: ['Системна інтеграція', 'Адаптивність', 'Автоматичне перемикання'],
    color: 'text-green-500'
  }
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top')

  useEffect(() => {
    setMounted(true)
  }, [])

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
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme as Theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const newTheme = themes[nextIndex]
    
    setTheme(newTheme)
  }

  const getCurrentEffectiveTheme = (): 'light' | 'dark' => {
    return resolvedTheme || 'light'
  }

  const getIcon = () => {
    const currentInfo = themeInfo[theme as Theme] || themeInfo.system
    const Icon = currentInfo.icon
    
    return <Icon className="h-4 w-4" />
  }

  const getLabel = () => {
    if (!mounted) return 'Loading...'
    
    const currentInfo = themeInfo[theme as Theme] || themeInfo.system
    
    if (theme === 'system') {
      return `${currentInfo.name} (${getCurrentEffectiveTheme() === 'light' ? '☀️ Light' : '🌙 Dark'})`
    }
    
    return `${currentInfo.name} Theme`
  }

  const getCurrentInfo = () => themeInfo[theme as Theme] || themeInfo.system

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const tooltipHeight = 40 // Приблизна висота tooltip
    const spaceBelow = window.innerHeight - rect.bottom
    
    // Якщо місця знизу більше ніж зверху, показуємо tooltip знизу
    if (spaceBelow > tooltipHeight + 10) {
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
            {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => {
              const info = themeInfo[themeOption]
              const Icon = info.icon
              const isActive = theme === themeOption
              
              return (
                <button
                  key={themeOption}
                  onClick={() => {
                    setTheme(themeOption)
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
                  {theme === 'system' ? '🔄 Автоматичний' : '🎯 Ручний'}
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
