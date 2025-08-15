# 🚀 GitHub Actions Setup Guide

Цей документ містить інструкції для налаштування GitHub Actions та автоматичного деплою вашого проекту.

## 📋 Покрокова інструкція

### 1. Налаштування GitHub Secrets

Перейдіть до вашого GitHub репозиторію → Settings → Secrets and variables → Actions

#### Для Vercel деплою:
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Для Netlify деплою (опціонально):
```bash
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id
```

### 2. Отримання Vercel токенів

1. Увійдіть в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдіть до Settings → Tokens
3. Створіть новий токен з назвою "GitHub Actions"
4. Скопіюйте токен

### 3. Отримання Vercel Project ID та Org ID

```bash
# Встановіть Vercel CLI
npm i -g vercel

# Увійдіть в Vercel
vercel login

# Отримайте інформацію про проект
vercel projects ls
```

### 4. Налаштування гілок

Створіть гілку `develop` для staging деплою:

```bash
git checkout -b develop
git push -u origin develop
```

## 🔄 Workflows

### Автоматичний деплой

- **Production**: Автоматично деплоїться при push в `main`
- **Staging**: Автоматично деплоїться при push в `develop`
- **Manual**: Можна запустити вручну через Actions tab

### Pull Request Checks

При створенні PR автоматично запускаються:
- 🔒 Security audit
- 📝 Code quality check
- 🏗️ Build test
- ⚡ Performance check
- ♿ Accessibility check

## 🎯 Як використовувати

### Автоматичний деплой

1. **Для staging**: Push в гілку `develop`
2. **Для production**: Merge в гілку `main`

### Ручний деплой

1. Перейдіть до Actions tab в GitHub
2. Виберіть "Deploy to Production"
3. Натисніть "Run workflow"
4. Виберіть платформу (Vercel/Netlify/GitHub Pages)

### Створення Release

```bash
# Створіть тег
git tag v1.0.0

# Push тег
git push origin v1.0.0
```

## 📊 Monitoring

### Перевірка статусу

- Actions tab в GitHub показує статус всіх workflows
- Кожен commit має індикатор статусу
- Failed builds блокуют merge в main

### Логи та артефакти

- Build артефакти зберігаються 1-30 днів
- Детальні логи доступні в Actions tab
- Slack/Discord notifications можна налаштувати

## 🔧 Troubleshooting

### Поширені проблеми

1. **Build fails**
   - Перевірте логи в Actions tab
   - Переконайтеся що всі залежності встановлені
   - Перевірте TypeScript помилки

2. **Deploy fails**
   - Перевірте Vercel токени
   - Переконайтеся що проект існує в Vercel
   - Перевірте права доступу

3. **Secrets not found**
   - Перевірте назви secrets в GitHub
   - Переконайтеся що secrets додані в репозиторій

### Корисні команди

```bash
# Локальне тестування build
npm run build

# Перевірка TypeScript
npx tsc --noEmit

# Лінтінг
npm run lint

# Тестування форматів
node test-formats.js
```

## 🚀 Advanced Configuration

### Environment Variables

Додайте в GitHub Secrets:
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

### Custom Domains

Для Vercel:
1. Додайте домен в Vercel Dashboard
2. Налаштуйте DNS записи
3. Домен автоматично застосується при деплої

### Performance Monitoring

Додайте в `next.config.js`:
```javascript
module.exports = {
  experimental: {
    instrumentationHook: true
  }
}
```

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте логи в Actions tab
2. Перегляньте цей документ
3. Створіть issue в репозиторії

---

**Happy Deploying! 🎉**
