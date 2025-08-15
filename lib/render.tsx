'use client'

import { useEffect, useRef } from 'react'
import embed from 'vega-embed'
import { ChartSpecV1 } from '@/types'

/**
 * Конвертує ChartSpec в Vega-Lite специфікацію
 */
export function toVegaLite(spec: ChartSpecV1): any {
  const vl: any = { 
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json', 
    mark: spec.mark, 
    encoding: {}, 
    data: {} 
  }
  
  // Дані
  if (spec.data.values) {
    vl.data = { values: spec.data.values }
  } else if (spec.data.id) {
    vl.data = { name: spec.data.id }
  }
  
  // Encoding
  if (spec.encoding.x) {
    vl.encoding.x = {
      field: spec.encoding.x.field,
      type: spec.encoding.x.type,
      ...(spec.encoding.x.aggregate && { aggregate: spec.encoding.x.aggregate }),
      ...(spec.encoding.x.bin && { bin: spec.encoding.x.bin }),
      ...(spec.encoding.x.timeUnit && { timeUnit: spec.encoding.x.timeUnit })
    }
  }
  
  if (spec.encoding.y) {
    vl.encoding.y = {
      field: spec.encoding.y.field,
      type: spec.encoding.y.type,
      ...(spec.encoding.y.aggregate && { aggregate: spec.encoding.y.aggregate })
    }
  }
  
  if (spec.encoding.color) {
    vl.encoding.color = {
      ...(spec.encoding.color.field && { field: spec.encoding.color.field }),
      ...(spec.encoding.color.type && { type: spec.encoding.color.type })
    }
  }
  
  if (spec.encoding.size) {
    vl.encoding.size = {
      ...(spec.encoding.size.field && { field: spec.encoding.size.field }),
      ...(spec.encoding.size.type && { type: spec.encoding.size.type })
    }
  }
  
  if (spec.encoding.tooltip) {
    vl.encoding.tooltip = spec.encoding.tooltip.map(t => ({
      field: t.field,
      type: t.type
    }))
  }
  
  // Transforms
  if (spec.transforms && spec.transforms.length > 0) {
    vl.transform = spec.transforms.map(t => toVLTransform(t))
  }
  
  // Title
  if (spec.title) {
    vl.title = spec.title
  }
  
  return vl
}

/**
 * Конвертує наші трансформації в Vega-Lite формат
 */
function toVLTransform(transform: any): any {
  switch (transform.type) {
    case 'filter':
      return {
        filter: transform.params.condition
      }
    case 'aggregate':
      return {
        aggregate: transform.params.ops.map((op: any) => ({
          op: op.aggregate,
          field: op.field,
          as: op.as
        })),
        groupby: transform.params.groupby
      }
    case 'calculate':
      return {
        calculate: transform.params.expr,
        as: transform.params.as
      }
    case 'bin':
      return {
        bin: transform.params.bin,
        field: transform.params.field,
        as: transform.params.as
      }
    case 'timeUnit':
      return {
        timeUnit: transform.params.timeUnit,
        field: transform.params.field,
        as: transform.params.as
      }
    default:
      return transform
  }
}

/**
 * React компонент для рендерингу Vega-Lite графіка
 */
export function VegaLiteChart({ 
  spec, 
  width = 400, 
  height = 300,
  className = ''
}: { 
  spec: ChartSpecV1
  width?: number
  height?: number
  className?: string
}) {
  const chartRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (chartRef.current && spec) {
      try {
        const vegaSpec = toVegaLite(spec)
        
        // Очищаємо попередній графік
        chartRef.current.innerHTML = ''
        
        // Рендеримо новий графік
        embed(chartRef.current, vegaSpec, {
          actions: false,
          width,
          height
        }).catch((error) => {
          console.error('Помилка рендерингу Vega-Lite:', error)
          if (chartRef.current) {
            chartRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full text-red-500">
                <p>Помилка рендерингу графіка</p>
              </div>
            `
          }
        })
      } catch (error) {
        console.error('Помилка конвертації в Vega-Lite:', error)
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full text-red-500">
              <p>Помилка специфікації графіка</p>
            </div>
          `
        }
      }
    }
  }, [spec, width, height])
  
  return (
    <div 
      ref={chartRef} 
      className={`vega-lite-chart ${className}`}
      style={{ width, height }}
    />
  )
}

/**
 * Функція для рендерингу графіка (для використання поза React)
 */
export async function renderChart(spec: ChartSpecV1, container: HTMLElement, options?: {
  width?: number
  height?: number
}): Promise<void> {
  try {
    const vegaSpec = toVegaLite(spec)
    await embed(container, vegaSpec, {
      actions: false,
      width: options?.width || 400,
      height: options?.height || 300
    })
  } catch (error) {
    console.error('Помилка рендерингу графіка:', error)
    container.innerHTML = `
      <div class="flex items-center justify-center h-full text-red-500">
        <p>Помилка рендерингу графіка</p>
      </div>
    `
  }
}
