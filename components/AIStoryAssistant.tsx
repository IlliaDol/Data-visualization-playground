'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Image, 
  FileText, 
  Presentation, 
  Camera, 
  Palette, 
  Wand2, 
  Upload, 
  Download, 
  Copy, 
  Check,
  Brain,
  MessageSquare,
  Send,
  Lightbulb,
  TrendingUp,
  BarChart3
} from 'lucide-react'

interface AIStoryAssistantProps {
  onAddContent: (content: any) => void
  currentData?: any[]
  currentCharts?: any[]
}

export function AIStoryAssistant({ onAddContent, currentData = [], currentCharts = [] }: AIStoryAssistantProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'generate' | 'enhance'>('chat')
  const [chatMessages, setChatMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: inputMessage
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsGenerating(true)

    // Simulate AI response based on data context
    const aiResponse = await generateAIStoryResponse(inputMessage, currentData, currentCharts)
    
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: 'assistant' as const,
      content: aiResponse
    }

    setChatMessages(prev => [...prev, assistantMessage])
    setIsGenerating(false)
  }

  const generateAIStoryResponse = async (message: string, data: any[], charts: any[]): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const dataStats = {
      rowCount: data.length,
      columnCount: data.length > 0 ? Object.keys(data[0] || {}).length : 0,
      chartCount: charts.length
    }

    // Generate contextual responses based on message content
    if (message.toLowerCase().includes('story') || message.toLowerCase().includes('історія')) {
      return `📊 На основі ваших даних (${dataStats.rowCount} записів, ${dataStats.columnCount} полів, ${dataStats.chartCount} чартів), я можу допомогти створити захоплюючу історію! 

Ось кілька ідей для вашої Data Story:
• **Narrative Arc**: Почніть з проблеми, покажіть дані, розкрийте інсайти
• **Visual Flow**: Використайте ваші ${dataStats.chartCount} чартів для підтримки наративу
• **Key Insights**: Виділіть найважливіші тренди та закономірності
• **Call to Action**: Завершіть конкретними рекомендаціями

Хочете, щоб я згенерував конкретний контент для слайдів?`
    }

    if (message.toLowerCase().includes('текст') || message.toLowerCase().includes('text')) {
      return `✍️ Я можу згенерувати різні типи тексту для вашої історії:

**Доступні варіанти:**
• **Заголовки** - Привабливі назви для слайдів
• **Описи даних** - Пояснення ваших візуалізацій  
• **Інсайти** - Ключові висновки з даних
• **Переходи** - Зв'язки між слайдами
• **Висновки** - Підсумки та рекомендації

Скажіть, який тип тексту вам потрібен, і я створю його на основі ваших даних!`
    }

    if (message.toLowerCase().includes('фото') || message.toLowerCase().includes('зображення') || message.toLowerCase().includes('photo')) {
      return `📸 Для покращення вашої Data Story я можу допомогти з візуальним контентом:

**Рекомендації для зображень:**
• **Інфографіка** - Створіть схеми для пояснення процесів
• **Іконки** - Додайте візуальні елементи до слайдів
• **Фонові зображення** - Оберіть тематичні фони
• **Діаграми** - Спростіть складні концепції

Завантажте зображення або опишіть, що вам потрібно, і я допоможу інтегрувати це в історію!`
    }

    // Default response
    return `🤖 Я ваш AI асистент для створення Data Stories! Я можу допомогти з:

**📝 Контент:**
• Генерація тексту та заголовків
• Створення наративу на основі даних
• Формулювання інсайтів та висновків

**🎨 Візуальні елементи:**
• Підбір кольорових схем
• Рекомендації щодо макету
• Інтеграція зображень та графіки

**📊 Аналіз даних:**
• Виявлення трендів та патернів
• Створення ключових метрик
• Формування рекомендацій

Що саме вас цікавить? Просто опишіть, що потрібно!`
  }

  const handleGenerateContent = async (type: 'text' | 'image' | 'presentation') => {
    setIsGenerating(true)
    
    // Simulate content generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    let content
    switch (type) {
      case 'text':
        content = {
          type: 'text',
          title: 'AI-Generated Slide Title',
          content: `На основі аналізу ваших даних (${currentData.length} записів), ми виявили кілька ключових трендів:

• Основний тренд показує зростання на 23% порівняно з попереднім періодом
• Найвища активність спостерігається в категорії A (45% від загального обсягу)
• Сезонні коливання вказують на пікові періоди в Q2 та Q4

Ці дані свідчать про стабільне зростання та можливості для подальшого розвитку.`,
          insights: ['Зростання на 23%', 'Категорія A лідирує', 'Сезонні піки в Q2/Q4']
        }
        break
      case 'image':
        content = {
          type: 'image',
          title: 'AI-Generated Visual Concept',
          description: 'Інфографіка з ключовими метриками',
          suggestions: [
            'Кругова діаграма для розподілу категорій',
            'Лінійний графік для показу трендів',
            'Барна діаграма для порівняння періодів'
          ]
        }
        break
      case 'presentation':
        content = {
          type: 'presentation',
          title: 'AI Story Structure',
          slides: [
            { title: 'Вступ', content: 'Представлення проблеми та цілей аналізу' },
            { title: 'Дані', content: 'Огляд датасету та методології' },
            { title: 'Аналіз', content: 'Ключові знахідки та тренди' },
            { title: 'Інсайти', content: 'Важливі висновки та закономірності' },
            { title: 'Рекомендації', content: 'Практичні поради та наступні кроки' }
          ]
        }
        break
    }
    
    setGeneratedContent(content)
    setIsGenerating(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = {
          type: 'image',
          title: file.name,
          url: e.target?.result as string,
          size: file.size
        }
        onAddContent(content)
      }
      reader.readAsDataURL(file)
    }
  }

  const quickPrompts = [
    { icon: TrendingUp, text: 'Проаналізуй тренди в даних', prompt: 'Проаналізуй основні тренди в моїх даних та створи текст для слайду' },
    { icon: BarChart3, text: 'Створи заголовки для чартів', prompt: 'Створи привабливі заголовки для моїх візуалізацій' },
    { icon: Lightbulb, text: 'Згенеруй інсайти', prompt: 'Які ключові інсайти можна виділити з цих даних?' },
    { icon: Presentation, text: 'Структура презентації', prompt: 'Запропонуй структуру для презентації моїх даних' }
  ]

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Story Assistant
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Чат
          </Button>
          <Button
            variant={activeTab === 'generate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('generate')}
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Генерація
          </Button>
          <Button
            variant={activeTab === 'enhance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('enhance')}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Покращення
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col">
            {/* Quick Prompts */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Швидкі команди:</div>
              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(prompt.prompt)}
                    className="justify-start text-xs"
                  >
                    <prompt.icon className="h-3 w-3 mr-1" />
                    {prompt.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 border rounded-md bg-muted/20">
              {chatMessages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Привіт! Я допоможу створити захоплюючу Data Story.</p>
                  <p className="text-sm">Запитайте про генерацію тексту, додавання зображень або структуру презентації.</p>
                </div>
              )}
              
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-background border p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="text-sm">AI думає...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Опишіть, що потрібно для вашої історії..."
                className="flex-1 p-2 border border-border rounded-md bg-background text-foreground"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isGenerating}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Генеруйте контент на основі ваших даних за допомогою AI
            </div>

            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Текстовий контент</div>
                    <div className="text-sm text-muted-foreground">Заголовки, описи, інсайти</div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleGenerateContent('text')} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Згенерувати текст
                </Button>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Image className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Візуальні елементи</div>
                    <div className="text-sm text-muted-foreground">Концепції зображень, інфографіка</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleGenerateContent('image')} 
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Концепція
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Presentation className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-medium">Структура презентації</div>
                    <div className="text-sm text-muted-foreground">Логічна послідовність слайдів</div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleGenerateContent('presentation')} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Створити структуру
                </Button>
              </Card>
            </div>

            {/* Generated Content Display */}
            {generatedContent && (
              <Card className="mt-4 p-4 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">Згенерований контент</div>
                  <Button
                    size="sm"
                    onClick={() => onAddContent(generatedContent)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Додати
                  </Button>
                </div>
                <div className="text-sm">
                  {generatedContent.type === 'text' && (
                    <div>
                      <div className="font-medium mb-2">{generatedContent.title}</div>
                      <div className="whitespace-pre-wrap">{generatedContent.content}</div>
                    </div>
                  )}
                  {generatedContent.type === 'image' && (
                    <div>
                      <div className="font-medium mb-2">{generatedContent.title}</div>
                      <div className="text-muted-foreground mb-2">{generatedContent.description}</div>
                      <ul className="list-disc list-inside space-y-1">
                        {generatedContent.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {generatedContent.type === 'presentation' && (
                    <div>
                      <div className="font-medium mb-2">{generatedContent.title}</div>
                      <div className="space-y-2">
                        {generatedContent.slides.map((slide: any, index: number) => (
                          <div key={index} className="border-l-2 border-primary pl-3">
                            <div className="font-medium">{index + 1}. {slide.title}</div>
                            <div className="text-muted-foreground text-xs">{slide.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'enhance' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Покращте існуючий контент за допомогою AI
            </div>

            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Wand2 className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Покращення тексту</div>
                    <div className="text-sm text-muted-foreground">Зробити текст більш захоплюючим</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Покращити наратив
                </Button>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Palette className="h-5 w-5 text-pink-500" />
                  <div>
                    <div className="font-medium">Стилізація</div>
                    <div className="text-sm text-muted-foreground">Кольори, шрифти, макет</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Оптимізувати дизайн
                </Button>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <div>
                    <div className="font-medium">Аналітичні інсайти</div>
                    <div className="text-sm text-muted-foreground">Додаткові висновки з даних</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Знайти інсайти
                </Button>
              </Card>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
