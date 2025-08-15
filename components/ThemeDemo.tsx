'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'

export function ThemeDemo() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Theme Demo</h1>
        <p className="text-muted-foreground text-lg">
          Тестування темної та світлої теми
        </p>
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-primary">Primary Card</CardTitle>
            <CardDescription>Картка з primary кольором</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Це приклад картки з primary кольором. Вона автоматично адаптується до теми.
            </p>
            <Button className="mt-4">Primary Button</Button>
          </CardContent>
        </Card>

        {/* Secondary Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-secondary-foreground">Secondary Card</CardTitle>
            <CardDescription>Картка з secondary кольором</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Це приклад картки з secondary кольором. Вона також адаптується до теми.
            </p>
            <Button variant="secondary" className="mt-4">Secondary Button</Button>
          </CardContent>
        </Card>

        {/* Accent Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-accent-foreground">Accent Card</CardTitle>
            <CardDescription>Картка з accent кольором</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Це приклад картки з accent кольором. Всі кольори адаптуються.
            </p>
            <Button variant="outline" className="mt-4">Outline Button</Button>
          </CardContent>
        </Card>

        {/* Success Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-success-600 dark:text-success-400">Success Card</CardTitle>
            <CardDescription>Картка з success кольором</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Це приклад картки з success кольором. Зелена палітра.
            </p>
            <Button className="btn-success mt-4">Success Button</Button>
          </CardContent>
        </Card>

        {/* Warning Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-warning-600 dark:text-warning-400">Warning Card</CardTitle>
            <CardDescription>Картка з warning кольором</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Це приклад картки з warning кольором. Жовта палітра.
            </p>
            <Button className="btn-warning mt-4">Warning Button</Button>
          </CardContent>
        </Card>

        {/* Error Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-error-600 dark:text-error-400">Error Card</CardTitle>
            <CardDescription>Картка з error кольором</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Це приклад картки з error кольором. Червона палітра.
            </p>
            <Button className="btn-error mt-4">Error Button</Button>
          </CardContent>
        </Card>
      </div>

      {/* Color Palette Demo */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Color Palette</h2>
        
        {/* Primary Colors */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Primary Colors</h3>
          <div className="grid grid-cols-11 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div
                key={shade}
                className={`color-primary-${shade} h-12 rounded-lg border border-border flex items-center justify-center text-xs font-medium`}
                style={{ color: shade >= 500 ? 'white' : 'black' }}
              >
                {shade}
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Secondary Colors</h3>
          <div className="grid grid-cols-11 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div
                key={shade}
                className={`color-secondary-${shade} h-12 rounded-lg border border-border flex items-center justify-center text-xs font-medium`}
                style={{ color: shade >= 500 ? 'white' : 'black' }}
              >
                {shade}
              </div>
            ))}
          </div>
        </div>

        {/* Success Colors */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Success Colors</h3>
          <div className="grid grid-cols-11 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div
                key={shade}
                className={`color-success-${shade} h-12 rounded-lg border border-border flex items-center justify-center text-xs font-medium`}
                style={{ color: shade >= 500 ? 'white' : 'black' }}
              >
                {shade}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Text Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Text Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Foreground Text</h3>
            <p className="text-foreground">Це основний текст, який адаптується до теми.</p>
            <p className="text-muted-foreground">Це приглушений текст для додаткової інформації.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">Primary Text</h3>
            <p className="text-primary">Це primary текст для акценту.</p>
            <p className="text-primary/70">Це primary текст з прозорістю.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
