'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Edit, 
  Eye, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Save,
  Share2,
  Trash2,
  Image,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Story, StorySlide, ChartSpec } from '@/types'
import { ChartRenderer } from './ChartRenderer'

interface StoryBuilderProps {
  story?: Story
  onSave: (story: Story) => void
  onCancel: () => void
}

export function StoryBuilder({ story, onSave, onCancel }: StoryBuilderProps) {
  const [currentStory, setCurrentStory] = useState<Story>(story || {
    id: crypto.randomUUID(),
    title: 'Нова Data Story',
    description: '',
    slides: [],
    theme: 'light',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [availableCharts, setAvailableCharts] = useState<ChartSpec[]>([])
  const [editMode, setEditMode] = useState<'story' | 'slide' | 'preview'>('story')

  useEffect(() => {
    // Завантажуємо доступні чарти
    if (typeof window !== 'undefined') {
      const savedCharts = localStorage.getItem('userCharts')
      if (savedCharts) {
        try {
          const charts = JSON.parse(savedCharts)
          setAvailableCharts(charts)
        } catch (error) {
          console.error('Помилка завантаження чартів:', error)
        }
      }
    }
  }, [])

  const handleAddSlide = () => {
    const newSlide: StorySlide = {
      id: crypto.randomUUID(),
      title: `Slide ${currentStory.slides.length + 1}`,
      content: '',
      chartId: undefined,
      order: currentStory.slides.length,
      duration: 5
    }
    
    const updatedSlides = [...currentStory.slides, newSlide]
    setCurrentStory({
      ...currentStory,
      slides: updatedSlides
    })
    setCurrentSlideIndex(updatedSlides.length - 1)
  }

  const handleUpdateSlide = (slideId: string, updates: Partial<StorySlide>) => {
    const updatedSlides = currentStory.slides.map(slide =>
      slide.id === slideId ? { ...slide, ...updates } : slide
    )
    setCurrentStory({
      ...currentStory,
      slides: updatedSlides
    })
  }

  const handleDeleteSlide = (slideId: string) => {
    const updatedSlides = currentStory.slides.filter(slide => slide.id !== slideId)
    setCurrentStory({
      ...currentStory,
      slides: updatedSlides
    })
    
    if (currentSlideIndex >= updatedSlides.length) {
      setCurrentSlideIndex(Math.max(0, updatedSlides.length - 1))
    }
  }

  const handleSaveStory = () => {
    const updatedStory = {
      ...currentStory,
      updatedAt: new Date()
    }
    onSave(updatedStory)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNextSlide = () => {
    if (currentSlideIndex < currentStory.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const currentSlide = currentStory.slides[currentSlideIndex]
  const currentChart = currentSlide?.chartId 
    ? availableCharts.find(chart => chart.id === currentSlide.chartId)
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onCancel}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {editMode === 'story' ? 'Редагування Story' : 
                 editMode === 'slide' ? 'Редагування Slide' : 'Перегляд Story'}
              </h1>
              <p className="text-muted-foreground">
                {currentStory.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setEditMode(editMode === 'story' ? 'slide' : 'story')}
            >
              <Edit className="h-4 w-4 mr-2" />
              {editMode === 'story' ? 'Редагувати Slide' : 'Редагувати Story'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setEditMode('preview')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Перегляд
            </Button>
            
            <Button onClick={handleSaveStory}>
              <Save className="h-4 w-4 mr-2" />
              Зберегти
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Story/Slide Editor */}
          <div className="lg:col-span-1">
            {editMode === 'story' && (
              <Card>
                <CardHeader>
                  <CardTitle>Налаштування Story</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Назва</label>
                    <input
                      type="text"
                      value={currentStory.title}
                      onChange={(e) => setCurrentStory({
                        ...currentStory,
                        title: e.target.value
                      })}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Опис</label>
                    <textarea
                      value={currentStory.description}
                      onChange={(e) => setCurrentStory({
                        ...currentStory,
                        description: e.target.value
                      })}
                      rows={3}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Тема</label>
                    <select
                      value={currentStory.theme}
                      onChange={(e) => setCurrentStory({
                        ...currentStory,
                        theme: e.target.value as 'light' | 'dark' | 'auto'
                      })}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="light">Світла</option>
                      <option value="dark">Темна</option>
                      <option value="auto">Авто</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {editMode === 'slide' && (
              <Card>
                <CardHeader>
                  <CardTitle>Редагування Slide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentSlide && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Назва Slide</label>
                        <input
                          type="text"
                          value={currentSlide.title}
                          onChange={(e) => handleUpdateSlide(currentSlide.id, {
                            title: e.target.value
                          })}
                          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Текст</label>
                        <textarea
                          value={currentSlide.content}
                          onChange={(e) => handleUpdateSlide(currentSlide.id, {
                            content: e.target.value
                          })}
                          rows={4}
                          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                          placeholder="Опишіть ваші дані та висновки..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Чарт</label>
                        <select
                          value={currentSlide.chartId || ''}
                          onChange={(e) => handleUpdateSlide(currentSlide.id, {
                            chartId: e.target.value || undefined
                          })}
                          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="">Без чарту</option>
                          {availableCharts.map(chart => (
                            <option key={chart.id} value={chart.id}>
                              {chart.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Тривалість (сек)</label>
                        <input
                          type="number"
                          value={currentSlide.duration || 5}
                          onChange={(e) => handleUpdateSlide(currentSlide.id, {
                            duration: parseInt(e.target.value) || 5
                          })}
                          min="1"
                          max="30"
                          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Slides List */}
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Slides ({currentStory.slides.length})</CardTitle>
                  <Button onClick={handleAddSlide} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentStory.slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        index === currentSlideIndex
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-border/60'
                      }`}
                      onClick={() => setCurrentSlideIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{slide.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {slide.chartId ? 'З чартом' : 'Текстовий'} • {slide.duration}s
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteSlide(slide.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Preview/Playback */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {editMode === 'preview' ? 'Перегляд Story' : 'Превью Slide'}
                  </CardTitle>
                  
                  {editMode === 'preview' && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handlePrevSlide}>
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePlayPause}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleNextSlide}>
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {currentSlide ? (
                  <div className="flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {currentSlide.title}
                      </h2>
                      {currentSlide.content && (
                        <p className="text-muted-foreground text-lg">
                          {currentSlide.content}
                        </p>
                      )}
                    </div>
                    
                    {currentChart && (
                      <div className="flex-1 bg-muted/20 rounded-lg p-4">
                        <ChartRenderer
                          chartSpec={currentChart}
                          data={[]} // Тут потрібно передати реальні дані
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Немає slides
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Додайте перший slide щоб почати створювати story
                      </p>
                      <Button onClick={handleAddSlide}>
                        <Plus className="h-4 w-4 mr-2" />
                        Додати Slide
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
