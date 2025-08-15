// Background script для Chrome розширення DataViz AI

chrome.runtime.onInstalled.addListener(() => {
  // Створюємо контекстне меню
  chrome.contextMenus.create({
    id: "open-in-dataviz",
    title: "Open in DataViz AI",
    contexts: ["page", "selection"]
  });
  
  console.log('DataViz AI розширення встановлено');
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "open-in-dataviz") return;
  
  try {
    // Виконуємо скрипт на активній вкладці
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractTableData
    });
    
    if (result && result.data && result.data.length > 0) {
      // Стискаємо дані та відкриваємо в нашому UI
      const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify({
        values: result.data,
        source: tab.url,
        title: tab.title
      }));
      
      const url = `http://localhost:3000/import?s=${compressedData}`;
      chrome.tabs.create({ url });
    } else {
      // Показуємо повідомлення якщо таблицю не знайдено
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showNoTableMessage
      });
    }
  } catch (error) {
    console.error('Помилка обробки таблиці:', error);
  }
});

// Функція для витягування даних з таблиці
function extractTableData() {
  // Знаходимо найбільшу таблицю на сторінці
  const tables = [...document.querySelectorAll('table')];
  
  if (tables.length === 0) {
    return null;
  }
  
  // Сортуємо за розміром (рядки * колонки)
  const sortedTables = tables.sort((a, b) => {
    const aSize = (a.rows?.length || 0) * (a.rows?.[0]?.cells?.length || 0);
    const bSize = (b.rows?.length || 0) * (b.rows?.[0]?.cells?.length || 0);
    return bSize - aSize;
  });
  
  const table = sortedTables[0];
  
  // Конвертуємо таблицю в масив об'єктів
  function tableToArray(table) {
    const rows = [...table.rows];
    if (rows.length === 0) return [];
    
    // Перший рядок як заголовки
    const headers = [...rows[0].cells].map(cell => 
      cell.innerText.trim().replace(/\s+/g, '_')
    );
    
    // Інші рядки як дані
    const data = rows.slice(1).map(row => {
      const obj = {};
      [...row.cells].forEach((cell, index) => {
        if (headers[index]) {
          obj[headers[index]] = cell.innerText.trim();
        }
      });
      return obj;
    });
    
    return data;
  }
  
  const data = tableToArray(table);
  
  return {
    data,
    tableSize: `${table.rows.length} рядків, ${table.rows[0]?.cells?.length || 0} колонок`,
    source: window.location.href
  };
}

// Функція для показу повідомлення про відсутність таблиці
function showNoTableMessage() {
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  message.textContent = 'Таблицю не знайдено на цій сторінці';
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 3000);
}
