'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Grid3X3, 
  Plus, 
  Settings, 
  Share2, 
  Download, 
  Filter,
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { ChartSpec, DataProfile } from '@/types'
import { ChartRenderer } from './ChartRenderer'

interface DashboardProps {
  charts?: ChartSpec[]
  onAddChart?: () => void
  onEditChart?: (chartId: string) => void
  onDeleteChart?: (chartId: string) => void
}

const SAMPLE_CHARTS: ChartSpec[] = [
  {
    id: '1',
    title: 'Sales by Region',
    data: { sourceId: 'sample-1' },
    mark: 'bar',
    encoding: {
      x: { field: 'Region', type: 'nominal' },
      y: { field: 'Sales', type: 'quantitative' }
    },
    config: { 
      theme: 'light', 
      legend: true, 
      labels: true,
      grid: true,
      axis: { x: true, y: true },
      tooltip: true,
      animation: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Monthly Trends',
    data: { sourceId: 'sample-2' },
    mark: 'line',
    encoding: {
      x: { field: 'Month', type: 'temporal' },
      y: { field: 'Revenue', type: 'quantitative' }
    },
    config: { 
      theme: 'light', 
      legend: true, 
      labels: true,
      grid: true,
      axis: { x: true, y: true },
      tooltip: true,
      animation: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Customer Distribution',
    data: { sourceId: 'sample-3' },
    mark: 'pie',
    encoding: {
      color: { field: 'Category', type: 'nominal' }
    },
    config: { 
      theme: 'light', 
      legend: true, 
      labels: true,
      grid: true,
      axis: { x: true, y: true },
      tooltip: true,
      animation: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export function Dashboard({ 
  charts = [], 
  onAddChart, 
  onEditChart, 
  onDeleteChart 
}: DashboardProps) {
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const handleChartSelect = (chartId: string) => {
    setSelectedCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    )
  }

  const handleSelectAll = () => {
    setSelectedCharts(charts.map(chart => chart.id))
  }

  const handleDeselectAll = () => {
    setSelectedCharts([])
  }

  const handleShare = () => {
    if (selectedCharts.length === 0) {
      alert('Виберіть чарти для поширення')
      return
    }
    
    const selectedChartsData = charts.filter(chart => selectedCharts.includes(chart.id))
    const shareData = {
      charts: selectedChartsData,
      dashboard: {
        title: 'Shared Dashboard',
        description: `Shared ${selectedCharts.length} charts`,
        createdAt: new Date()
      }
    }
    
    // Створюємо JSON для поширення
    const shareJson = JSON.stringify(shareData, null, 2)
    const blob = new Blob([shareJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-share-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert(`✅ ${selectedCharts.length} чартів експортовано для поширення!`)
  }

  const handleExport = () => {
    if (selectedCharts.length === 0) {
      alert('Виберіть чарти для експорту')
      return
    }
    
    const selectedChartsData = charts.filter(chart => selectedCharts.includes(chart.id))
    
    // Експортуємо як JSON
    const exportData = {
      charts: selectedChartsData,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const exportJson = JSON.stringify(exportData, null, 2)
    const blob = new Blob([exportJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `charts-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert(`✅ ${selectedCharts.length} чартів експортовано!`)
  }

  const handleBulkDelete = () => {
    if (selectedCharts.length === 0) {
      alert('Виберіть чарти для видалення')
      return
    }
    
    const confirmed = confirm(`Ви впевнені, що хочете видалити ${selectedCharts.length} чартів? Ця дія не може бути скасована.`)
    
    if (confirmed) {
      selectedCharts.forEach(chartId => {
        onDeleteChart?.(chartId)
      })
      setSelectedCharts([])
      alert(`✅ ${selectedCharts.length} чартів видалено!`)
    }
  }

  const handleViewChart = (chart: ChartSpec) => {
    // Створюємо модальне вікно або переходимо до перегляду чарту
    const chartData = {
      ...chart,
      viewMode: 'fullscreen',
      timestamp: new Date().toISOString()
    }
    
    // Зберігаємо дані чарту для перегляду
    localStorage.setItem('viewChart', JSON.stringify(chartData))
    
    // Можна відкрити в новому вікні або показати модаль
    const chartUrl = `/chart/${chart.id}`
    window.open(chartUrl, '_blank')
  }

  const getChartIcon = (mark: string) => {
    switch (mark) {
      case 'bar':
        return <BarChart3 className="h-4 w-4" />
      case 'line':
        return <BarChart3 className="h-4 w-4" />
      case 'scatter':
        return <BarChart3 className="h-4 w-4" />
      case 'pie':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
                      <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
            {charts.length} charts • {charts.length > 0 
              ? `Last updated ${new Date(Math.max(...charts.map(chart => chart.updatedAt.getTime()))).toLocaleDateString()}`
              : 'No charts yet'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </Button>
          
          <Button
            onClick={charts.length === 0 ? () => window.location.href = '/' : onAddChart}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {charts.length === 0 ? 'Create First Chart' : 'Add Chart'}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chart Type
                </label>
                <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                  <option value="">All types</option>
                  <option value="bar">Bar charts</option>
                  <option value="line">Line charts</option>
                  <option value="scatter">Scatter plots</option>
                  <option value="pie">Pie charts</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date Range
                </label>
                <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                  <option value="">All time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="year">This year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                  <option value="">All charts</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedCharts.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedCharts.length} charts selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                >
                  Deselect All
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.map((chart) => (
            <Card
              key={chart.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCharts.includes(chart.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleChartSelect(chart.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChartIcon(chart.mark)}
                    <CardTitle className="text-lg text-foreground font-bold">{chart.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewChart(chart)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Share single chart
                        const shareData = {
                          chart: chart,
                          sharedAt: new Date().toISOString()
                        }
                        const shareJson = JSON.stringify(shareData, null, 2)
                        const blob = new Blob([shareJson], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${chart.title.toLowerCase().replace(/\s+/g, '-')}-share.json`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                        alert(`✅ Чарт "${chart.title}" експортовано для поширення!`)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditChart?.(chart.id)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChart?.(chart.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="h-48 bg-card rounded-lg border border-border overflow-hidden">
                  {/* Тут потрібно буде передати dataProfile, але поки що покажемо заглушку */}
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Chart Preview</p>
                <p className="text-xs text-muted-foreground">
                          {chart.mark} chart
                        </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                                          <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{chart.mark}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                                          <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {chart.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {charts.map((chart) => (
            <Card
              key={chart.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCharts.includes(chart.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleChartSelect(chart.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {getChartIcon(chart.mark)}
                    </div>
                    
                    <div>
                                      <h3 className="font-bold text-foreground">{chart.title}</h3>
                <p className="text-sm text-muted-foreground">
                          {chart.mark} chart • Created {chart.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Share single chart
                        const shareData = {
                          chart: chart,
                          sharedAt: new Date().toISOString()
                        }
                        const shareJson = JSON.stringify(shareData, null, 2)
                        const blob = new Blob([shareJson], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${chart.title.toLowerCase().replace(/\s+/g, '-')}-share.json`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                        alert(`✅ Чарт "${chart.title}" експортовано для поширення!`)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewChart(chart)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditChart?.(chart.id)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChart?.(chart.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {charts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No charts yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Завантажте дані та створіть свій перший чарт на головній сторінці
              </p>
              <Button onClick={() => window.location.href = '/'}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Chart
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Charts</p>
                <p className="text-2xl font-bold text-foreground">{charts.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chart Types</p>
                <p className="text-2xl font-bold text-foreground">
                  {Array.from(new Set(charts.map(chart => chart.mark))).length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Sources</p>
                <p className="text-2xl font-bold text-foreground">
                  {Array.from(new Set(charts.map(chart => chart.data.sourceId))).length}
                </p>
              </div>
              <Share2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Created</p>
                <p className="text-2xl font-bold text-foreground">
                  {charts.length > 0 
                    ? new Date(Math.max(...charts.map(chart => chart.createdAt.getTime()))).toLocaleDateString()
                    : 'None'
                  }
                </p>
              </div>
              <Settings className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
