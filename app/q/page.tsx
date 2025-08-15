'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { VegaLiteChart } from '@/lib/render'
import { decodeState, createPermalink } from '@/lib/permalink'
import { createChartSpecFromNLQ } from '@/lib/nlq'
import { ChartSpecV1, ChartSpecZ } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Share2, Copy, Download, Eye, Sparkles, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function QPage() {
  const searchParams = useSearchParams()
  const [spec, setSpec] = useState<ChartSpecV1 | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    const s = searchParams.get('s')
    const promptParam = searchParams.get('prompt')
    
    if (promptParam) {
      setPrompt(promptParam)
    }
    
    if (s) {
      try {
        const decodedState = decodeState(s) as any
        const validatedSpec = ChartSpecZ.parse(decodedState.chartSpec)
        setSpec(validatedSpec)
        
        // Створюємо share URL
        const url = createPermalink(validatedSpec, {
          prompt: decodedState.meta?.prompt || promptParam || ''
        })
        setShareUrl(url)
      } catch (error) {
        console.error('Помилка декодування стану:', error)
        setError('Не вдалося завантажити графік з посилання')
      }
    }
  }, [searchParams])

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Створюємо контекст даних (в реальному проекті це буде з активного датасету)
      const mockDataContext = {
        fields: ['category', 'value', 'date'],
        data: [
          { category: 'A', value: 10, date: '2023-01-01' },
          { category: 'B', value: 20, date: '2023-01-02' },
          { category: 'C', value: 15, date: '2023-01-03' }
        ],
        fieldTypes: {
          category: 'nominal',
          value: 'quantitative',
          date: 'temporal'
        }
      }
      
      // Використовуємо NLQ агент
      const chartSpec = await createChartSpecFromNLQ(prompt, mockDataContext)
      setSpec(chartSpec)
      
      // Створюємо share URL
      const url = createPermalink(chartSpec, { prompt })
      setShareUrl(url)
      
      toast.success('Графік створено!')
    } catch (error) {
      console.error('Помилка створення графіка:', error)
      setError('Не вдалося створити графік')
      toast.error('Помилка створення графіка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Посилання скопійовано!')
    } catch (error) {
      console.error('Помилка копіювання:', error)
      toast.error('Помилка копіювання посилання')
    }
  }

  const handleFork = () => {
    // Перенаправляємо на головну сторінку з даними
    window.location.href = '/'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Помилка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Повернутися на головну
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              📊 DataViz AI - Запит → Графік
            </h1>
            <p className="text-lg text-muted-foreground">
              Створюйте графіки за допомогою природної мови та діліться ними
            </p>
          </div>

          {/* Prompt Input */}
          {!spec && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Запитай дані природною мовою
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePromptSubmit} className="flex gap-4">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Наприклад: 'Покажи продажі по місяцях' або 'Створи діаграму розподілу віку'"
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !prompt.trim()}>
                    {isLoading ? 'Створюю...' : 'Створити'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Chart Display */}
          {spec && (
            <div className="space-y-6">
              {/* Chart Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{spec.title || 'Графік'}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Поділитися
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFork}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Fork
                      </Button>
                    </div>
                  </CardTitle>
                  {spec.meta?.prompt && (
                    <p className="text-sm text-muted-foreground">
                      Запит: "{spec.meta.prompt}"
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <VegaLiteChart 
                      spec={spec} 
                      width={800} 
                      height={400}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Share Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Поділитися графіком
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Копіювати
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Це посилання містить всі дані та налаштування графіка. 
                    Будь-хто з цим посиланням може переглянути графік.
                  </p>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSpec(null)
                    setPrompt('')
                    setShareUrl('')
                  }}
                >
                  Створити новий графік
                </Button>
                <Button
                  onClick={handleFork}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Відкрити в редакторі
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!spec && !isLoading && (
            <Card>
              <CardContent className="text-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Створіть свій перший графік
                </h3>
                <p className="text-muted-foreground mb-4">
                  Введіть запит вище або використайте готове посилання
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>💡 Приклади запитів:</p>
                  <ul className="space-y-1">
                    <li>• "Покажи продажі по місяцях"</li>
                    <li>• "Створи діаграму розподілу віку"</li>
                    <li>• "Візуалізуй кореляцію між доходами та витратами"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
