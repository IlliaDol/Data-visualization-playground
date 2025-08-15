# 🔧 Troubleshooting GitHub Actions

## Проблемы с Vercel Secrets

### Предупреждения "Context access might be invalid"

Эти предупреждения появляются потому что Vercel credentials еще не настроены. Это **нормально** и не влияет на работу приложения.

### Решение:

1. **Игнорировать предупреждения** - они исчезнут после настройки Vercel
2. **Или настроить Vercel** (см. VERCEL_SETUP.md)

## Workflow Status

### ✅ CI Workflow (ci.yml)
- **Всегда работает** без дополнительной настройки
- Проверяет TypeScript и сборку
- Запускается при каждом push

### ⚠️ Deploy Workflow (deploy.yml)
- **Требует настройки Vercel** для деплоя
- Без настроек просто показывает предупреждение
- Не блокирует другие workflows

### ✅ Test Workflow (test.yml)
- **Работает на разных версиях Node.js**
- Проверяет совместимость
- Запускается при каждом push

## Проверка статуса

1. Перейдите в **Actions** tab на GitHub
2. Выберите workflow (CI, Test, Deploy)
3. Проверьте статус последнего запуска

## Частые проблемы

### 1. Build fails
```bash
# Локальная проверка
npm run build
npx tsc --noEmit
```

### 2. TypeScript errors
```bash
# Проверка типов
npx tsc --noEmit
```

### 3. Dependencies issues
```bash
# Очистка и переустановка
rm -rf node_modules package-lock.json
npm install
```

## Логи и отладка

### GitHub Actions Logs
1. Actions tab → выберите workflow
2. Нажмите на failed job
3. Разверните step с ошибкой

### Локальная отладка
```bash
# Проверка сборки
npm run build

# Проверка типов
npx tsc --noEmit

# Проверка линтера
npm run lint
```

## Контакты

- **GitHub Issues**: Создайте issue в репозитории
- **Actions Logs**: Проверьте логи в Actions tab
- **Vercel Support**: Если проблемы с деплоем

---

**💡 Совет**: Начните с настройки Vercel для полного CI/CD pipeline!
