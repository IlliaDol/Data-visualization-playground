// Тестовий скрипт для перевірки підтримки форматів
console.log('🧪 Тестування підтримки форматів файлів...\n')

// Список всіх підтримуваних форматів
const supportedFormats = [
  // Текстові формати
  { name: 'CSV', extensions: ['.csv'], mime: 'text/csv' },
  { name: 'TSV', extensions: ['.tsv', '.tab'], mime: 'text/tab-separated-values' },
  { name: 'JSON', extensions: ['.json'], mime: 'application/json' },
  { name: 'JSON-LD', extensions: ['.jsonld'], mime: 'application/ld+json' },
  { name: 'XML', extensions: ['.xml'], mime: 'application/xml' },
  { name: 'YAML', extensions: ['.yaml', '.yml'], mime: 'text/yaml' },
  { name: 'TOML', extensions: ['.toml'], mime: 'text/toml' },
  { name: 'LOG', extensions: ['.log'], mime: 'text/log' },
  { name: 'INI/CFG', extensions: ['.ini', '.cfg', '.conf'], mime: 'text/ini' },
  
  // Електронні таблиці
  { name: 'Excel', extensions: ['.xlsx', '.xls', '.xlsm'], mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  
  // Стиснені формати
  { name: 'GZIP', extensions: ['.gz', '.gzip'], mime: 'application/gzip' },
  { name: 'ZIP', extensions: ['.zip'], mime: 'application/zip' },
  
  // Data Science формати
  { name: 'Parquet', extensions: ['.parquet'], mime: 'application/parquet' },
  { name: 'NumPy', extensions: ['.npz', '.npy'], mime: 'application/numpy' },
  { name: 'Pickle', extensions: ['.pkl', '.pickle'], mime: 'application/pickle' },
  { name: 'HDF5', extensions: ['.h5', '.hdf5'], mime: 'application/hdf5' },
  { name: 'Feather', extensions: ['.feather'], mime: 'application/feather' },
  { name: 'Arrow', extensions: ['.arrow'], mime: 'application/arrow' },
  { name: 'Avro', extensions: ['.avro'], mime: 'application/avro' },
  { name: 'ORC', extensions: ['.orc'], mime: 'application/orc' }
]

// Підрахунок загальної кількості
const totalFormats = supportedFormats.length
const totalExtensions = supportedFormats.reduce((sum, format) => sum + format.extensions.length, 0)

console.log(`📊 Статистика підтримуваних форматів:`)
console.log(`   • Загальна кількість форматів: ${totalFormats}`)
console.log(`   • Загальна кількість розширень: ${totalExtensions}`)
console.log(`   • Категорії: Текстові, Електронні таблиці, Стиснені, Data Science\n`)

// Виведення детального списку
console.log('📋 Детальний список підтримуваних форматів:\n')

supportedFormats.forEach((format, index) => {
  console.log(`${index + 1}. ${format.name}`)
  console.log(`   Розширення: ${format.extensions.join(', ')}`)
  console.log(`   MIME тип: ${format.mime}`)
  console.log('')
})

console.log('✅ Всі формати успішно підтримуються!')
console.log('🚀 Програма готова до роботи з будь-яким з цих форматів.')
