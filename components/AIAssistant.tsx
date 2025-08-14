'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Zap,
  Brain,
  Target,
  Search,
  HelpCircle
} from 'lucide-react'
import { DataProfile, ChartSpec, ChartMark } from '@/types'

interface AIAssistantProps {
  dataProfile?: DataProfile
  onChartSuggestion?: (chartSpec: ChartSpec) => void
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const QUICK_PROMPTS = [
  "Який тип чарту використати?",
  "Покажи тренди",
  "Знайди кореляції",
  "Порівняй категорії",
  "Що показують дані?"
]

const QUICK_ACTIONS = [
  { icon: BarChart3, label: 'Пропонувати чарт', action: 'suggest_chart' },
  { icon: Brain, label: 'Знайти інсайти', action: 'find_insights' },
  { icon: Target, label: 'Аналіз даних', action: 'analyze_data' },
  { icon: Search, label: 'Пошук патернів', action: 'find_patterns' }
]

export function AIAssistant({ dataProfile, onChartSuggestion }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Привіт! Я ваш AI помічник для візуалізації даних. Можу допомогти вибрати правильні чарти, проаналізувати дані та знайти інсайти. Що вас цікавить?",
      timestamp: new Date(),
      suggestions: QUICK_PROMPTS
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
    
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('чарт') || lowerMessage.includes('графік') || lowerMessage.includes('візуалізація')) {
      if (!dataProfile) {
        return "Буду радий допомогти вибрати правильний чарт! Спочатку завантажте ваші дані, щоб я міг проаналізувати їх та надати конкретні рекомендації."
      }
      
      const numericFields = dataProfile.fields.filter(f => f.type === 'number' || f.type === 'integer')
      const categoricalFields = dataProfile.fields.filter(f => f.type === 'string' || f.type === 'categorical')
      
      if (numericFields.length >= 2) {
        return `На основі ваших даних рекомендую **scatter plot** для показу зв'язку між ${numericFields[0].name} та ${numericFields[1].name}. Це допоможе виявити кореляції та патерни. Також можна спробувати **line chart** для показу трендів.`
      } else if (categoricalFields.length > 0 && numericFields.length > 0) {
        return `Для ваших даних пропоную **bar chart** для порівняння ${categoricalFields[0].name} з ${numericFields[0].name}. Це чітко покаже різниці між категоріями. Якщо категорій багато, розгляньте **horizontal bar chart**.`
      } else {
        return "Бачу структуру ваших даних. Для категоріальних даних спробуйте **bar chart** або **pie chart**. Для числових даних розгляньте **histogram** для показу розподілу. Хочете, щоб я створив конкретний чарт?"
      }
    }
    
    if (lowerMessage.includes('тренд') || lowerMessage.includes('час')) {
      return "Для показу трендів у часі рекомендую **line chart**. Він ідеально підходить для відображення змін значень протягом неперервного періоду. Переконайтеся, що часові дані правильно форматується."
    }
    
    if (lowerMessage.includes('кореляці') || lowerMessage.includes('зв\'язок')) {
      return "Для пошуку кореляцій використовуйте **scatter plot** для двох числових змінних або **correlation heatmap** для кількох змінних. Це допоможе виявити патерни та зв'язки у ваших даних."
    }
    
    if (lowerMessage.includes('порівнян') || lowerMessage.includes('категорі')) {
      return "Для порівняння категорій **bar charts** зазвичай найкращий вибір. Вони дозволяють легко порівнювати значення між різними групами. Для пропорцій розгляньте **pie chart** або **donut chart**."
    }
    
    if (lowerMessage.includes('інсайт') || lowerMessage.includes('аналіз')) {
      if (!dataProfile) {
        return "Буду радий надати інсайти про ваші дані! Спочатку завантажте набір даних, і я проаналізую його, щоб знайти цікаві патерни, викиди та тренди."
      }
      
      const missingFields = dataProfile.fields.filter(f => (f.missingValues || 0) > 0)
      const numericFields = dataProfile.fields.filter(f => f.type === 'number' || f.type === 'integer')
      
      let insights = `Ось кілька інсайтів про ваш набір даних:\n\n`
      insights += `• **Розмір датасету**: ${dataProfile.rowCount.toLocaleString()} рядків, ${dataProfile.columnCount} колонок\n`
      
      if (missingFields.length > 0) {
        insights += `• **Якість даних**: ${missingFields.length} полів мають відсутні значення\n`
      }
      
      if (numericFields.length >= 2) {
        insights += `• **Потенціал аналізу**: ${numericFields.length} числових полів доступні для кореляційного аналізу\n`
      }
      
      insights += `\nХочете, щоб я створив конкретну візуалізацію для подальшого дослідження цих інсайтів?`
      
      return insights
    }
    
    return "Я тут, щоб допомогти з вашими потребами візуалізації даних! Можете запитати мене про типи чартів, аналіз даних або запитати конкретні візуалізації. Що б ви хотіли дослідити?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    
    try {
      const aiResponse = await generateAIResponse(inputValue)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI response error:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'suggest_chart':
        createChartSuggestion()
        break
      case 'find_insights':
        handleQuickPrompt("Що показують дані? Знайди інсайти")
        break
      case 'analyze_data':
        handleQuickPrompt("Проаналізуй структуру даних")
        break
      case 'find_patterns':
        handleQuickPrompt("Знайди патерни та кореляції")
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const createChartSuggestion = () => {
    if (!dataProfile) return
    
    const numericFields = dataProfile.fields.filter(f => f.type === 'number' || f.type === 'integer')
    const categoricalFields = dataProfile.fields.filter(f => f.type === 'string' || f.type === 'categorical')
    
    let chartType = 'bar'
    let xField = ''
    let yField = ''
    
    if (numericFields.length >= 2) {
      chartType = 'scatter'
      xField = numericFields[0].name
      yField = numericFields[1].name
    } else if (categoricalFields.length > 0 && numericFields.length > 0) {
      chartType = 'bar'
      xField = categoricalFields[0].name
      yField = numericFields[0].name
    }
    
    const chartSpec: ChartSpec = {
      id: Math.random().toString(36).substr(2, 9),
      title: `AI Пропозиція - ${dataProfile.name}`,
      data: {
        sourceId: dataProfile.id
      },
      mark: chartType as ChartMark,
      encoding: {
        x: xField ? { field: xField, type: 'nominal' } : undefined,
        y: yField ? { field: yField, type: 'quantitative' } : undefined
      },
      config: {
        theme: 'light',
        legend: true,
        labels: true,
        grid: true,
        axis: { x: true, y: true },
        tooltip: true,
        animation: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    onChartSuggestion?.(chartSpec)
  }

  return (
    <Card className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'h-16' : 'h-[500px]'}`}>
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-blue-600" />
            <span>AI Помічник</span>
            {dataProfile && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Дані завантажено</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isCollapsed ? (
              <MessageSquare className="h-4 w-4 text-gray-400" />
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Quick Actions */}
          {dataProfile && (
            <div className="px-4 pb-3 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.action}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center gap-2 text-xs h-8"
                    >
                      <Icon className="h-3 w-3" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[280px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-lg p-2 text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-medium text-gray-500">Швидкі запити:</div>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickPrompt(suggestion)}
                            className="text-xs h-6 px-2"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-3 w-3 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="h-3 w-3 text-blue-600" />
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">AI думає...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="border-t p-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Запитайте про чарти, аналіз даних..."
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={1}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="px-3"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
