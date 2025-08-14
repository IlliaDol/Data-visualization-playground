'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react'
import { useTranslation, type Language } from '@/lib/i18n'

export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, supportedLanguages, getLanguageInfo, t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 animate-pulse"
        aria-label="Loading"
      >
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
        <span className="text-lg">🌐</span>
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    )
  }

  const changeLanguage = (languageCode: Language) => {
    setLanguage(languageCode)
    setIsOpen(false)
  }

  const currentLanguageInfo = getLanguageInfo(language)

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-200"
        aria-label={mounted ? t('settings.language') : 'Language'}
      >
        <Globe className="h-4 w-4" />
        <span className="text-lg">{currentLanguageInfo.flag}</span>
        <span className="hidden sm:inline font-medium">{language.toUpperCase()}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 min-w-[280px] animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">{mounted ? t('settings.language') : 'Language'}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {mounted ? t('common.current') : 'Current'}: <span className="font-medium">{currentLanguageInfo.nativeName}</span>
            </p>
          </div>

          {/* Language Options */}
          <div className="p-2">
            {supportedLanguages.map((langCode) => {
              const langInfo = getLanguageInfo(langCode)
              const isActive = language === langCode
              
              return (
                <button
                  key={langCode}
                  onClick={() => changeLanguage(langCode)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary/10 border border-primary/20 text-primary'
                      : 'hover:bg-muted/50 border border-transparent hover:border-border/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{langInfo.flag}</span>
                      <div>
                        <div className="font-medium text-foreground">{langInfo.name}</div>
                        <div className="text-xs text-muted-foreground">{langInfo.nativeName}</div>
                      </div>
                    </div>
                    {isActive && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-2">
                    {langCode === 'en' && 'International language for business and technology'}
                    {langCode === 'uk' && 'Офіційна мова України, сучасна та розвинена'}
                    {langCode === 'de' && 'Präzise Sprache für Technik und Wissenschaft'}
                    {langCode === 'ru' && 'Широко используемый язык в регионе'}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {langCode === 'en' && ['International', 'Business', 'Technology'].map((feature, index) => (
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
                    {langCode === 'uk' && ['Офіційна', 'Рідна', 'Сучасна'].map((feature, index) => (
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
                    {langCode === 'de' && ['Business', 'Technical', 'Precise'].map((feature, index) => (
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
                    {langCode === 'ru' && ['Широкий', 'Технический', 'Международный'].map((feature, index) => (
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

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/30">
            <div className="text-xs text-muted-foreground text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Globe className="h-3 w-3" />
                <span>Мова інтерфейсу</span>
              </div>
              <p>Зміни застосуються миттєво</p>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
