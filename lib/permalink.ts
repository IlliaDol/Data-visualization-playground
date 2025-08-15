import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { ChartSpecV1, PermalinkState } from '@/types'

/**
 * Кодує стан графіка в URL-безпечний формат
 */
export function encodeState(obj: unknown): string {
  try {
    const json = JSON.stringify(obj)
    return compressToEncodedURIComponent(json)
  } catch (error) {
    console.error('Помилка кодування стану:', error)
    throw new Error('Не вдалося закодувати стан')
  }
}

/**
 * Декодує стан з URL-безпечного формату
 */
export function decodeState(s: string): unknown {
  try {
    const json = decompressFromEncodedURIComponent(s)
    if (!json) {
      throw new Error('Порожній або недійсний стан')
    }
    return JSON.parse(json)
  } catch (error) {
    console.error('Помилка декодування стану:', error)
    throw new Error('Не вдалося декодувати стан')
  }
}

/**
 * Створює permalink для графіка
 */
export function createPermalink(chartSpec: ChartSpecV1, options?: {
  dataSample?: any[]
  transforms?: any[]
  prompt?: string
}): string {
  const state: PermalinkState = {
    chartSpec,
    dataSample: options?.dataSample,
    transforms: options?.transforms,
    meta: {
      originalDatasetHash: chartSpec.meta?.datasetHash || '',
      createdAt: new Date().toISOString(),
      prompt: options?.prompt || chartSpec.meta?.prompt
    }
  }
  
  const encodedState = encodeState(state)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  
  return `${baseUrl}/q?prompt=${encodeURIComponent(options?.prompt || '')}&s=${encodedState}`
}

/**
 * Створює короткий slug для збереження в KV/DB
 */
export function createShortSlug(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Маскує PII дані для безпечного шарингу
 */
export function maskPII(data: any[]): any[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const phoneRegex = /(\+?[\d\s\-\(\)]{10,})/
  const ibanRegex = /[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}/
  
  return data.map(row => {
    const maskedRow = { ...row }
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'string') {
        let maskedValue = value
        if (emailRegex.test(value)) {
          maskedValue = value.replace(/(.{2}).*@.*/, '$1***@***')
        } else if (phoneRegex.test(value)) {
          maskedValue = value.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2')
        } else if (ibanRegex.test(value)) {
          maskedValue = value.replace(/(.{4}).*(.{4})/, '$1****$2')
        }
        maskedRow[key] = maskedValue
      }
    }
    return maskedRow
  })
}

/**
 * Створює семпл даних для приватних датасетів
 */
export function createDataSample(data: any[], sampleSize: number = 50): any[] {
  if (data.length <= sampleSize) return data
  
  // Випадковий семпл
  const shuffled = [...data].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, sampleSize)
}
