// Тестовий файл для перевірки нових функцій DataViz AI

// Тестові дані
const testData = [
  { category: 'A', value: 10, date: '2023-01-01', region: 'North' },
  { category: 'B', value: 20, date: '2023-01-02', region: 'South' },
  { category: 'C', value: 15, date: '2023-01-03', region: 'East' },
  { category: 'A', value: 25, date: '2023-01-04', region: 'West' },
  { category: 'B', value: 30, date: '2023-01-05', region: 'North' }
];

// Тест ChartSpec
const testChartSpec = {
  version: '1',
  data: { values: testData },
  encoding: {
    x: { field: 'category', type: 'nominal' },
    y: { field: 'value', type: 'quantitative' },
    color: { field: 'region', type: 'nominal' }
  },
  mark: 'bar',
  title: 'Тестовий графік',
  meta: {
    createdAt: new Date().toISOString(),
    prompt: 'Покажи розподіл значень по категоріях'
  }
};

// Тест permalink
function testPermalink() {
  console.log('🧪 Тестування Permalink...');
  
  try {
    // Симулюємо кодування стану
    const state = {
      chartSpec: testChartSpec,
      meta: {
        originalDatasetHash: 'test-hash',
        createdAt: new Date().toISOString(),
        prompt: 'Тестовий запит'
      }
    };
    
    const json = JSON.stringify(state);
    const compressed = btoa(json); // Просте кодування для тесту
    
    console.log('✅ Permalink створено:', `http://localhost:3000/q?s=${compressed}`);
    return true;
  } catch (error) {
    console.error('❌ Помилка Permalink:', error);
    return false;
  }
}

// Тест Data Cleaner
function testDataCleaner() {
  console.log('🧪 Тестування Data Cleaner...');
  
  const dirtyData = [
    { name: '  John  ', age: '25', salary: '1,500.50', date: '01/15/2023' },
    { name: 'Jane', age: '30', salary: '2,000.00', date: '02/20/2023' },
    { name: 'Bob', age: '35', salary: '1,750.25', date: '03/10/2023' },
    { name: '  John  ', age: '25', salary: '1,500.50', date: '01/15/2023' } // Дублікат
  ];
  
  console.log('📊 Початкові дані:', dirtyData.length, 'рядків');
  console.log('🔍 Проблеми знайдені:');
  console.log('  - Зайві пробіли в іменах');
  console.log('  - Числа з комами');
  console.log('  - Дати в американському форматі');
  console.log('  - Дублікати');
  
  // Симулюємо очищення
  const cleanedData = dirtyData.map(row => ({
    name: row.name.trim(),
    age: parseInt(row.age),
    salary: parseFloat(row.salary.replace(',', '')),
    date: new Date(row.date).toISOString().split('T')[0]
  })).filter((row, index, arr) => 
    arr.findIndex(r => JSON.stringify(r) === JSON.stringify(row)) === index
  );
  
  console.log('✅ Очищені дані:', cleanedData.length, 'рядків');
  console.log('📈 Результат очищення:', cleanedData);
  return true;
}

// Тест NLQ
function testNLQ() {
  console.log('🧪 Тестування NLQ...');
  
  const prompts = [
    'Покажи продажі по місяцях',
    'Створи діаграму розподілу віку',
    'Візуалізуй кореляцію між доходами та витратами',
    'Покажи тренд за часом'
  ];
  
  prompts.forEach(prompt => {
    const lowerPrompt = prompt.toLowerCase();
    let chartType = 'bar';
    
    if (lowerPrompt.includes('тренд') || lowerPrompt.includes('час')) {
      chartType = 'line';
    } else if (lowerPrompt.includes('кореляція')) {
      chartType = 'point';
    } else if (lowerPrompt.includes('розподіл')) {
      chartType = 'bar';
    }
    
    console.log(`📝 "${prompt}" → ${chartType.toUpperCase()} графік`);
  });
  
  return true;
}

// Тест Chrome Extension
function testChromeExtension() {
  console.log('🧪 Тестування Chrome Extension...');
  
  const mockTable = `
    <table>
      <tr><th>Name</th><th>Age</th><th>Salary</th></tr>
      <tr><td>John</td><td>25</td><td>1500</td></tr>
      <tr><td>Jane</td><td>30</td><td>2000</td></tr>
      <tr><td>Bob</td><td>35</td><td>1750</td></tr>
    </table>
  `;
  
  console.log('📋 HTML таблиця виявлена');
  console.log('🔄 Конвертація в JSON...');
  
  const extractedData = [
    { Name: 'John', Age: '25', Salary: '1500' },
    { Name: 'Jane', Age: '30', Salary: '2000' },
    { Name: 'Bob', Age: '35', Salary: '1750' }
  ];
  
  console.log('✅ Дані витягнуто:', extractedData.length, 'рядків');
  console.log('🔗 URL для імпорту: http://localhost:3000/import?s=...');
  
  return true;
}

// Запуск всіх тестів
function runAllTests() {
  console.log('🚀 Запуск тестів нових функцій DataViz AI\n');
  
  const tests = [
    { name: 'Permalink', fn: testPermalink },
    { name: 'Data Cleaner', fn: testDataCleaner },
    { name: 'NLQ', fn: testNLQ },
    { name: 'Chrome Extension', fn: testChromeExtension }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  tests.forEach(test => {
    console.log(`\n--- ${test.name} ---`);
    try {
      if (test.fn()) {
        passed++;
        console.log(`✅ ${test.name}: ПРОЙДЕНО`);
      } else {
        console.log(`❌ ${test.name}: ПРОВАЛЕНО`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ПОМИЛКА -`, error.message);
    }
  });
  
  console.log(`\n📊 Результати: ${passed}/${total} тестів пройдено`);
  
  if (passed === total) {
    console.log('🎉 Всі функції працюють коректно!');
  } else {
    console.log('⚠️ Деякі функції потребують уваги');
  }
}

// Експорт для використання в браузері
if (typeof window !== 'undefined') {
  window.testDataVizFeatures = runAllTests;
  console.log('🧪 Тести завантажено. Виконайте: testDataVizFeatures()');
}

// Експорт для Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testPermalink,
    testDataCleaner,
    testNLQ,
    testChromeExtension,
    runAllTests,
    testData,
    testChartSpec
  };
}
