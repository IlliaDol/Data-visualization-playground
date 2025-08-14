'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { ChartSpec, DataProfile } from '@/types'

interface ChartRendererProps {
  chartSpec: ChartSpec
  dataProfile: DataProfile
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function ChartRenderer({ chartSpec, dataProfile }: ChartRendererProps) {
  // Перетворюємо дані для Recharts
  const chartData = dataProfile.sampleData || []

  // Отримуємо назви полів
  const xField = chartSpec.encoding.x?.field
  const yField = chartSpec.encoding.y?.field
  const colorField = chartSpec.encoding.color?.field

  console.log('ChartRenderer:', {
    chartSpec,
    dataProfile: dataProfile.name,
    chartData: chartData.length,
    xField,
    yField,
    sampleData: chartData.slice(0, 2) // Показуємо перші 2 рядки для діагностики
  })

  // Перевіряємо чи є дані
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p>Немає даних для відображення</p>
          <p className="text-sm">DataProfile: {dataProfile.name}</p>
          <p className="text-sm">Sample data length: {chartData?.length || 0}</p>
        </div>
      </div>
    )
  }

  // Перевіряємо чи є необхідні поля (для pie chart Y поле може бути порожнім)
  if (!xField) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p>Не вибрано поле для X осі</p>
          <p className="text-sm">X Field: {xField || 'не вибрано'}</p>
        </div>
      </div>
    )
  }
  
  // Для pie chart Y поле не обов'язкове
  if (chartSpec.mark !== 'pie' && !yField) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p>Не вибрано поле для Y осі</p>
          <p className="text-sm">Y Field: {yField || 'не вибрано'}</p>
        </div>
      </div>
    )
  }

  const renderChart = () => {
    console.log('Rendering chart:', chartSpec.mark, 'with data:', chartData.slice(0, 2))
    
    switch (chartSpec.mark) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yField || 'value'} fill="#8884d8" />
          </BarChart>
        )

      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yField || 'value'} stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        )

      case 'scatter':
        return (
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Scatter dataKey={yField || 'value'} fill="#8884d8" />
          </ScatterChart>
        )

      case 'pie':
        // Для pie chart з категоріальними даними - рахуємо кількість кожного значення
        const pieData = chartData.reduce((acc: any[], item: any) => {
          const key = item[xField || 'category']
          const existing = acc.find(d => d.name === key)
          if (existing) {
            existing.value += 1
          } else {
            acc.push({ name: key, value: 1 })
          }
          return acc
        }, [])
        
        console.log('Pie chart data:', pieData)
        
        if (pieData.length === 0) {
          return (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Немає даних для pie chart
            </div>
          )
        }
        
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )

      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yField || 'value'} stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          </AreaChart>
        )

      case 'histogram':
        // Для histogram потрібно згрупувати дані
        const histogramData = chartData.reduce((acc: any[], item: any) => {
          const value = Number(item[yField || 'value'])
          const bucket = Math.floor(value / 1000) * 1000 // Групуємо по 1000
          const existing = acc.find(d => d.range === `${bucket}-${bucket + 999}`)
          if (existing) {
            existing.count += 1
          } else {
            acc.push({ range: `${bucket}-${bucket + 999}`, count: 1 })
          }
          return acc
        }, [])
        
        return (
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        )

      case 'boxplot':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yField || 'value'} fill="#8884d8" />
          </BarChart>
        )

      case 'heatmap':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yField || 'value'} fill="#8884d8" />
          </BarChart>
        )

      case 'gauge':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{chartData[0]?.[yField || 'value'] || 0}</div>
              <div className="text-sm text-gray-500">{xField}</div>
            </div>
          </div>
        )

      case 'bubble':
        return (
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Scatter dataKey={yField || 'value'} fill="#8884d8" />
          </ScatterChart>
        )

      case 'stacked':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yField || 'value'} fill="#8884d8" stackId="stack" />
          </BarChart>
        )

      case 'waterfall':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yField || 'value'} fill="#8884d8" />
          </BarChart>
        )

      case 'funnel':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg font-medium">Funnel Chart</div>
              <div className="text-sm text-gray-500">Показує процес конверсії</div>
            </div>
          </div>
        )

      case 'radar':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg font-medium">Radar Chart</div>
              <div className="text-sm text-gray-500">Порівняння багатьох змінних</div>
            </div>
          </div>
        )

      case 'tree':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg font-medium">Tree Map</div>
              <div className="text-sm text-gray-500">Ієрархічні дані</div>
            </div>
          </div>
        )

      case 'sankey':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg font-medium">Sankey Diagram</div>
              <div className="text-sm text-gray-500">Потік між категоріями</div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Невідомий тип чарту: {chartSpec.mark}
          </div>
        )
    }
  }

  return (
    <div className="w-full chart-export-container" style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-gray-500 text-center">
        Chart Type: {chartSpec.mark} | Data: {chartData.length} rows | X: {xField} | Y: {yField}
      </div>
    </div>
  )
}
