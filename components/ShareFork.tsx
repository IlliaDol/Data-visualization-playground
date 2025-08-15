'use client'

import React, { useState } from 'react'
import { createPermalink } from '@/lib/permalink'
import { ChartSpecV1 } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Share2, Copy, Eye, Link, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ShareForkProps {
  chartSpec: ChartSpecV1
  className?: string
}

export function ShareFork({ chartSpec, className = '' }: ShareForkProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    try {
      const url = createPermalink(chartSpec, {
        prompt: chartSpec.meta?.prompt
      })
      setShareUrl(url)
      setShowShareModal(true)
    } catch (error) {
      console.error('Помилка створення посилання:', error)
      toast.error('Помилка створення посилання')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Посилання скопійовано!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Помилка копіювання:', error)
      toast.error('Помилка копіювання посилання')
    }
  }

  const handleFork = () => {
    // Перенаправляємо на головну сторінку з даними
    window.location.href = '/'
  }

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Поділитися
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFork}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Fork
        </Button>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Поділитися графіком
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-success-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Це посилання містить всі дані та налаштування графіка. 
                Будь-хто з цим посиланням може переглянути графік.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(false)}
                >
                  Закрити
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
