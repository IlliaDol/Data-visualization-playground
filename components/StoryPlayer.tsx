'use client'

import React, { useState, useEffect } from 'react'
import { Story, StorySlide } from '@/types'
import { ChartRenderer } from './ChartRenderer'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X,
  Maximize,
  Minimize,
  Volume2,
  VolumeX
} from 'lucide-react'

interface StoryPlayerProps {
  storyId: string
}

export function StoryPlayer({ storyId }: StoryPlayerProps) {
  const [story, setStory] = useState<Story | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [availableCharts, setAvailableCharts] = useState<any[]>([])
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    // Завантажуємо story з localStorage
    if (typeof window !== 'undefined') {
      const playStory = localStorage.getItem('playStory')
      if (playStory) {
        try {
          const storyData = JSON.parse(playStory)
          setStory(storyData)
        } catch (error) {
          console.error('Помилка завантаження story:', error)
        }
      }

      // Завантажуємо чарти
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

  useEffect(() => {
    // Автоматичне перемикання slides при відтворенні
    let interval: NodeJS.Timeout
    if (isPlaying && story && story.slides.length > 0) {
      const currentSlide = story.slides[currentSlideIndex]
      const duration = (currentSlide?.duration || 5) * 1000
      
      interval = setTimeout(() => {
        if (currentSlideIndex < story.slides.length - 1) {
          setCurrentSlideIndex(currentSlideIndex + 1)
        } else {
          setIsPlaying(false)
        }
      }, duration)
    }

    return () => {
      if (interval) clearTimeout(interval)
    }
  }, [isPlaying, currentSlideIndex, story])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNextSlide = () => {
    if (story && currentSlideIndex < story.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleClose = () => {
    window.close()
  }

  const currentSlide = story?.slides[currentSlideIndex]
  const currentChart = currentSlide?.chartId 
    ? availableCharts.find(chart => chart.id === currentSlide.chartId)
    : null

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Story не знайдено
          </h1>
          <p className="text-muted-foreground mb-4">
            Перевірте, чи правильно відкрито story для перегляду
          </p>
          <Button onClick={handleClose}>
            Закрити
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`min-h-screen bg-background transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Main Content */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <div>
            <h1 className="text-xl font-bold text-foreground">{story.title}</h1>
            <p className="text-sm text-muted-foreground">
              Slide {currentSlideIndex + 1} з {story.slides.length}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          {currentSlide ? (
            <div className="max-w-4xl w-full text-center">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                {currentSlide.title}
              </h2>
              
              {currentSlide.content && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {currentSlide.content}
                </p>
              )}
              
              {currentChart && (
                <div className="bg-muted/20 rounded-lg p-6">
                  <ChartRenderer
                    chartSpec={currentChart}
                    data={[]} // Тут потрібно передати реальні дані
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Кінець презентації
              </h2>
              <p className="text-muted-foreground">
                Дякуємо за перегляд!
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={`flex items-center justify-center gap-4 p-4 bg-background/80 backdrop-blur-sm border-t border-border transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="outline"
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePlayPause}
            disabled={!story || story.slides.length === 0}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextSlide}
            disabled={!story || currentSlideIndex >= story.slides.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className={`h-1 bg-muted transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: story.slides.length > 0 
                ? `${((currentSlideIndex + 1) / story.slides.length) * 100}%`
                : '0%'
            }}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="hidden">
        {/* Keyboard event listeners */}
        {typeof window !== 'undefined' && (
          <div
            onKeyDown={(e) => {
              switch (e.key) {
                case 'ArrowRight':
                case ' ':
                  e.preventDefault()
                  handleNextSlide()
                  break
                case 'ArrowLeft':
                  e.preventDefault()
                  handlePrevSlide()
                  break
                case 'Escape':
                  e.preventDefault()
                  handleClose()
                  break
                case 'f':
                  e.preventDefault()
                  handleFullscreen()
                  break
                case 'm':
                  e.preventDefault()
                  setIsMuted(!isMuted)
                  break
              }
            }}
            tabIndex={0}
            className="absolute inset-0"
          />
        )}
      </div>
    </div>
  )
}
