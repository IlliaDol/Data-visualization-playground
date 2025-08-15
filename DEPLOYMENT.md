# 🚀 Deployment Guide

## GitHub Actions Setup

### 1. Repository Secrets

Для работы GitHub Actions необходимо настроить следующие secrets в настройках репозитория:

#### Vercel Secrets (для деплоя)
1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте следующие secrets:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Как получить Vercel credentials:

1. **VERCEL_TOKEN**:
   - Установите Vercel CLI: `npm i -g vercel`
   - Выполните: `vercel login`
   - Создайте токен: `vercel token`

2. **VERCEL_ORG_ID** и **VERCEL_PROJECT_ID**:
   - Выполните: `vercel link`
   - Или найдите в файле `.vercel/project.json`

### 2. Workflows

Проект включает 3 GitHub Actions workflows:

#### `deploy.yml`
- Автоматический деплой на Vercel при push в main/develop
- Запускается при pull requests
- Включает линтинг, type checking и сборку

#### `test.yml`
- Тестирование на разных версиях Node.js
- Проверка сборки и линтинга
- Матричное тестирование

#### `release.yml`
- Автоматическое создание релизов при push тегов
- Генерирует changelog и release notes

### 3. Автоматический деплой

После настройки secrets:

1. **Push в main branch** → автоматический деплой на production
2. **Push в develop branch** → деплой на preview
3. **Pull Request** → деплой на preview с проверками

## Vercel Setup

### 1. Подключение к Vercel

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Подключение проекта
vercel link

# Первый деплой
vercel --prod
```

### 2. Environment Variables

В Vercel Dashboard добавьте переменные окружения:

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. Custom Domain (опционально)

1. В Vercel Dashboard перейдите в Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи

## Docker Deployment

### 1. Build Image

```bash
docker build -t data-viz-ai-playground .
```

### 2. Run Container

```bash
docker run -p 3000:3000 data-viz-ai-playground
```

### 3. Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

## Manual Deployment

### 1. Build

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

### 3. PM2 (для production)

```bash
npm install -g pm2
pm2 start npm --name "data-viz-ai" -- start
pm2 save
pm2 startup
```

## Monitoring & Analytics

### 1. Vercel Analytics

Добавьте в `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Error Monitoring

Добавьте Sentry или другой сервис мониторинга ошибок.

## Performance Optimization

### 1. Bundle Analysis

```bash
npm run build
npx @next/bundle-analyzer
```

### 2. Image Optimization

Используйте Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### 3. Code Splitting

Next.js автоматически разделяет код по страницам и компонентам.

## Security

### 1. Environment Variables

Никогда не коммитьте секреты в репозиторий:

```bash
# .env.local (не коммитится)
VERCEL_TOKEN=secret_token
DATABASE_URL=secret_url

# .env.example (коммитится)
VERCEL_TOKEN=your_token_here
DATABASE_URL=your_database_url_here
```

### 2. Security Headers

Настроены в `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### 3. CORS

Настройте CORS для API routes если необходимо.

## Troubleshooting

### Common Issues

1. **Build fails**:
   - Проверьте логи в GitHub Actions
   - Убедитесь что все зависимости установлены
   - Проверьте TypeScript ошибки

2. **Deploy fails**:
   - Проверьте Vercel credentials
   - Убедитесь что проект подключен к Vercel
   - Проверьте environment variables

3. **Runtime errors**:
   - Проверьте логи в Vercel Dashboard
   - Убедитесь что все API endpoints работают
   - Проверьте client-side ошибки в browser console

### Debug Commands

```bash
# Локальная сборка
npm run build

# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Тестирование
npm test

# Анализ бандла
npm run analyze
```

## Support

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/data-viz-ai-playground/issues)
- **Vercel Support**: [Vercel Documentation](https://vercel.com/docs)
- **Next.js Support**: [Next.js Documentation](https://nextjs.org/docs)

---

**Happy Deploying! 🚀**
