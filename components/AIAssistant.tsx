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
  "Який чарт краще? 📊",
  "Покажи тренди 📈",
  "Знайди кореляції 🔍",
  "Порівняй категорії 📋",
  "Що показують дані? 🤔"
]

const QUICK_ACTIONS = [
  { icon: BarChart3, label: 'AI Auto-Analysis 🚀', action: 'suggest_chart' },
  { icon: Brain, label: 'Знайти інсайти 💡', action: 'find_insights' },
  { icon: Target, label: 'Аналіз даних 📊', action: 'analyze_data' },
  { icon: Search, label: 'Пошук патернів 🔍', action: 'find_patterns' }
]

export function AIAssistant({ dataProfile, onChartSuggestion }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Привіт! 👋 Я твій AI помічник для роботи з даними. Бачу, що ти хочеш створити якісь круті візуалізації! Що у тебе за дані? Можу допомогти з чартами, аналізом та знайти цікаві патерни. Що скажеш?",
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
        return "Хм, спочатку потрібно завантажити дані! 📊 Без них я не можу дати конкретні поради. Закинь файл і я подивлюся що там у тебе цікавого! 😊"
      }
      
      const numericFields = dataProfile.fields.filter(f => f.type === 'number' || f.type === 'integer')
      const categoricalFields = dataProfile.fields.filter(f => f.type === 'string' || f.type === 'categorical')
      
      if (numericFields.length >= 2) {
        return `О, круто! 🎯 Бачу у тебе ${numericFields.length} числових полів. Для ${numericFields[0].name} та ${numericFields[1].name} я б порадив **scatter plot** - він покаже чи є між ними зв'язок. Або **line chart** якщо хочеш побачити тренди. Що скажеш?`
      } else if (categoricalFields.length > 0 && numericFields.length > 0) {
        return `Ага, маєш категорії та числа! 📈 Для ${categoricalFields[0].name} vs ${numericFields[0].name} **bar chart** буде ідеальним - чітко покаже різниці. Якщо категорій багато, то **horizontal bar chart** виглядатиме краще. Спробуємо?`
      } else {
        return "Хм, цікаві дані! 🤔 Для категорій спробуй **bar chart** або **pie chart**, а для чисел - **histogram**. Або просто натисни 'AI Auto-Analysis' і я сам виберу найкращий варіант! 😎"
      }
    }
    
    if (lowerMessage.includes('тренд') || lowerMessage.includes('час')) {
      return "Для трендів **line chart** - це класика! 📈 Він покаже як змінюються значення в часі. Переконайся тільки, що дати правильно форматувані. Хочеш, щоб я створив такий чарт? 🚀"
    }
    
    if (lowerMessage.includes('кореляці') || lowerMessage.includes('зв\'язок')) {
      return "Для кореляцій **scatter plot** - мій фаворит! 🔍 Він покаже чи є зв'язок між двома числами. Або **correlation heatmap** якщо маєш багато змінних. Це допоможе знайти приховані патерни! 💡"
    }
    
    if (lowerMessage.includes('порівнян') || lowerMessage.includes('категорі')) {
      return "Для порівняння категорій **bar charts** - це must-have! 📊 Вони дозволяють легко порівнювати значення. Для пропорцій спробуй **pie chart** або **donut chart**. Що саме хочеш порівняти? 🤔"
    }
    
    if (lowerMessage.includes('інсайт') || lowerMessage.includes('аналіз') || lowerMessage.includes('що показують')) {
      if (!dataProfile) {
        return "Для інсайтів потрібні дані! 📊 Завантаж файл і я проаналізую його на предмет цікавих патернів, викидів та трендів. Обіцяю, буде цікаво! 🔍"
      }
      
      const missingFields = dataProfile.fields.filter(f => (f.missingValues || 0) > 0)
      const numericFields = dataProfile.fields.filter(f => f.type === 'number' || f.type === 'integer')
      
      let insights = `Окей, ось що я знайшов у твоїх даних: 🔍\n\n`
      
      if (dataProfile.rowCount < 10) {
        insights += `• **Маленький датасет**: ${dataProfile.rowCount} рядків - це не багато, але для початку підійде! 📝\n`
      } else if (dataProfile.rowCount < 1000) {
        insights += `• **Середній датасет**: ${dataProfile.rowCount.toLocaleString()} рядків - це вже щось! 📊\n`
      } else {
        insights += `• **Великий датасет**: ${dataProfile.rowCount.toLocaleString()} рядків - вау! 🚀\n`
      }
      
      insights += `• **${dataProfile.columnCount} колонок** - ${dataProfile.columnCount < 5 ? 'компактно!' : 'багато змінних!'}\n`
      
      if (missingFields.length > 0) {
        insights += `• **Увага**: ${missingFields.length} полів мають відсутні значення - можеш їх очистити\n`
      }
      
      if (numericFields.length >= 2) {
        insights += `• **Потенціал**: ${numericFields.length} числових полів - можна шукати кореляції! 🔗\n`
      }
      
      insights += `\nХочеш, щоб я створив візуалізацію для подальшого дослідження? Натисни 'AI Auto-Analysis'! 🎯`
      
      return insights
    }
    
    return "Привіт! 👋 Я тут, щоб допомогти з твоїми даними! Можу порадити чарти, проаналізувати дані або створити візуалізації. Що цікавить? Або просто натисни одну з кнопок знизу! 😊"
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
    if (!dataProfile) {
      alert('❌ Немає даних для аналізу!')
      return
    }
    
    console.log('🔍 AI аналізує поля:', dataProfile.fields.map(f => ({ name: f.name, type: f.type })))
    
    // УЛЬТРА-АГРЕСИВНА логіка - AI ЗАВЖДИ ВИБИРАЄ ОБИДВІ ОСІ!
    let chartType = 'bar'
    let xField = ''
    let yField = ''
    
    // ВИБИРАЄМО ПОЛЯ НЕЗАЛЕЖНО ВІД ТИПУ!
    if (dataProfile.fields.length >= 2) {
      // Є хоча б 2 поля - використовуємо їх
      xField = dataProfile.fields[0].name
      yField = dataProfile.fields[1].name
      chartType = 'bar'
      console.log('🎯 Вибрав перші два поля:', { xField, yField })
    } else if (dataProfile.fields.length === 1) {
      // Тільки одне поле - використовуємо його для обох осей
      xField = dataProfile.fields[0].name
      yField = dataProfile.fields[0].name
      chartType = 'bar'
      console.log('🎯 Один поле - використовую для обох осей:', { xField, yField })
    } else {
      // Немає полів - створюємо фейкові
      xField = 'Default_X'
      yField = 'Default_Y'
      chartType = 'bar'
      console.log('🎯 Немає полів - створюю фейкові:', { xField, yField })
    }
    
    // ПЕРЕВІРКА - ПОЛЯ ПОВИННІ БУТИ ВИБРАНІ!
    if (!xField || !yField) {
      console.error('🚨 ПОЛЯ НЕ ВИБРАНІ! Створюю екстрені поля!')
      xField = 'Emergency_X'
      yField = 'Emergency_Y'
    }
    
    console.log('🎯 ФІНАЛЬНИЙ ВИБІР AI:', { xField, yField, chartType })
    
    // СТВОРЮЄМО ЧАРТ З ОБОВ'ЯЗКОВИМИ ПОЛЯМИ
    const chartSpec: ChartSpec = {
      id: Math.random().toString(36).substr(2, 9),
      title: `AI Пропозиція - ${dataProfile.name}`,
      data: {
        sourceId: dataProfile.id
      },
      mark: chartType as ChartMark,
      encoding: {
        x: { field: xField, type: 'nominal' },  // ЗАВЖДИ ВКАЗУЄМО X
        y: { field: yField, type: 'quantitative' }  // ЗАВЖДИ ВКАЗУЄМО Y
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
    
    console.log('✅ AI створює чарт з ОБОВ\'ЯЗКОВИМИ полями:', chartSpec)
    
    // ПЕРЕВІРЯЄМО ЧАРТ ПЕРЕД ВІДПРАВКОЮ
    if (!chartSpec.encoding.x || !chartSpec.encoding.y) {
      console.error('🚨 ЧАРТ НЕ МАЄ ОСЕЙ! Виправляю...')
      chartSpec.encoding.x = { field: 'Fixed_X', type: 'nominal' }
      chartSpec.encoding.y = { field: 'Fixed_Y', type: 'quantitative' }
    }
    
    console.log('✅ ФІНАЛЬНИЙ ЧАРТ:', chartSpec)
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
            <div className="px-4 pb-3 border-b border-gray-100 dark:border-gray-700">
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
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                                             <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Швидкі запити: ⚡</div>
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
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                                         <span className="text-xs text-gray-500 dark:text-gray-400">AI думає... 🤔</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                                     placeholder="Запитай мене про що завгодно! 😊"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
