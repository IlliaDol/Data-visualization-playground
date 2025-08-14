'use client'

import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Treemap, TreemapItem
} from 'recharts'

interface ChartRendererProps {
  chartSpec: any
  data: any[]
}

// Кольори для різних тем
const getThemeColors = () => {
  const isDark = document.documentElement.classList.contains('dark')
  
  if (isDark) {
    return {
      text: '#e5e7eb',
      grid: '#374151',
      background: '#1f2937',
      border: '#374151',
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
    }
  } else {
    return {
      text: '#1f2937',
      grid: '#e5e7eb',
      background: '#ffffff',
      border: '#d1d5db',
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
    }
  }
}

export function ChartRenderer({ chartSpec, data }: ChartRendererProps) {
  const [colors, setColors] = useState(getThemeColors())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Оновлюємо кольори при зміні теми
    const updateColors = () => setColors(getThemeColors())
    
    // Спостерігаємо за змінами класів на html елементі
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  if (!mounted) {
    return (
      <div className="chart-loading">
        <div className="animate-pulse">Loading chart...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-loading">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">No data available</div>
          <div className="text-sm text-muted-foreground">Please upload data to create a chart</div>
        </div>
      </div>
    )
  }

  const { mark, encoding, config } = chartSpec
  const xField = encoding?.x?.field
  const yField = encoding?.y?.field
  const colorField = encoding?.color?.field

  if (!xField || !yField) {
    return (
      <div className="chart-loading">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Chart configuration incomplete</div>
          <div className="text-sm text-muted-foreground">Please select X and Y fields</div>
        </div>
      </div>
    )
  }

  // Підготовка даних для pie chart
  const getPieData = () => {
    const aggregated = data.reduce((acc, item) => {
      const key = item[xField]
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(aggregated).map(([name, value], index) => ({
      name,
      value,
      fill: colors.colors[index % colors.colors.length]
    }))
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-popover-foreground">{`${xField}: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    }

    switch (mark) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey={xField} 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <YAxis 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey={yField || 'value'} 
              fill={colors.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey={xField} 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <YAxis 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={yField || 'value'} 
              stroke={colors.primary}
              strokeWidth={2}
              dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
            />
          </LineChart>
        )

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey={xField} 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <YAxis 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Scatter 
              dataKey={yField || 'value'} 
              fill={colors.primary}
              stroke={colors.primary}
            />
          </ScatterChart>
        )

      case 'pie':
        const pieData = getPieData()
        return (
          <PieChart {...commonProps}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill={colors.primary}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey={xField} 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <YAxis 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={yField || 'value'} 
              stroke={colors.primary}
              fill={colors.primary}
              fillOpacity={0.3}
            />
          </AreaChart>
        )

      case 'histogram':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey={xField} 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <YAxis 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey={yField || 'value'} 
              fill={colors.secondary}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        )

      case 'stacked':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey={xField} 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <YAxis 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey={yField || 'value'} 
              stackId="a" 
              fill={colors.primary}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey={colorField || 'value2'} 
              stackId="a" 
              fill={colors.secondary}
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        )

      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke={colors.grid} />
            <PolarAngleAxis 
              dataKey={xField} 
              tick={{ fill: colors.text }}
            />
            <PolarRadiusAxis 
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.border }}
            />
            <Radar 
              name={yField || 'value'} 
              dataKey={yField || 'value'} 
              stroke={colors.primary} 
              fill={colors.primary} 
              fillOpacity={0.3} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        )

      case 'gauge':
        const value = data[0]?.[yField || 'value'] || 0
        const maxValue = Math.max(...data.map(d => d[yField || 'value'] || 0))
        const percentage = (value / maxValue) * 100
        
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={colors.grid}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={colors.primary}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: colors.text }}>
                      {value}
                    </div>
                    <div className="text-sm" style={{ color: colors.text }}>
                      {xField}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="chart-loading">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Unsupported chart type</div>
              <div className="text-sm text-muted-foreground">
                Chart type "{mark}" is not yet supported
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
