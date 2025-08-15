'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { decodeState } from '@/lib/permalink'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Download, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImportPage() {
  const searchParams = useSearchParams()
  const [importedData, setImportedData] = useState<any[]>([])
  const [source, setSource] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const s = searchParams.get('s')
    
    if (s) {
      try {
        const decodedData = decodeState(s) as any
        if (decodedData.values && Array.isArray(decodedData.values)) {
          setImportedData(decodedData.values)
          setSource(decodedData.source || 'Unknown source')
          setTitle(decodedData.title || 'Imported data')
          toast.success(`Імпортовано ${decodedData.values.length} рядків`)
        } else {
          setError('Невірний формат даних')
        }
      } catch (error) {
        console.error('Помилка декодування даних:', error)
        setError('Помилка декодування даних')
      }
    }
  }, [searchParams])

  const handleContinueToApp = () => {
    // Зберігаємо дані в localStorage для передачі в головний додаток
    if (typeof window !== 'undefined') {
      localStorage.setItem('importedData', JSON.stringify({
        data: importedData,
        source,
        title
      }))
    }
    
    // Перенаправляємо на головну сторінку
    window.location.href = '/'
  }

  const handleDownloadCSV = () => {
    if (importedData.length === 0) return
    
    try {
      const headers = Object.keys(importedData[0])
      const csvContent = [
        headers.join(','),
        ...importedData.map(row => 
          headers.map(header => {
            const value = row[header]
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`
            }
            return value || ''
          }).join(',')
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'imported_data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Файл завантажено!')
    } catch (error) {
      console.error('Помилка експорту:', error)
      toast.error('Помилка експорту файлу')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Помилка імпорту
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Повернутися на головну
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              📊 Дані імпортовано з Chrome розширення
            </h1>
            <p className="text-lg text-muted-foreground">
              Перегляньте та продовжіть роботу з даними
            </p>
          </div>

          {importedData.length > 0 && (
            <div className="space-y-6">
              {/* Інформація про імпорт */}
              <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="h-5 w-5" />
                    Імпорт успішний
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {importedData.length}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Рядків даних
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {Object.keys(importedData[0] || {}).length}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Колонок
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        ✓
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Готово до обробки
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Деталі джерела */}
              <Card>
                <CardHeader>
                  <CardTitle>Джерело даних</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Сторінка:</span>
                      <span className="ml-2 text-muted-foreground">{title}</span>
                    </div>
                    <div>
                      <span className="font-medium">URL:</span>
                      <span className="ml-2 text-muted-foreground break-all">{source}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Прев'ю даних */}
              <Card>
                <CardHeader>
                  <CardTitle>Прев'ю даних</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {Object.keys(importedData[0] || {}).map((header, index) => (
                            <th key={index} className="text-left p-2 font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importedData.slice(0, 5).map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b">
                            {Object.values(row).map((value, colIndex) => (
                              <td key={colIndex} className="p-2 text-muted-foreground">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importedData.length > 5 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Показано перші 5 рядків з {importedData.length}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Дії */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Завантажити CSV
                </Button>
                <Button
                  onClick={handleContinueToApp}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Продовжити в додатку
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {importedData.length === 0 && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Дані не знайдено
                </h3>
                <p className="text-muted-foreground mb-4">
                  Переконайтеся, що ви використовуєте правильне посилання
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Повернутися на головну
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
