'use client'

import React, { useState, useEffect } from 'react'
import { Table } from 'apache-arrow'
import { buildCleanPlan, applyPlan, exportCleanedCSV } from '@/lib/cleaner'
import { TransformPlan } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Wand2, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  RotateCcw, 
  Eye,
  FileText,
  Calendar,
  Hash,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DataCleanerProps {
  data: any[]
  onDataCleaned?: (cleanedData: any[]) => void
  onClose?: () => void
}

export function DataCleaner({ data, onDataCleaned, onClose }: DataCleanerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cleanPlan, setCleanPlan] = useState<TransformPlan | null>(null)
  const [cleanedData, setCleanedData] = useState<any[] | null>(null)
  const [table, setTable] = useState<Table | null>(null)

  useEffect(() => {
    if (data && data.length > 0) {
      // Конвертуємо дані в Apache Arrow Table
      try {
        const arrowTable = Table.from(data)
        setTable(arrowTable)
      } catch (error) {
        console.error('Помилка конвертації в Arrow Table:', error)
        toast.error('Помилка обробки даних')
      }
    }
  }, [data])

  const handleOpenCleaner = async () => {
    if (!table) {
      toast.error('Немає даних для очищення')
      return
    }

    setIsLoading(true)
    try {
      const plan = buildCleanPlan(table)
      setCleanPlan(plan)
      setIsOpen(true)
      toast.success('План очищення створено!')
    } catch (error) {
      console.error('Помилка створення плану очищення:', error)
      toast.error('Помилка аналізу даних')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyClean = async () => {
    if (!table || !cleanPlan) return

    setIsLoading(true)
    try {
      const cleanedTable = applyPlan(table, cleanPlan)
      const cleanedArray = cleanedTable.toArray()
      setCleanedData(cleanedArray)
      
      if (onDataCleaned) {
        onDataCleaned(cleanedArray)
      }
      
      toast.success('Дані очищено!')
    } catch (error) {
      console.error('Помилка очищення даних:', error)
      toast.error('Помилка очищення даних')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCleaned = () => {
    if (!table) return

    try {
      const csv = exportCleanedCSV(table)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'cleaned_data.csv')
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

  const handleClose = () => {
    setIsOpen(false)
    setCleanPlan(null)
    setCleanedData(null)
    if (onClose) onClose()
  }

  return (
    <>
      <Button
        onClick={handleOpenCleaner}
        disabled={isLoading || !data || data.length === 0}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Wand2 className="h-4 w-4" />
        {isLoading ? 'Аналізую...' : 'Виправити дані'}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Wand2 className="h-6 w-6" />
                Агент-очисник даних
              </h2>
              <Button variant="ghost" onClick={handleClose}>
                ✕
              </Button>
            </div>

            {cleanPlan && (
              <div className="space-y-6">
                {/* Статистика */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Статистика даних
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {cleanPlan.stats.totalRows?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Рядків</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {cleanPlan.stats.totalColumns || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Колонок</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {cleanPlan.stats.transformsCount || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Змін</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {cleanPlan.stats.duplicatesRemoved ? '✓' : '—'}
                        </div>
                        <div className="text-sm text-muted-foreground">Дублікати</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* План трансформацій */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      План очищення
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cleanPlan.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="flex-shrink-0">
                            {item.op === 'setType' && <Hash className="h-4 w-4 text-blue-600" />}
                            {item.op === 'parseDate' && <Calendar className="h-4 w-4 text-green-600" />}
                            {item.op === 'trim' && <FileText className="h-4 w-4 text-orange-600" />}
                            {item.op === 'dropDuplicates' && <Trash2 className="h-4 w-4 text-red-600" />}
                            {item.op === 'normalizeDecimal' && <Hash className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.op === 'setType' && `Встановити тип ${item.field} як ${item.to}`}
                              {item.op === 'parseDate' && `Парсинг дати в ${item.field}`}
                              {item.op === 'trim' && `Видалити пробіли в ${item.field}`}
                              {item.op === 'dropDuplicates' && 'Видалити дублікати'}
                              {item.op === 'normalizeDecimal' && `Нормалізувати числа в ${item.field}`}
                            </div>
                            {item.op === 'normalizeDecimal' && (
                              <div className="text-sm text-muted-foreground">
                                Десятковий: {item.decimal}, Тисячні: {item.thousands || 'немає'}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Прев'ю змін */}
                {cleanPlan.preview.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Прев'ю змін
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Поле</th>
                              <th className="text-left p-2">Було</th>
                              <th className="text-left p-2">Буде</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cleanPlan.preview.map((item, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 font-medium">{item.field}</td>
                                <td className="p-2 text-muted-foreground">
                                  {String(item.before)}
                                </td>
                                <td className="p-2 text-green-600 font-medium">
                                  {String(item.after)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Дії */}
                <div className="flex gap-4 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleDownloadCleaned}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Завантажити CSV
                  </Button>
                  <Button
                    onClick={handleApplyClean}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RotateCcw className="h-4 w-4 animate-spin" />
                        Застосовую...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Застосувати зміни
                      </>
                    )}
                  </Button>
                </div>

                {/* Результат */}
                {cleanedData && (
                  <Card className="border-border bg-muted">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Дані успішно очищено!</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                        Всі трансформації застосовано. Тепер ви можете створювати графіки з очищеними даними.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
