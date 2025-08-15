# 🎉 DataViz AI Playground

**Потужний інструмент для створення інтерактивних візуалізацій та презентацій даних з AI-підтримкою**

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🚀 Основні Функції

### 📊 **Створення Чартів**
- **Автоматичне перенаправлення** на Dashboard після створення чарту
- **Покращена валідація** з українськими повідомленнями
- **Динамічний текст кнопки** показує що потрібно вибрати
- **Детальні інструкції** для користувача

### 🎯 **Dashboard & Навігація**
- **Eye icon** в Dashboard перенаправляє на сторінку редагування чарту
- **Збереження стану** чарту в localStorage для передачі між сторінками
- **Автоматичне завантаження** даних чарту для редагування

### 🎬 **Data Stories (Нова Функція!)**
- **StoryBuilder** - повноцінний редактор для створення презентацій
- **StoryPlayer** - професійний презентаційний режим
- **Повноекранний перегляд** з автоматичним приховуванням контролів
- **Автоматичне відтворення** з налаштованою тривалістю
- **Клавіатурні скорочення** для керування

## 🎨 Ключові Особливості

### **Покращений UX:**
- 🔄 **Плавна навігація** між сторінками
- 💡 **Інтуїтивні підказки** та інструкції
- 🎨 **Візуальна зворотній зв'язок** для всіх дій
- 🌐 **Українська локалізація** повідомлень

### **Data Stories - Нова Концепція:**
- 📊 **Комбінація чартів та тексту** в презентаціях
- ⏱️ **Контрольований таймінг** слайдів
- 🎭 **Професійний презентаційний режим**
- ⌨️ **Клавіатурні скорочення** для керування

## 🚀 Швидкий Старт

### Встановлення
```bash
# Клонування репозиторію
git clone https://github.com/IlliaDol/Data-visualization-playground.git
cd Data-visualization-playground

# Встановлення залежностей
npm install

# Запуск сервера розробки
npm run dev
```

### Використання
1. **Відкрийте** `http://localhost:3000`
2. **Завантажте дані** (CSV, Excel, JSON, XML, YAML, TOML, LOG, Parquet, NumPy)
3. **Створіть чарт** → автоматичне перенаправлення на Dashboard
4. **Натисніть Eye icon** → повернення до редактора чарту
5. **Перейдіть на** `http://localhost:3000/stories` для створення Data Stories

## 📁 Структура Проекту

```
components/
├── ChartBuilder.tsx      # Покращений редактор чартів
├── Dashboard.tsx         # Оновлений dashboard з навігацією
├── StoryBuilder.tsx      # Новий компонент для створення stories
├── StoryPlayer.tsx       # Компонент для перегляду stories
└── ChartRenderer.tsx     # Рендерер чартів

app/
├── page.tsx              # Головна сторінка з логікою редагування
├── dashboards/page.tsx   # Dashboard з чартами
├── stories/page.tsx      # Список stories
└── stories/play/[id]/    # Презентаційний режим
```

## 🎯 Підтримувані Формати

- **CSV/TSV** - табличні дані
- **Excel (.xlsx)** - складні таблиці
- **JSON** - структуровані дані
- **XML** - ієрархічні дані
- **YAML/TOML** - конфігураційні файли
- **LOG** - лог-файли
- **Parquet** - колонкові дані
- **NumPy (.npy)** - числові масиви

## 🎬 Data Stories - Як Використовувати

### Створення Story:
1. Перейдіть на `/stories`
2. Натисніть "Створити Story"
3. Додайте слайди з чартами та текстом
4. Налаштуйте тривалість кожного слайду

### Презентаційний режим:
- **Клавіатурні скорочення:**
  - `→` або `Space` - наступний слайд
  - `←` - попередній слайд
  - `Escape` - закрити
  - `F` - повноекранний режим
  - `M` - мовчання

## 🔧 Технічні Деталі

### Технології:
- **Next.js 14** - React фреймворк
- **TypeScript** - типізація
- **Tailwind CSS** - стилізація
- **Vega-Lite** - візуалізація даних
- **Shadcn/ui** - UI компоненти

### Покращення:
- 🔧 **Покращена обробка помилок**
- 💾 **Ефективне збереження стану** в localStorage
- ⚡ **Оптимізована продуктивність**
- 🛡️ **Надійна валідація даних**

## 📚 Документація

- [IMPROVEMENTS.md](IMPROVEMENTS.md) - Детальний опис покращень
- [FINAL_SUMMARY.md](FINAL_SUMMARY.md) - Фінальний підсумок
- [FORMATS.md](FORMATS.md) - Підтримувані формати файлів
- [QUICKSTART.md](QUICKSTART.md) - Швидкий старт

## 🚀 Розгортання

### Vercel (Рекомендовано)
```bash
npm run build
# Деплой через Vercel CLI або GitHub integration
```

### GitHub Pages
```bash
npm run build
npm run export
# Деплой в папку /docs
```

## 🤝 Внесок

1. Fork проект
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

Цей проект ліцензований під MIT License - дивіться файл [LICENSE](LICENSE) для деталей.

## 🙏 Подяки

- [Next.js](https://nextjs.org/) за чудовий фреймворк
- [Tailwind CSS](https://tailwindcss.com/) за стилізацію
- [Vega-Lite](https://vega.github.io/vega-lite/) за візуалізацію
- [Shadcn/ui](https://ui.shadcn.com/) за UI компоненти

---

**🎉 DataViz AI Playground** - Потужний інструмент для створення інтерактивних візуалізацій та презентацій даних!

⭐ **Якщо вам сподобався проект, поставте зірку на GitHub!**
