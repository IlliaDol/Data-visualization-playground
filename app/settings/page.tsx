'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  Key, 
  Palette, 
  Globe, 
  Download, 
  Upload,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            Settings page is temporarily simplified for GitHub Pages deployment.
          </p>
        </div>
      </div>
    </div>
  )
}
