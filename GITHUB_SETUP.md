# 🚀 GitHub Actions Setup Guide

## 📋 Налаштування автоматичного деплою

### 1. GitHub Secrets

Для автоматичного деплою на Vercel потрібно додати наступні secrets в ваш GitHub репозиторій:

#### Як додати secrets:
1. Перейдіть в ваш GitHub репозиторій
2. Натисніть **Settings** → **Secrets and variables** → **Actions**
3. Натисніть **New repository secret**
4. Додайте наступні secrets:

#### Необхідні secrets:

| Secret Name | Опис | Як отримати |
|-------------|------|-------------|
| `VERCEL_TOKEN` | Vercel API токен | [Інструкція](#vercel-token) |
| `VERCEL_ORG_ID` | ID вашої Vercel організації | [Інструкція](#vercel-org-id) |
| `VERCEL_PROJECT_ID` | ID вашого Vercel проекту | [Інструкція](#vercel-project-id) |

### 2. Отримання Vercel credentials

#### VERCEL_TOKEN
1. Перейдіть на [Vercel Dashboard](https://vercel.com/dashboard)
2. Натисніть **Settings** → **Tokens**
3. Натисніть **Create Token**
4. Введіть назву (наприклад: "GitHub Actions")
5. Скопіюйте токен та додайте як `VERCEL_TOKEN`

#### VERCEL_ORG_ID
1. В Vercel Dashboard перейдіть в **Settings** → **General**
2. Знайдіть **Team ID** або **Personal Account ID**
3. Скопіюйте ID та додайте як `VERCEL_ORG_ID`

#### VERCEL_PROJECT_ID
1. В Vercel Dashboard відкрийте ваш проект
2. Перейдіть в **Settings** → **General**
3. Знайдіть **Project ID**
4. Скопіюйте ID та додайте як `VERCEL_PROJECT_ID`

### 3. GitHub Actions Workflows

У вас є два workflows:

#### `deploy.yml` - Основний деплой
- Запускається при push в `main` або `develop`
- Тестує код та деплоїть на Vercel
- Потребує налаштованих secrets

#### `test-formats.yml` - Тестування форматів
- Тестує підтримку всіх 20+ форматів файлів
- Створює звіт про тестування
- Запускається автоматично або вручну

### 4. Ручний запуск

Щоб запустити workflow вручну:

1. Перейдіть в **Actions** в вашому репозиторії
2. Виберіть workflow (наприклад, "Test File Format Support")
3. Натисніть **Run workflow**
4. Виберіть гілку та натисніть **Run workflow**

### 5. Перевірка статусу

Після push коду:

1. Перейдіть в **Actions** в GitHub
2. Побачите запущений workflow
3. Натисніть на workflow для деталей
4. Зелений чек = успіх, червоний хрестик = помилка

### 6. Troubleshooting

#### Помилка "Vercel credentials not configured"
- Перевірте, чи додані всі три secrets
- Перевірте правильність значень
- Перезапустіть workflow

#### Помилка "Build failed"
- Перевірте логи в GitHub Actions
- Переконайтеся, що всі залежності встановлені
- Перевірте TypeScript помилки

#### Помилка "Format support test failed"
- Перевірте файл `test-formats.js`
- Переконайтеся, що всі тестові файли існують
- Перевірте підтримку форматів в `lib/utils.ts`

### 7. Автоматичний деплой

Після налаштування:

1. **Push в `main`** → автоматичний деплой на production
2. **Push в `develop`** → тестування без деплою
3. **Pull Request** → тестування коду

### 8. Перевірка деплою

Після успішного деплою:

1. Перейдіть в [Vercel Dashboard](https://vercel.com/dashboard)
2. Знайдіть ваш проект
3. Перевірте останній деплой
4. Відкрийте live URL для тестування

### 9. Моніторинг

GitHub Actions надає:

- 📊 Статистику виконання
- 📝 Логи кожного кроку
- ⚡ Швидкість виконання
- 🔄 Історію деплоїв

### 10. Безпека

- Secrets зашифровані
- Доступ тільки для власників репозиторію
- Автоматичне очищення логів
- Безпечні токени Vercel

---

**🎉 Після налаштування ваш проект буде автоматично деплоїтися при кожному push!**
