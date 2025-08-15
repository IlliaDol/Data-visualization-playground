'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatFileSize, parseFile, detectFileFormat, isFileSupported } from '@/lib/utils'
import { DataProfile, FileUpload as FileUploadType } from '@/types'

interface FileUploadProps {
  onFileProcessed: (dataProfile: DataProfile) => void
  onError: (error: string) => void
}

const ACCEPTED_FILE_TYPES = {
  // Текстовые форматы
  'text/csv': ['.csv'],
  'text/tab-separated-values': ['.tsv', '.tab'],
  'text/plain': ['.txt', '.log', '.dat'],
  
  // Excel форматы
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xlsm'],
  
  // JSON форматы
  'application/json': ['.json'],
  'application/ld+json': ['.jsonld'],
  
  // XML форматы
  'application/xml': ['.xml'],
  'text/xml': ['.xml'],
  
  // Сжатые форматы
  'application/gzip': ['.gz', '.gzip'],
  'application/x-gzip': ['.gz'],
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  
  // Специальные форматы
  'application/parquet': ['.parquet'],
  'application/numpy': ['.npz', '.npy'],
  'application/pickle': ['.pkl', '.pickle'],
  'application/hdf5': ['.h5', '.hdf5'],
  'application/feather': ['.feather'],
  'application/arrow': ['.arrow'],
  'application/avro': ['.avro'],
  'application/orc': ['.orc'],
  
  // Логи и системные файлы
  'text/log': ['.log'],
  'application/log': ['.log'],
  
  // Другие форматы
  'text/yaml': ['.yaml', '.yml'],
  'text/toml': ['.toml'],
  'application/toml': ['.toml'],
  'text/ini': ['.ini', '.cfg', '.conf'],
  'application/ini': ['.ini', '.cfg', '.conf']
}

export function FileUpload({ onFileProcessed, onError }: FileUploadProps) {
  const [uploads, setUploads] = useState<FileUploadType[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Видаляємо автоматичне завантаження демо-даних
  // Тепер користувач може завантажувати свої власні файли

  const processFile = useCallback(async (file: File) => {
    const uploadId = crypto.randomUUID()
    const upload: FileUploadType = {
      id: uploadId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }

    console.log('Starting to process file:', file.name, 'Type:', file.type)
    setUploads(prev => [...prev, upload])

    try {
      // Update status to processing
      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { ...u, status: 'processing', progress: 50 } : u
      ))

      let data: Record<string, any>[]
      let fields: string[]

      // Check if file is supported
      if (!isFileSupported(file)) {
        throw new Error(`Unsupported file format: ${file.name}. Supported formats: CSV/TSV, Excel (.xlsx/.xls/.xlsm), JSON/XML, YAML/TOML, LOG, Parquet, NumPy (.npz/.npy), compressed (.gz/.zip), and more.`)
      }

      // Detect file format and parse
      const format = detectFileFormat(file)
      console.log(`Parsing ${format.toUpperCase()} file: ${file.name}`)
      
      try {
        const result = await parseFile(file)
        data = result.data
        fields = result.fields
        console.log(`${format.toUpperCase()} parsed successfully:`, { rows: data.length, fields })
      } catch (error) {
        console.error(`Error parsing ${format} file:`, error)
        throw new Error(`Failed to parse ${format} file: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Create data profile
      const dataProfile: DataProfile = {
        id: crypto.randomUUID(),
        name: file.name,
        rowCount: data.length,
        columnCount: fields.length,
        fields: fields.map(fieldName => {
          const values = data.map(row => row[fieldName])
          return {
            name: fieldName,
            type: 'string', // Will be detected later
            uniqueValues: new Set(values).size,
            missingValues: values.filter(v => v === null || v === undefined || v === '').length
          }
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
        size: file.size,
        format: format,
        sampleData: data.slice(0, 10)
      }

      // Update status to completed
      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { ...u, status: 'completed', progress: 100, dataProfile } : u
      ))

      onFileProcessed(dataProfile)

    } catch (error) {
      console.error('File processing error:', error)
      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { 
          ...u, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } : u
      ))
      onError(error instanceof Error ? error.message : 'Failed to process file')
    }
  }, [onFileProcessed, onError])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles.map(f => f.name))
    setIsProcessing(true)
    Promise.all(acceptedFiles.map(processFile))
      .finally(() => {
        setIsProcessing(false)
        console.log('All files processed')
      })
  }, [processFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true
  })

  const removeUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(u => u.id !== uploadId))
  }



  const getStatusIcon = (status: FileUploadType['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse" />
      case 'processing':
        return <File className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: FileUploadType['status']) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-500'
      case 'processing':
        return 'text-yellow-500'
      case 'completed':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Data Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary hover:bg-muted'
              }
              ${isProcessing ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium text-primary">
                Drop the files here...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports CSV, TSV, Excel, JSON, XML, YAML, TOML, LOG, and more formats up to 200MB
                </p>
                <Button variant="outline">
                  Choose Files
                </Button>
              </div>
            )}
          </div>

          {/* Інструкції для завантаження */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Підтримувані формати:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="text-center p-3 border rounded-lg">
                <span className="font-medium">CSV/TSV</span>
                <p className="text-xs text-muted-foreground">Comma/tab-separated values</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <span className="font-medium">Excel</span>
                <p className="text-xs text-muted-foreground">.xlsx, .xls, .xlsm files</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <span className="font-medium">JSON/XML</span>
                <p className="text-xs text-muted-foreground">Structured data formats</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <span className="font-medium">YAML/TOML</span>
                <p className="text-xs text-muted-foreground">Configuration files</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <span className="font-medium">LOG</span>
                <p className="text-xs text-muted-foreground">Log files</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <span className="font-medium">Parquet</span>
                <p className="text-xs text-muted-foreground">Columnar data format</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <span className="font-medium">NumPy</span>
                <p className="text-xs text-muted-foreground">.npz, .npy files</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <span className="font-medium">Compressed</span>
                <p className="text-xs text-muted-foreground">.gz, .zip files</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(upload.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{upload.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(upload.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${getStatusColor(upload.status)}`}>
                      {upload.status === 'uploading' && 'Uploading...'}
                      {upload.status === 'processing' && 'Processing...'}
                      {upload.status === 'completed' && 'Completed'}
                      {upload.status === 'error' && upload.error}
                    </span>
                    
                    {upload.status === 'uploading' || upload.status === 'processing' ? (
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(upload.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {uploads.some(upload => upload.status === 'completed' && upload.dataProfile) ? (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {uploads
              .filter(upload => upload.status === 'completed' && upload.dataProfile)
              .map((upload) => (
                <div key={upload.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{upload.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {upload.dataProfile?.rowCount} rows × {upload.dataProfile?.columnCount} columns
                    </span>
                  </div>
                  
                  {/* Sample data table */}
                  {upload.dataProfile?.sampleData && upload.dataProfile.sampleData.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-muted">
                            {Object.keys(upload.dataProfile.sampleData[0]).map((header) => (
                              <th key={header} className="px-3 py-2 text-left font-medium border-b">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {upload.dataProfile.sampleData.slice(0, 5).map((row, index) => (
                            <tr key={index} className="border-b hover:bg-muted">
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 text-sm">
                                  {String(value || '').length > 50 
                                    ? String(value || '').substring(0, 50) + '...' 
                                    : String(value || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {upload.dataProfile.sampleData.length > 5 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Showing first 5 rows of {upload.dataProfile.sampleData.length} total rows
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Field information */}
                  {upload.dataProfile?.fields && (
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Field Information</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {upload.dataProfile.fields.map((field) => (
                          <div key={field.name} className="p-2 bg-muted rounded text-xs">
                            <div className="font-medium">{field.name}</div>
                                                          <div className="text-muted-foreground">
                              Type: {field.type} | Unique: {field.uniqueValues} | Missing: {field.missingValues}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      ) : (
        /* Empty State */
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <File className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No data loaded yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Завантажте файл, щоб побачити превью даних
              </p>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Підтримуються формати: CSV, TSV, Excel, JSON, XML, YAML, TOML, LOG, Parquet, NumPy, та інші
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
