# 🚀 GitHub Actions Setup Guide

## 📋 Огляд Workflows

### 1. **deploy.yml** - Основний деплой
- Автоматичний деплой на Vercel та GitHub Pages
- Запускається при push в main branch
- Включає тестування та збірку

### 2. **test.yml** - Тестування та якість
- TypeScript перевірка
- ESLint перевірка
- Безпека (npm audit)
- Перевірка розміру bundle

### 3. **dependabot.yml** - Автоматичні оновлення
- Автоматичне схвалення Dependabot PR
- Auto-merge для безпечних оновлень

### 4. **pages.yml** - GitHub Pages
- Спеціальний workflow для GitHub Pages
- Статичний експорт Next.js

## 🔧 Налаштування Secrets

### Для Vercel деплою:

1. **Отримайте Vercel токен:**
   - Зайдіть на [vercel.com](https://vercel.com)
   - Settings → Tokens → Create Token
   - Скопіюйте токен

2. **Отримайте Project ID:**
   - В проекті Vercel → Settings → General
   - Скопіюйте Project ID

3. **Отримайте Org ID:**
   - Settings → General → Organization ID

4. **Додайте в GitHub Secrets:**
   ```
   VERCEL_TOKEN=your_vercel_token
   VERCEL_ORG_ID=your_org_id
   VERCEL_PROJECT_ID=your_project_id
   ```

### Для GitHub Pages:

1. **Увімкніть GitHub Pages:**
   - Settings → Pages
   - Source: GitHub Actions

2. **Налаштуйте permissions:**
   - Settings → Actions → General
   - Workflow permissions: Read and write permissions

## 🎯 Як додати Secrets

1. Перейдіть в ваш GitHub репозиторій
2. Settings → Secrets and variables → Actions
3. New repository secret
4. Додайте кожен secret окремо

## 📊 Перевірка Workflows

### Подивитися статус:
1. GitHub репозиторій → Actions tab
2. Виберіть workflow
3. Подивіться логи виконання

### Ручний запуск:
1. Actions → Виберіть workflow
2. Run workflow → Run workflow

## 🔄 Автоматизація

### Що відбувається автоматично:

1. **При push в main:**
   - ✅ Тестування коду
   - ✅ Збірка проекту
   - ✅ Деплой на Vercel
   - ✅ Деплой на GitHub Pages

2. **При Pull Request:**
   - ✅ Тестування
   - ✅ Перевірка якості
   - ✅ Безпека

3. **Щотижня (Dependabot):**
   - ✅ Оновлення залежностей
   - ✅ Автоматичне схвалення
   - ✅ Auto-merge

## 🛠️ Troubleshooting

### Помилки збірки:
```bash
# Локальна перевірка
npm run build
npm run lint
npx tsc --noEmit
```

### Помилки деплою:
1. Перевірте secrets
2. Перевірте permissions
3. Подивіться логи в Actions

### Помилки Vercel:
1. Перевірте VERCEL_TOKEN
2. Перевірте PROJECT_ID
3. Перевірте ORG_ID

## 📈 Моніторинг

### GitHub Actions:
- Actions tab → Всі workflows
- Статус кожного job
- Час виконання
- Логи помилок

### Vercel:
- Dashboard → Deployments
- Статус деплою
- Preview URLs
- Analytics

### GitHub Pages:
- Settings → Pages
- Статус деплою
- Custom domain
- Analytics

## 🎉 Результат

Після налаштування:

1. **Автоматичний деплой** при кожному push
2. **Тестування** перед деплоєм
3. **Безпека** перевірка
4. **Оновлення залежностей** щотижня
5. **Моніторинг** всіх процесів

## 🔗 Корисні посилання

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

---

**🚀 Ваш проект тепер повністю автоматизований!**
