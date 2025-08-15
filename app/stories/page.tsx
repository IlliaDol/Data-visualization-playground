'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  BookOpen, 
  Users, 
  Plus, 
  Edit, 
  Share2, 
  Calendar,
  Eye,
  Play,
  BarChart3,
  Trash2
} from 'lucide-react'
import { Story } from '@/types'
import { StoryBuilder } from '@/components/StoryBuilder'

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [showStoryBuilder, setShowStoryBuilder] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)

  useEffect(() => {
    // Завантажуємо реальні дані з localStorage
    if (typeof window !== 'undefined') {
      const savedStories = localStorage.getItem('userStories')
      if (savedStories) {
        try {
          const parsedStories = JSON.parse(savedStories)
          // Конвертуємо дати назад в об'єкти Date
          const storiesWithDates = parsedStories.map((story: any) => ({
            ...story,
            createdAt: new Date(story.createdAt),
            updatedAt: new Date(story.updatedAt),
            slides: story.slides || []
          }))
          setStories(storiesWithDates)
        } catch (error) {
          console.error('Помилка завантаження історій:', error)
          setStories([])
        }
      }
    }
  }, [])

  const filteredStories = stories.filter(story => 
    filter === 'all' || story.status === filter
  )

  const handleCreateStory = () => {
    // Перевіряємо чи є чарти для створення story
    if (typeof window !== 'undefined') {
      const savedCharts = localStorage.getItem('userCharts')
      let charts = []
      if (savedCharts) {
        try {
          charts = JSON.parse(savedCharts)
        } catch (error) {
          console.error('Помилка завантаження чартів:', error)
          charts = []
        }
      }
      
      if (charts.length === 0) {
        alert('Спочатку створіть хоча б один чарт!')
        window.location.href = './'
        return
      }
      
      setEditingStory(null)
      setShowStoryBuilder(true)
    }
  }

  const handleEditStory = (story: Story) => {
    setEditingStory(story)
    setShowStoryBuilder(true)
  }

  const handleSaveStory = (story: Story) => {
    const updatedStories = editingStory
      ? stories.map(s => s.id === story.id ? story : s)
      : [...stories, story]
    
    setStories(updatedStories)
    localStorage.setItem('userStories', JSON.stringify(updatedStories))
    setShowStoryBuilder(false)
    setEditingStory(null)
    
    console.log('Story saved:', story.title)
  }

  const handleCancelStory = () => {
    setShowStoryBuilder(false)
    setEditingStory(null)
  }

  const handleShareStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId)
    if (!story) return
    
    // Створюємо посилання для поширення
    const shareData = {
      story,
      shareUrl: `${window.location.origin}/stories/${storyId}`,
      sharedAt: new Date().toISOString()
    }
    
    const shareJson = JSON.stringify(shareData, null, 2)
    const blob = new Blob([shareJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `story-${story.title.toLowerCase().replace(/\s+/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert(`✅ Story "${story.title}" експортовано для поширення!`)
  }

  const handleDeleteStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId)
    if (!story) return
    
    const confirmed = confirm(`Ви впевнені, що хочете видалити story "${story.title}"? Ця дія не може бути скасована.`)
    
    if (confirmed) {
      const updatedStories = stories.filter(s => s.id !== storyId)
      setStories(updatedStories)
      localStorage.setItem('userStories', JSON.stringify(updatedStories))
      alert(`✅ Story "${story.title}" видалено!`)
    }
  }

  const handlePlayStory = (story: Story) => {
    // Зберігаємо story для перегляду
    localStorage.setItem('playStory', JSON.stringify(story))
    window.open(`/stories/play/${story.id}`, '_blank')
  }

  if (showStoryBuilder) {
    return (
      <StoryBuilder
        story={editingStory || undefined}
        onSave={handleSaveStory}
        onCancel={handleCancelStory}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Data Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Створюйте захоплюючі історії з вашими даними
            </p>
            
            {/* Features */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span className="font-semibold">Чарти та Візуалізації</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-6 w-6 text-success-600" />
                <span className="font-semibold">Презентаційний режим</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="h-6 w-6 text-info-600" />
                <span className="font-semibold">Поширення</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleCreateStory}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Створити Story
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Всі ({stories.length})
                </Button>
                <Button
                  variant={filter === 'draft' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('draft')}
                >
                  Чернетки
                </Button>
                <Button
                  variant={filter === 'published' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('published')}
                >
                  Опубліковані
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredStories.length} stories
            </div>
          </div>

          {/* Stories Grid */}
          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{story.title}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {story.description || 'Без опису'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{story.slides.length} slides</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{story.updatedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayStory(story)}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Грати
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStory(story)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareStory(story.id)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStory(story.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Немає stories
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {(() => {
                      if (typeof window === 'undefined') return 'Спочатку створіть хоча б один чарт на головній сторінці, щоб створити story'
                      const savedCharts = localStorage.getItem('userCharts')
                      if (savedCharts) {
                        try {
                          const charts = JSON.parse(savedCharts)
                          if (charts.length === 0) {
                            return 'Спочатку створіть хоча б один чарт на головній сторінці, щоб створити story'
                          }
                        } catch (error) {
                          return 'Спочатку створіть хоча б один чарт на головній сторінці, щоб створити story'
                        }
                      }
                      return 'Спочатку створіть хоча б один чарт на головній сторінці, щоб створити story'
                    })()}
                  </p>
                  <Button onClick={handleCreateStory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Створити першу Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
