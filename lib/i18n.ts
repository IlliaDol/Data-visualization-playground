import React from 'react'

export type Language = 'en' | 'uk' | 'de' | 'ru'

export interface Translation {
  // Navigation
  navigation: {
    playground: string
    dashboards: string
    stories: string
    settings: string
  }
  
  // Common
  common: {
    loading: string
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    export: string
    import: string
    share: string
    download: string
    upload: string
    search: string
    filter: string
    sort: string
    view: string
    hide: string
    show: string
    close: string
    back: string
    next: string
    previous: string
    submit: string
    reset: string
    confirm: string
    yes: string
    no: string
    ok: string
    error: string
    success: string
    warning: string
    info: string
  }
  
  // File Upload
  fileUpload: {
    title: string
    subtitle: string
    dragDrop: string
    or: string
    browse: string
    supportedFormats: string
    maxSize: string
    processing: string
    error: string
    success: string
  }
  
  // Chart Builder
  chartBuilder: {
    title: string
    chartType: string
    dataFields: string
    xAxis: string
    yAxis: string
    color: string
    size: string
    preview: string
    createChart: string
    exportCode: string
    exportImage: string
    aiAnalysis: string
    aiPrompt: string
    aiSuggestions: string
  }
  
  // Dashboard
  dashboard: {
    title: string
    createDashboard: string
    editDashboard: string
    deleteDashboard: string
    shareDashboard: string
    exportDashboard: string
    noCharts: string
    addChart: string
  }
  
  // Stories
  stories: {
    title: string
    createStory: string
    editStory: string
    deleteStory: string
    shareStory: string
    exportStory: string
    noStories: string
    addStory: string
    slides: string
    views: string
  }
  
  // Settings
  settings: {
    title: string
    general: string
    theme: string
    language: string
    autoSave: string
    notifications: string
    apiKeys: string
    dataManagement: string
    exportData: string
    clearData: string
  }
  
  // AI Assistant
  aiAssistant: {
    title: string
    placeholder: string
    send: string
    thinking: string
    suggestions: string
    quickActions: string
    analysis: string
    recommendations: string
  }
  
  // Chart Types
  chartTypes: {
    bar: string
    line: string
    scatter: string
    pie: string
    area: string
    histogram: string
    box: string
    heatmap: string
    treemap: string
    sankey: string
    gauge: string
    radar: string
    bubble: string
    waterfall: string
    funnel: string
  }
  
  // Data Analysis
  dataAnalysis: {
    title: string
    correlation: string
    trends: string
    outliers: string
    distribution: string
    summary: string
    statistics: string
    insights: string
  }
  
  // Export
  export: {
    title: string
    python: string
    r: string
    javascript: string
    png: string
    svg: string
    pdf: string
    csv: string
    json: string
  }
  
  // Messages
  messages: {
    chartCreated: string
    chartUpdated: string
    chartDeleted: string
    dataUploaded: string
    analysisComplete: string
    exportComplete: string
    saveComplete: string
    errorOccurred: string
    noDataSelected: string
    invalidData: string
  }
}

const translations: Record<Language, Translation> = {
  en: {
    navigation: {
      playground: 'Playground',
      dashboards: 'Dashboards',
      stories: 'Stories',
      settings: 'Settings'
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      export: 'Export',
      import: 'Import',
      share: 'Share',
      download: 'Download',
      upload: 'Upload',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      view: 'View',
      hide: 'Hide',
      show: 'Show',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info'
    },
    fileUpload: {
      title: 'Upload Your Data',
      subtitle: 'Drag and drop your files here or click to browse',
      dragDrop: 'Drag and drop files here',
      or: 'or',
      browse: 'Browse Files',
      supportedFormats: 'Supported formats: CSV/TSV, Excel (.xlsx/.xls/.xlsm), JSON/XML, YAML/TOML, LOG, Parquet, NumPy (.npz/.npy), compressed (.gz/.zip), and more',
      maxSize: 'Max file size: 200MB',
      processing: 'Processing your data...',
      error: 'Error uploading file',
      success: 'File uploaded successfully'
    },
    chartBuilder: {
      title: 'Chart Builder',
      chartType: 'Chart Type',
      dataFields: 'Data Fields',
      xAxis: 'X Axis',
      yAxis: 'Y Axis',
      color: 'Color',
      size: 'Size',
      preview: 'Preview',
      createChart: 'Create Chart',
      exportCode: 'Export Code',
      exportImage: 'Export Image',
      aiAnalysis: 'AI Analysis',
      aiPrompt: 'What would you like to analyze?',
      aiSuggestions: 'AI Suggestions'
    },
    dashboard: {
      title: 'Dashboards',
      createDashboard: 'Create Dashboard',
      editDashboard: 'Edit Dashboard',
      deleteDashboard: 'Delete Dashboard',
      shareDashboard: 'Share Dashboard',
      exportDashboard: 'Export Dashboard',
      noCharts: 'No charts yet',
      addChart: 'Add Chart'
    },
    stories: {
      title: 'Data Stories',
      createStory: 'Create Story',
      editStory: 'Edit Story',
      deleteStory: 'Delete Story',
      shareStory: 'Share Story',
      exportStory: 'Export Story',
      noStories: 'No stories yet',
      addStory: 'Add Story',
      slides: 'Slides',
      views: 'Views'
    },
    settings: {
      title: 'Settings',
      general: 'General',
      theme: 'Theme',
      language: 'Language',
      autoSave: 'Auto Save',
      notifications: 'Notifications',
      apiKeys: 'API Keys',
      dataManagement: 'Data Management',
      exportData: 'Export Data',
      clearData: 'Clear Data'
    },
    aiAssistant: {
      title: 'AI Assistant',
      placeholder: 'Ask me anything about your data...',
      send: 'Send',
      thinking: 'Thinking...',
      suggestions: 'Suggestions',
      quickActions: 'Quick Actions',
      analysis: 'Analysis',
      recommendations: 'Recommendations'
    },
    chartTypes: {
      bar: 'Bar Chart',
      line: 'Line Chart',
      scatter: 'Scatter Plot',
      pie: 'Pie Chart',
      area: 'Area Chart',
      histogram: 'Histogram',
      box: 'Box Plot',
      heatmap: 'Heat Map',
      treemap: 'Tree Map',
      sankey: 'Sankey Diagram',
      gauge: 'Gauge Chart',
      radar: 'Radar Chart',
      bubble: 'Bubble Chart',
      waterfall: 'Waterfall Chart',
      funnel: 'Funnel Chart'
    },
    dataAnalysis: {
      title: 'Data Analysis',
      correlation: 'Correlation',
      trends: 'Trends',
      outliers: 'Outliers',
      distribution: 'Distribution',
      summary: 'Summary',
      statistics: 'Statistics',
      insights: 'Insights'
    },
    export: {
      title: 'Export',
      python: 'Python',
      r: 'R',
      javascript: 'JavaScript',
      png: 'PNG',
      svg: 'SVG',
      pdf: 'PDF',
      csv: 'CSV',
      json: 'JSON'
    },
    messages: {
      chartCreated: 'Chart created successfully',
      chartUpdated: 'Chart updated successfully',
      chartDeleted: 'Chart deleted successfully',
      dataUploaded: 'Data uploaded successfully',
      analysisComplete: 'Analysis complete',
      exportComplete: 'Export complete',
      saveComplete: 'Save complete',
      errorOccurred: 'An error occurred',
      noDataSelected: 'No data selected',
      invalidData: 'Invalid data format'
    }
  },
  uk: {
    navigation: {
      playground: 'Майданчик',
      dashboards: 'Панелі',
      stories: 'Історії',
      settings: 'Налаштування'
    },
    common: {
      loading: 'Завантаження...',
      save: 'Зберегти',
      cancel: 'Скасувати',
      delete: 'Видалити',
      edit: 'Редагувати',
      create: 'Створити',
      export: 'Експорт',
      import: 'Імпорт',
      share: 'Поділитися',
      download: 'Завантажити',
      upload: 'Завантажити',
      search: 'Пошук',
      filter: 'Фільтр',
      sort: 'Сортування',
      view: 'Перегляд',
      hide: 'Сховати',
      show: 'Показати',
      close: 'Закрити',
      back: 'Назад',
      next: 'Далі',
      previous: 'Попередній',
      submit: 'Відправити',
      reset: 'Скинути',
      confirm: 'Підтвердити',
      yes: 'Так',
      no: 'Ні',
      ok: 'OK',
      error: 'Помилка',
      success: 'Успіх',
      warning: 'Попередження',
      info: 'Інформація'
    },
    fileUpload: {
      title: 'Завантажте Ваші Дані',
      subtitle: 'Перетягніть файли сюди або натисніть для вибору',
      dragDrop: 'Перетягніть файли сюди',
      or: 'або',
      browse: 'Вибрати Файли',
      supportedFormats: 'Підтримувані формати: CSV, Excel, JSON, TSV, Parquet',
      maxSize: 'Максимальний розмір: 200MB',
      processing: 'Обробка ваших даних...',
      error: 'Помилка завантаження файлу',
      success: 'Файл успішно завантажено'
    },
    chartBuilder: {
      title: 'Конструктор Графіків',
      chartType: 'Тип Графіка',
      dataFields: 'Поля Даних',
      xAxis: 'Вісь X',
      yAxis: 'Вісь Y',
      color: 'Колір',
      size: 'Розмір',
      preview: 'Попередній Перегляд',
      createChart: 'Створити Графік',
      exportCode: 'Експорт Коду',
      exportImage: 'Експорт Зображення',
      aiAnalysis: 'AI Аналіз',
      aiPrompt: 'Що ви хочете проаналізувати?',
      aiSuggestions: 'AI Пропозиції'
    },
    dashboard: {
      title: 'Панелі',
      createDashboard: 'Створити Панель',
      editDashboard: 'Редагувати Панель',
      deleteDashboard: 'Видалити Панель',
      shareDashboard: 'Поділитися Панеллю',
      exportDashboard: 'Експорт Панелі',
      noCharts: 'Поки немає графіків',
      addChart: 'Додати Графік'
    },
    stories: {
      title: 'Історії Даних',
      createStory: 'Створити Історію',
      editStory: 'Редагувати Історію',
      deleteStory: 'Видалити Історію',
      shareStory: 'Поділитися Історією',
      exportStory: 'Експорт Історії',
      noStories: 'Поки немає історій',
      addStory: 'Додати Історію',
      slides: 'Слайди',
      views: 'Перегляди'
    },
    settings: {
      title: 'Налаштування',
      general: 'Загальні',
      theme: 'Тема',
      language: 'Мова',
      autoSave: 'Автозбереження',
      notifications: 'Сповіщення',
      apiKeys: 'API Ключі',
      dataManagement: 'Управління Даними',
      exportData: 'Експорт Даних',
      clearData: 'Очистити Дані'
    },
    aiAssistant: {
      title: 'AI Асистент',
      placeholder: 'Запитайте мене про ваші дані...',
      send: 'Надіслати',
      thinking: 'Думаю...',
      suggestions: 'Пропозиції',
      quickActions: 'Швидкі Дії',
      analysis: 'Аналіз',
      recommendations: 'Рекомендації'
    },
    chartTypes: {
      bar: 'Стовпчикова Діаграма',
      line: 'Лінійний Графік',
      scatter: 'Діаграма Розсіювання',
      pie: 'Кругова Діаграма',
      area: 'Площадна Діаграма',
      histogram: 'Гістограма',
      box: 'Діаграма Коробки',
      heatmap: 'Теплова Карта',
      treemap: 'Деревна Карта',
      sankey: 'Діаграма Санкі',
      gauge: 'Манометр',
      radar: 'Радарна Діаграма',
      bubble: 'Бульбашкова Діаграма',
      waterfall: 'Водоспадна Діаграма',
      funnel: 'Воронкова Діаграма'
    },
    dataAnalysis: {
      title: 'Аналіз Даних',
      correlation: 'Кореляція',
      trends: 'Тренди',
      outliers: 'Викиди',
      distribution: 'Розподіл',
      summary: 'Підсумок',
      statistics: 'Статистика',
      insights: 'Інсайти'
    },
    export: {
      title: 'Експорт',
      python: 'Python',
      r: 'R',
      javascript: 'JavaScript',
      png: 'PNG',
      svg: 'SVG',
      pdf: 'PDF',
      csv: 'CSV',
      json: 'JSON'
    },
    messages: {
      chartCreated: 'Графік успішно створено',
      chartUpdated: 'Графік успішно оновлено',
      chartDeleted: 'Графік успішно видалено',
      dataUploaded: 'Дані успішно завантажено',
      analysisComplete: 'Аналіз завершено',
      exportComplete: 'Експорт завершено',
      saveComplete: 'Збереження завершено',
      errorOccurred: 'Сталася помилка',
      noDataSelected: 'Дані не вибрані',
      invalidData: 'Невірний формат даних'
    }
  },
  de: {
    navigation: {
      playground: 'Spielplatz',
      dashboards: 'Dashboards',
      stories: 'Geschichten',
      settings: 'Einstellungen'
    },
    common: {
      loading: 'Laden...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      export: 'Exportieren',
      import: 'Importieren',
      share: 'Teilen',
      download: 'Herunterladen',
      upload: 'Hochladen',
      search: 'Suchen',
      filter: 'Filter',
      sort: 'Sortieren',
      view: 'Anzeigen',
      hide: 'Verstecken',
      show: 'Zeigen',
      close: 'Schließen',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      submit: 'Absenden',
      reset: 'Zurücksetzen',
      confirm: 'Bestätigen',
      yes: 'Ja',
      no: 'Nein',
      ok: 'OK',
      error: 'Fehler',
      success: 'Erfolg',
      warning: 'Warnung',
      info: 'Info'
    },
    fileUpload: {
      title: 'Daten Hochladen',
      subtitle: 'Dateien hierher ziehen oder klicken zum Durchsuchen',
      dragDrop: 'Dateien hierher ziehen',
      or: 'oder',
      browse: 'Dateien Durchsuchen',
      supportedFormats: 'Unterstützte Formate: CSV, Excel, JSON, TSV, Parquet',
      maxSize: 'Max. Dateigröße: 200MB',
      processing: 'Daten werden verarbeitet...',
      error: 'Fehler beim Hochladen',
      success: 'Datei erfolgreich hochgeladen'
    },
    chartBuilder: {
      title: 'Diagramm-Ersteller',
      chartType: 'Diagramm-Typ',
      dataFields: 'Datenfelder',
      xAxis: 'X-Achse',
      yAxis: 'Y-Achse',
      color: 'Farbe',
      size: 'Größe',
      preview: 'Vorschau',
      createChart: 'Diagramm Erstellen',
      exportCode: 'Code Exportieren',
      exportImage: 'Bild Exportieren',
      aiAnalysis: 'KI-Analyse',
      aiPrompt: 'Was möchten Sie analysieren?',
      aiSuggestions: 'KI-Vorschläge'
    },
    dashboard: {
      title: 'Dashboards',
      createDashboard: 'Dashboard Erstellen',
      editDashboard: 'Dashboard Bearbeiten',
      deleteDashboard: 'Dashboard Löschen',
      shareDashboard: 'Dashboard Teilen',
      exportDashboard: 'Dashboard Exportieren',
      noCharts: 'Noch keine Diagramme',
      addChart: 'Diagramm Hinzufügen'
    },
    stories: {
      title: 'Daten-Geschichten',
      createStory: 'Geschichte Erstellen',
      editStory: 'Geschichte Bearbeiten',
      deleteStory: 'Geschichte Löschen',
      shareStory: 'Geschichte Teilen',
      exportStory: 'Geschichte Exportieren',
      noStories: 'Noch keine Geschichten',
      addStory: 'Geschichte Hinzufügen',
      slides: 'Folien',
      views: 'Ansichten'
    },
    settings: {
      title: 'Einstellungen',
      general: 'Allgemein',
      theme: 'Design',
      language: 'Sprache',
      autoSave: 'Auto-Speichern',
      notifications: 'Benachrichtigungen',
      apiKeys: 'API-Schlüssel',
      dataManagement: 'Datenverwaltung',
      exportData: 'Daten Exportieren',
      clearData: 'Daten Löschen'
    },
    aiAssistant: {
      title: 'KI-Assistent',
      placeholder: 'Fragen Sie mich zu Ihren Daten...',
      send: 'Senden',
      thinking: 'Denke...',
      suggestions: 'Vorschläge',
      quickActions: 'Schnellaktionen',
      analysis: 'Analyse',
      recommendations: 'Empfehlungen'
    },
    chartTypes: {
      bar: 'Balkendiagramm',
      line: 'Liniendiagramm',
      scatter: 'Streudiagramm',
      pie: 'Kreisdiagramm',
      area: 'Flächendiagramm',
      histogram: 'Histogramm',
      box: 'Boxplot',
      heatmap: 'Heatmap',
      treemap: 'Treemap',
      sankey: 'Sankey-Diagramm',
      gauge: 'Messgerät',
      radar: 'Radardiagramm',
      bubble: 'Blasendiagramm',
      waterfall: 'Wasserfalldiagramm',
      funnel: 'Trichterdiagramm'
    },
    dataAnalysis: {
      title: 'Datenanalyse',
      correlation: 'Korrelation',
      trends: 'Trends',
      outliers: 'Ausreißer',
      distribution: 'Verteilung',
      summary: 'Zusammenfassung',
      statistics: 'Statistik',
      insights: 'Erkenntnisse'
    },
    export: {
      title: 'Export',
      python: 'Python',
      r: 'R',
      javascript: 'JavaScript',
      png: 'PNG',
      svg: 'SVG',
      pdf: 'PDF',
      csv: 'CSV',
      json: 'JSON'
    },
    messages: {
      chartCreated: 'Diagramm erfolgreich erstellt',
      chartUpdated: 'Diagramm erfolgreich aktualisiert',
      chartDeleted: 'Diagramm erfolgreich gelöscht',
      dataUploaded: 'Daten erfolgreich hochgeladen',
      analysisComplete: 'Analyse abgeschlossen',
      exportComplete: 'Export abgeschlossen',
      saveComplete: 'Speichern abgeschlossen',
      errorOccurred: 'Ein Fehler ist aufgetreten',
      noDataSelected: 'Keine Daten ausgewählt',
      invalidData: 'Ungültiges Datenformat'
    }
  },
  ru: {
    navigation: {
      playground: 'Площадка',
      dashboards: 'Панели',
      stories: 'Истории',
      settings: 'Настройки'
    },
    common: {
      loading: 'Загрузка...',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      create: 'Создать',
      export: 'Экспорт',
      import: 'Импорт',
      share: 'Поделиться',
      download: 'Скачать',
      upload: 'Загрузить',
      search: 'Поиск',
      filter: 'Фильтр',
      sort: 'Сортировка',
      view: 'Просмотр',
      hide: 'Скрыть',
      show: 'Показать',
      close: 'Закрыть',
      back: 'Назад',
      next: 'Далее',
      previous: 'Предыдущий',
      submit: 'Отправить',
      reset: 'Сбросить',
      confirm: 'Подтвердить',
      yes: 'Да',
      no: 'Нет',
      ok: 'OK',
      error: 'Ошибка',
      success: 'Успех',
      warning: 'Предупреждение',
      info: 'Информация'
    },
    fileUpload: {
      title: 'Загрузите Ваши Данные',
      subtitle: 'Перетащите файлы сюда или нажмите для выбора',
      dragDrop: 'Перетащите файлы сюда',
      or: 'или',
      browse: 'Выбрать Файлы',
      supportedFormats: 'Поддерживаемые форматы: CSV, Excel, JSON, TSV, Parquet',
      maxSize: 'Максимальный размер: 200MB',
      processing: 'Обработка ваших данных...',
      error: 'Ошибка загрузки файла',
      success: 'Файл успешно загружен'
    },
    chartBuilder: {
      title: 'Конструктор Графиков',
      chartType: 'Тип Графика',
      dataFields: 'Поля Данных',
      xAxis: 'Ось X',
      yAxis: 'Ось Y',
      color: 'Цвет',
      size: 'Размер',
      preview: 'Предварительный Просмотр',
      createChart: 'Создать График',
      exportCode: 'Экспорт Кода',
      exportImage: 'Экспорт Изображения',
      aiAnalysis: 'AI Анализ',
      aiPrompt: 'Что вы хотите проанализировать?',
      aiSuggestions: 'AI Предложения'
    },
    dashboard: {
      title: 'Панели',
      createDashboard: 'Создать Панель',
      editDashboard: 'Редактировать Панель',
      deleteDashboard: 'Удалить Панель',
      shareDashboard: 'Поделиться Панелью',
      exportDashboard: 'Экспорт Панели',
      noCharts: 'Пока нет графиков',
      addChart: 'Добавить График'
    },
    stories: {
      title: 'Истории Данных',
      createStory: 'Создать Историю',
      editStory: 'Редактировать Историю',
      deleteStory: 'Удалить Историю',
      shareStory: 'Поделиться Историей',
      exportStory: 'Экспорт Истории',
      noStories: 'Пока нет историй',
      addStory: 'Добавить Историю',
      slides: 'Слайды',
      views: 'Просмотры'
    },
    settings: {
      title: 'Настройки',
      general: 'Общие',
      theme: 'Тема',
      language: 'Язык',
      autoSave: 'Автосохранение',
      notifications: 'Уведомления',
      apiKeys: 'API Ключи',
      dataManagement: 'Управление Данными',
      exportData: 'Экспорт Данных',
      clearData: 'Очистить Данные'
    },
    aiAssistant: {
      title: 'AI Ассистент',
      placeholder: 'Спросите меня о ваших данных...',
      send: 'Отправить',
      thinking: 'Думаю...',
      suggestions: 'Предложения',
      quickActions: 'Быстрые Действия',
      analysis: 'Анализ',
      recommendations: 'Рекомендации'
    },
    chartTypes: {
      bar: 'Столбчатая Диаграмма',
      line: 'Линейный График',
      scatter: 'Диаграмма Рассеяния',
      pie: 'Круговая Диаграмма',
      area: 'Площадная Диаграмма',
      histogram: 'Гистограмма',
      box: 'Диаграмма Ящика',
      heatmap: 'Тепловая Карта',
      treemap: 'Древовидная Карта',
      sankey: 'Диаграмма Санки',
      gauge: 'Манометр',
      radar: 'Радарная Диаграмма',
      bubble: 'Пузырьковая Диаграмма',
      waterfall: 'Водопадная Диаграмма',
      funnel: 'Воронковая Диаграмма'
    },
    dataAnalysis: {
      title: 'Анализ Данных',
      correlation: 'Корреляция',
      trends: 'Тренды',
      outliers: 'Выбросы',
      distribution: 'Распределение',
      summary: 'Сводка',
      statistics: 'Статистика',
      insights: 'Инсайты'
    },
    export: {
      title: 'Экспорт',
      python: 'Python',
      r: 'R',
      javascript: 'JavaScript',
      png: 'PNG',
      svg: 'SVG',
      pdf: 'PDF',
      csv: 'CSV',
      json: 'JSON'
    },
    messages: {
      chartCreated: 'График успешно создан',
      chartUpdated: 'График успешно обновлен',
      chartDeleted: 'График успешно удален',
      dataUploaded: 'Данные успешно загружены',
      analysisComplete: 'Анализ завершен',
      exportComplete: 'Экспорт завершен',
      saveComplete: 'Сохранение завершено',
      errorOccurred: 'Произошла ошибка',
      noDataSelected: 'Данные не выбраны',
      invalidData: 'Неверный формат данных'
    }
  }
}

class I18nService {
  private currentLanguage: Language = 'en'
  private listeners: Array<(lang: Language) => void> = []

  constructor() {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language
      if (savedLang && translations[savedLang]) {
        this.currentLanguage = savedLang
      }
    }
  }

  getLanguage(): Language {
    return this.currentLanguage
  }

  setLanguage(language: Language): void {
    if (translations[language]) {
      this.currentLanguage = language
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language)
      }
      this.listeners.forEach(listener => listener(language))
    }
  }

  t(key: string): string {
    const keys = key.split('.')
    let value: any = translations[this.currentLanguage]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  subscribe(listener: (lang: Language) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  getSupportedLanguages(): Language[] {
    return Object.keys(translations) as Language[]
  }

  getLanguageInfo(language: Language) {
    const languageNames = {
      en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
      uk: { name: 'Українська', nativeName: 'Українська', flag: '🇺🇦' },
      de: { name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' },
      ru: { name: 'Русский', nativeName: 'Русский', flag: '🇷🇺' }
    }
    return languageNames[language]
  }
}

export const i18n = new I18nService()

// React Hook for translations
export function useTranslation() {
  const [language, setLanguage] = React.useState(i18n.getLanguage())

  React.useEffect(() => {
    return i18n.subscribe(setLanguage)
  }, [])

  return {
    t: i18n.t.bind(i18n),
    language,
    setLanguage: i18n.setLanguage.bind(i18n),
    supportedLanguages: i18n.getSupportedLanguages(),
    getLanguageInfo: i18n.getLanguageInfo.bind(i18n)
  }
}
