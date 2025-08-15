# 🚀 Quick Vercel Setup

## 1. Подключение к Vercel

### Автоматическое подключение (рекомендуется)
1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите ваш репозиторий `Data-visualization-playground`
5. Vercel автоматически определит Next.js проект
6. Нажмите "Deploy"

### Ручное подключение через CLI
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

## 2. Получение Credentials для GitHub Actions

После подключения проекта к Vercel:

### VERCEL_TOKEN
```bash
vercel token
```

### VERCEL_ORG_ID и VERCEL_PROJECT_ID
```bash
vercel link
# Или найдите в файле .vercel/project.json
```

## 3. Настройка GitHub Secrets

1. Перейдите в ваш GitHub репозиторий
2. Settings → Secrets and variables → Actions
3. Добавьте следующие secrets:

```
VERCEL_TOKEN=your_token_from_vercel_token_command
VERCEL_ORG_ID=your_org_id_from_vercel_link
VERCEL_PROJECT_ID=your_project_id_from_vercel_link
```

## 4. Проверка деплоя

После настройки secrets:
1. Сделайте любой коммит и push в main branch
2. GitHub Actions автоматически запустит деплой
3. Проверьте статус в Actions tab
4. Приложение будет доступно по ссылке от Vercel

## 5. Custom Domain (опционально)

1. В Vercel Dashboard → Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel

## 6. Environment Variables

В Vercel Dashboard → Settings → Environment Variables добавьте:

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 7. Мониторинг

- **Vercel Dashboard**: Аналитика, логи, деплои
- **GitHub Actions**: Статус сборки и деплоя
- **Vercel Analytics**: Производительность (опционально)

---

**Готово! Ваше приложение теперь автоматически деплоится при каждом push в main branch! 🎉**
