'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Database, 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Calendar,
  Hash,
  Type
} from 'lucide-react'
import { DataProfile } from '@/types'

interface DataProfileProps {
  dataProfile: DataProfile
}

export function DataProfileComponent({ dataProfile }: DataProfileProps) {
  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'number':
      case 'integer':
        return <Hash className="h-4 w-4 text-blue-500" />
      case 'date':
        return <Calendar className="h-4 w-4 text-green-500" />
      case 'string':
        return <Type className="h-4 w-4 text-purple-500" />
      default:
        return <Type className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getQualityScore = (field: any) => {
    const missingPercentage = (field.missingValues / dataProfile.rowCount) * 100
    if (missingPercentage === 0) return { score: 100, label: 'Perfect', color: 'text-success-600' }
    if (missingPercentage < 5) return { score: 90, label: 'Excellent', color: 'text-success-600' }
    if (missingPercentage < 10) return { score: 75, label: 'Good', color: 'text-warning-600' }
    if (missingPercentage < 25) return { score: 50, label: 'Fair', color: 'text-warning-600' }
    return { score: 25, label: 'Poor', color: 'text-red-600' }
  }

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dataset Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{dataProfile.rowCount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Rows</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{dataProfile.columnCount}</div>
              <div className="text-sm text-muted-foreground">Columns</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {dataProfile.size ? `${(dataProfile.size / 1024).toFixed(1)} KB` : 'Unknown'}
              </div>
              <div className="text-sm text-muted-foreground">File Size</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{dataProfile.format?.toUpperCase()}</div>
              <div className="text-sm text-muted-foreground">Format</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Types Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Field Types Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['string', 'number', 'integer', 'date'].map((type) => {
              const count = dataProfile.fields.filter(f => f.type === type).length
              if (count === 0) return null
              
              return (
                <div key={type} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  {getFieldTypeIcon(type)}
                  <div>
                    <div className="font-medium text-foreground">{count}</div>
                    <div className="text-sm text-muted-foreground capitalize">{type}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Field Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Field Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataProfile.fields.map((field, index) => {
              const quality = getQualityScore(field)
              const missingPercentage = (((field.missingValues || 0) / dataProfile.rowCount) * 100).toFixed(1)
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getFieldTypeIcon(field.type)}
                      <div>
                        <h3 className="font-medium">{field.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{field.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${quality.color}`}>{quality.label}</div>
                      <div className="text-sm text-muted-foreground">{quality.score}% quality</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Unique values:</span>
                      <span className="ml-2 font-medium">{(field.uniqueValues || 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Missing values:</span>
                      <span className="ml-2 font-medium">{(field.missingValues || 0).toLocaleString()} ({missingPercentage}%)</span>
                    </div>
                    {field.type === 'number' || field.type === 'integer' ? (
                      <>
                        <div>
                          <span className="text-muted-foreground">Min:</span>
                          <span className="ml-2 font-medium">{field.min?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max:</span>
                          <span className="ml-2 font-medium">{field.max?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-muted-foreground">Cardinality:</span>
                          <span className="ml-2 font-medium">
                            {(field.uniqueValues || 0) <= 10 ? 'Low' : (field.uniqueValues || 0) <= 100 ? 'Medium' : 'High'}
                          </span>
                        </div>
                        <div></div>
                      </>
                    )}
                  </div>
                  
                  {(field.missingValues || 0) > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-700">
                          {field.missingValues || 0} missing values detected
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Quality Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Missing Data Analysis */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
                <div>
                  <h3 className="font-medium text-yellow-800">Missing Data</h3>
                  <p className="text-sm text-yellow-700">
                    {dataProfile.fields.filter(f => (f.missingValues || 0) > 0).length} fields have missing values
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>

            {/* Data Type Suggestions */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Type className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground">Type Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    {dataProfile.fields.filter(f => f.type === 'string').length} fields detected as text
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Review Types
              </Button>
            </div>

            {/* Cardinality Analysis */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground">Cardinality Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    {dataProfile.fields.filter(f => (f.uniqueValues || 0) <= 10).length} low-cardinality fields found
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data */}
      {dataProfile.sampleData && dataProfile.sampleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sample Data (First 10 rows)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {dataProfile.fields.map((field, index) => (
                      <th key={index} className="text-left p-2 font-medium">
                        {field.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataProfile.sampleData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b hover:bg-muted">
                      {dataProfile.fields.map((field, colIndex) => (
                        <td key={colIndex} className="p-2">
                          {row[field.name] !== null && row[field.name] !== undefined 
                            ? String(row[field.name]).substring(0, 50)
                            : <span className="text-muted-foreground">null</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataProfile.fields.filter(f => (f.missingValues || 0) > 0).length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Handle Missing Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider imputation strategies for fields with missing values to improve data quality.
                  </p>
                </div>
              </div>
            )}
            
            {dataProfile.fields.filter(f => f.type === 'string' && (f.uniqueValues || 0) <= 10).length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Type className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Consider Categorical Encoding</h4>
                  <p className="text-sm text-muted-foreground">
                    Low-cardinality string fields might be better treated as categorical variables.
                  </p>
                </div>
              </div>
            )}
            
            {dataProfile.fields.filter(f => f.type === 'number' || f.type === 'integer').length >= 2 && (
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <TrendingUp className="h-4 w-4 text-success-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Correlation Analysis Available</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple numeric fields detected. Consider correlation analysis for insights.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
