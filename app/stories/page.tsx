'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Plus, 
  Play, 
  Edit, 
  Share2, 
  Download,
  BookOpen,
  Users,
  Calendar
} from 'lucide-react'

interface Story {
  id: string
  title: string
  description: string
  charts: number
  views: number
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'published'
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')

  useEffect(() => {
    // Завантажуємо реальні дані з localStorage
    const savedStories = localStorage.getItem('userStories')
    if (savedStories) {
      try {
        const parsedStories = JSON.parse(savedStories)
        // Конвертуємо дати назад в об'єкти Date
        const storiesWithDates = parsedStories.map((story: any) => ({
          ...story,
          createdAt: new Date(story.createdAt),
          updatedAt: new Date(story.updatedAt)
        }))
        setStories(storiesWithDates)
      } catch (error) {
        console.error('Помилка завантаження історій:', error)
        setStories([])
      }
    }
  }, [])

  const filteredStories = stories.filter(story => 
    filter === 'all' || story.status === filter
  )

  const handleCreateStory = () => {
    // Створюємо нову історію з реальними даними
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
      window.location.href = '/'
      return
    }
    
    const newStory: Story = {
      id: crypto.randomUUID(),
      title: `Data Story ${stories.length + 1}`,
      description: `Story created on ${new Date().toLocaleDateString()}`,
      charts: charts.length,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft'
    }
    
    const updatedStories = [...stories, newStory]
    setStories(updatedStories)
    localStorage.setItem('userStories', JSON.stringify(updatedStories))
    
    console.log('Нову історію створено:', newStory.title)
  }

  const handleEditStory = (storyId: string) => {
    console.log('Edit story:', storyId)
    // Тут можна додати навігацію до редагування історії
  }

  const handleShareStory = (storyId: string) => {
    console.log('Share story:', storyId)
    // Тут можна додати функціонал поширення
  }

  const handleDeleteStory = (storyId: string) => {
    const updatedStories = stories.filter(story => story.id !== storyId)
    setStories(updatedStories)
    localStorage.setItem('userStories', JSON.stringify(updatedStories))
  }

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Stories</h1>
            <p className="text-gray-600 mt-1">
              Create compelling narratives with your data visualizations
            </p>
          </div>
          
          <Button 
            onClick={handleCreateStory} 
            className="flex items-center gap-2"
            disabled={(() => {
              const savedCharts = localStorage.getItem('userCharts')
              if (savedCharts) {
                try {
                  const charts = JSON.parse(savedCharts)
                  return charts.length === 0
                } catch (error) {
                  return true
                }
              }
              return true
            })()}
          >
            <Plus className="h-4 w-4" />
            {(() => {
              const savedCharts = localStorage.getItem('userCharts')
              if (savedCharts) {
                try {
                  const charts = JSON.parse(savedCharts)
                  return charts.length === 0 ? 'No Charts' : 'Create Story'
                } catch (error) {
                  return 'No Charts'
                }
              }
              return 'No Charts'
            })()}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Stories</p>
                  <p className="text-2xl font-bold">{stories.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold">
                    {stories.filter(s => s.status === 'published').length}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">
                    {stories.reduce((sum, story) => sum + story.views, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Charts</p>
                  <p className="text-2xl font-bold">
                    {stories.reduce((sum, story) => sum + story.charts, 0)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Stories ({stories.length})
          </Button>
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            onClick={() => setFilter('published')}
          >
            Published ({stories.filter(s => s.status === 'published').length})
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
          >
            Drafts ({stories.filter(s => s.status === 'draft').length})
          </Button>
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{story.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {story.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                      {story.status}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Story Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {story.charts} charts
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {story.views} views
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {story.updatedAt.toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditStory(story.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
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
                        ×
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
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No stories yet
                </h3>
                <p className="text-gray-600 mb-6">
                  {(() => {
                    const savedCharts = localStorage.getItem('userCharts')
                    if (savedCharts) {
                      try {
                        const charts = JSON.parse(savedCharts)
                        if (charts.length === 0) {
                          return 'Спочатку створіть хоча б один чарт на головній сторінці, щоб створити історію'
                        } else {
                          return 'Створіть свою першу історію даних, щоб поділитися інсайтами з командою'
                        }
                      } catch (error) {
                        return 'Спочатку створіть хоча б один чарт на головній сторінці, щоб створити історію'
                      }
                    }
                    return 'Спочатку створіть хоча б один чарт на головній сторінці, щоб створити історію'
                  })()}
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={handleCreateStory}
                    disabled={(() => {
                      const savedCharts = localStorage.getItem('userCharts')
                      if (savedCharts) {
                        try {
                          const charts = JSON.parse(savedCharts)
                          return charts.length === 0
                        } catch (error) {
                          return true
                        }
                      }
                      return true
                    })()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {(() => {
                      const savedCharts = localStorage.getItem('userCharts')
                      if (savedCharts) {
                        try {
                          const charts = JSON.parse(savedCharts)
                          return charts.length === 0 ? 'No Charts Available' : 'Create First Story'
                        } catch (error) {
                          return 'No Charts Available'
                        }
                      }
                      return 'No Charts Available'
                    })()}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                  >
                    Create Chart First
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Chart
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboards'}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                View Dashboards
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.href = '/settings'}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
