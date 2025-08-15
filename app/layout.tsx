import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Data Visualization Playground',
  description: 'Universal data visualization playground with AI assistance',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
            <Navigation />
            <main className="min-h-screen bg-background text-foreground">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
