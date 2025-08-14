'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Plus, 
  Play, 
  Edit, 
  Share2, 
  Download,
  BookOpen,
  Users,
  Calendar
} from 'lucide-react'

interface Story {
  id: string
  title: string
  description: string
  charts: number
  views: number
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'published'
}

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Stories</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            Stories page is temporarily simplified for GitHub Pages deployment.
          </p>
        </div>
      </div>
    </div>
  )
}
