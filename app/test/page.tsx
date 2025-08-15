'use client'

import React, { useState } from 'react'
import { ChartBuilder } from '@/components/ChartBuilder'
import { DataProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, BarChart3 } from 'lucide-react'

export default function TestPage() {
  const [dataProfile, setDataProfile] = useState<DataProfile | null>(null)
  const [createdCharts, setCreatedCharts] = useState<any[]>([])

  // Sample data for testing
  const sampleData: DataProfile = {
    id: 'test-1',
    name: 'Sample Data',
    rowCount: 5,
    columnCount: 4,
    fields: [
      { name: 'name', type: 'string' },
      { name: 'age', type: 'number' },
      { name: 'city', type: 'string' },
      { name: 'salary', type: 'number' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    size: 1024,
    format: 'csv',
    sampleData: [
      { name: 'John', age: 25, city: 'New York', salary: 50000 },
      { name: 'Alice', age: 30, city: 'Los Angeles', salary: 60000 },
      { name: 'Bob', age: 35, city: 'Chicago', salary: 55000 },
      { name: 'Eve', age: 28, city: 'Boston', salary: 52000 },
      { name: 'David', age: 32, city: 'Seattle', salary: 58000 }
    ]
  }

  const handleLoadSampleData = () => {
    setDataProfile(sampleData)
    console.log('Sample data loaded:', sampleData)
  }

  const handleChartCreated = (chartSpec: any) => {
    const newChart = {
      ...chartSpec,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const updatedCharts = [...createdCharts, newChart]
    setCreatedCharts(updatedCharts)
    
    console.log('Chart created successfully:', newChart)
    alert(`✅ Chart "${newChart.title}" created successfully!`)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Chart Builder Test Page
          </h1>
          <p className="text-muted-foreground">
            Test the Create Chart button functionality
          </p>
        </div>

        {/* Load Sample Data Button */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Load Sample Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLoadSampleData} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Load Sample Data for Testing
            </Button>
            {dataProfile && (
              <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-md">
                <div className="text-success-600 font-medium">✅ Sample data loaded successfully!</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Dataset: {dataProfile.name} ({dataProfile.rowCount} rows, {dataProfile.columnCount} columns)
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart Builder */}
        {dataProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ChartBuilder
                dataProfile={dataProfile}
                onChartCreated={handleChartCreated}
              />
            </div>
            
            {/* Created Charts List */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Created Charts ({createdCharts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {createdCharts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No charts created yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {createdCharts.map((chart) => (
                        <div key={chart.id} className="p-3 border border-border rounded-md">
                          <div className="font-medium text-sm">{chart.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Type: {chart.mark} | X: {chart.encoding.x?.field} | Y: {chart.encoding.y?.field}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {chart.createdAt.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!dataProfile && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Ready to Test Chart Creation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Click "Load Sample Data" above to start testing the Create Chart button functionality.
                </p>
                <div className="text-sm text-muted-foreground">
                  This will load sample data with fields: name, age, city, salary
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
