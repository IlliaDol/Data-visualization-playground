'use client'

import React, { useState, useEffect } from 'react'
import { Dashboard } from '@/components/Dashboard'
import { ChartSpec } from '@/types'

export default function DashboardsPage() {
  const [charts, setCharts] = useState<ChartSpec[]>([])

  useEffect(() => {
    // Завантажуємо реальні дані з localStorage
    if (typeof window !== 'undefined') {
      const savedCharts = localStorage.getItem('userCharts')
      if (savedCharts) {
        try {
          const parsedCharts = JSON.parse(savedCharts)
          // Конвертуємо дати назад в об'єкти Date
          const chartsWithDates = parsedCharts.map((chart: any) => ({
            ...chart,
            createdAt: new Date(chart.createdAt),
            updatedAt: new Date(chart.updatedAt)
          }))
          setCharts(chartsWithDates)
        } catch (error) {
          console.error('Помилка завантаження чартів:', error)
          setCharts([])
        }
      }
    }
  }, [])

  const handleAddChart = () => {
    // Navigate to chart creation
    window.location.href = '/'
  }

  const handleEditChart = (chartId: string) => {
    console.log('Edit chart:', chartId)
    // Navigate to chart editor
    window.location.href = `/?edit=${chartId}`
  }

  const handleDeleteChart = (chartId: string) => {
    console.log('Delete chart:', chartId)
    // Видаляємо чарт зі стану та localStorage
    const updatedCharts = charts.filter(chart => chart.id !== chartId)
    setCharts(updatedCharts)
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCharts', JSON.stringify(updatedCharts))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <Dashboard 
          charts={charts}
          onAddChart={handleAddChart}
          onEditChart={handleEditChart}
          onDeleteChart={handleDeleteChart}
        />
      </div>
    </div>
  )
}
