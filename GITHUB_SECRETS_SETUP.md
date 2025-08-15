# 🔐 GitHub Secrets Setup Guide

Цей документ містить інструкції для налаштування GitHub Secrets, необхідних для роботи GitHub Actions workflows.

## 📋 Необхідні Secrets

### Для Vercel деплою (обов'язково):

#### 1. VERCEL_TOKEN
1. Перейдіть на [Vercel Dashboard](https://vercel.com/dashboard)
2. Натисніть **Settings** → **Tokens**
3. Натисніть **Create Token**
4. Введіть назву: "GitHub Actions"
5. Скопіюйте токен
6. В GitHub: Settings → Secrets → New repository secret
7. Name: `VERCEL_TOKEN`
8. Value: вставте скопійований токен

#### 2. VERCEL_ORG_ID
1. В Vercel Dashboard перейдіть в **Settings** → **General**
2. Знайдіть **Team ID** або **Personal Account ID**
3. Скопіюйте ID
4. В GitHub: Settings → Secrets → New repository secret
5. Name: `VERCEL_ORG_ID`
6. Value: вставте скопійований ID

#### 3. VERCEL_PROJECT_ID
1. В Vercel Dashboard відкрийте ваш проект
2. Перейдіть в **Settings** → **General**
3. Знайдіть **Project ID**
4. Скопіюйте ID
5. В GitHub: Settings → Secrets → New repository secret
6. Name: `VERCEL_PROJECT_ID`
7. Value: вставте скопійований ID

### Для Netlify деплою (опціонально):

#### 1. NETLIFY_AUTH_TOKEN
1. Перейдіть на [Netlify Dashboard](https://app.netlify.com/)
2. Натисніть **User settings** → **Applications** → **Personal access tokens**
3. Натисніть **New access token**
4. Введіть назву: "GitHub Actions"
5. Скопіюйте токен
6. В GitHub: Settings → Secrets → New repository secret
7. Name: `NETLIFY_AUTH_TOKEN`
8. Value: вставте скопійований токен

#### 2. NETLIFY_SITE_ID
1. В Netlify Dashboard відкрийте ваш сайт
2. Перейдіть в **Site settings** → **General**
3. Знайдіть **Site ID**
4. Скопіюйте ID
5. В GitHub: Settings → Secrets → New repository secret
6. Name: `NETLIFY_SITE_ID`
7. Value: вставте скопійований ID

## 🔧 Альтернативний спосіб отримання Vercel credentials

### Через Vercel CLI:

```bash
# Встановіть Vercel CLI
npm i -g vercel

# Увійдіть в Vercel
vercel login

# Отримайте інформацію про проект
vercel projects ls

# Отримайте інформацію про організацію
vercel teams ls
```

## 📊 Перевірка налаштувань

### Тест деплою:

1. Створіть нову гілку:
```bash
git checkout -b test-deploy
git push origin test-deploy
```

2. Перейдіть в GitHub → Actions
3. Знайдіть workflow "Deploy to Production"
4. Натисніть "Run workflow"
5. Виберіть гілку `test-deploy`
6. Перевірте логи на наявність помилок

### Перевірка secrets:

Якщо виникають помилки типу:
- "Vercel credentials not configured"
- "Invalid Vercel token"
- "Project not found"

Перевірте:
1. Правильність назв secrets
2. Правильність значень
3. Права доступу токенів

## 🚨 Безпека

### Важливі правила:

1. **Ніколи не комітьте secrets в код**
2. **Використовуйте тільки GitHub Secrets**
3. **Регулярно оновлюйте токени**
4. **Обмежуйте права токенів**

### Рекомендовані налаштування токенів:

#### Vercel Token:
- ✅ Read & Write access
- ✅ Project access: тільки ваш проект
- ✅ Expiration: 1 рік

#### Netlify Token:
- ✅ Read & Write access
- ✅ Site access: тільки ваш сайт
- ✅ Expiration: 1 рік

## 🔄 Оновлення Secrets

### Якщо потрібно оновити токен:

1. Створіть новий токен в Vercel/Netlify
2. Оновіть secret в GitHub
3. Видаліть старий токен
4. Протестуйте деплой

### Команди для тестування:

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

## 📞 Troubleshooting

### Поширені проблеми:

1. **"Vercel credentials not configured"**
   - Перевірте, чи додані всі три secrets
   - Перевірте правильність назв

2. **"Invalid Vercel token"**
   - Токен застарів або неправильний
   - Створіть новий токен

3. **"Project not found"**
   - Перевірте VERCEL_PROJECT_ID
   - Переконайтеся, що проект існує

4. **"Organization not found"**
   - Перевірте VERCEL_ORG_ID
   - Переконайтеся, що у вас є доступ

### Корисні посилання:

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Netlify Dashboard](https://app.netlify.com/)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**🔐 Після налаштування всіх secrets ваші GitHub Actions workflows будуть працювати автоматично!**
