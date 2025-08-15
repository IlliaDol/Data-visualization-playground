// Popup script для Chrome розширення DataViz AI

document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractBtn');
  const openAppBtn = document.getElementById('openAppBtn');
  const statusDiv = document.getElementById('status');
  
  // Кнопка для витягування таблиці
  extractBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        showStatus('Помилка: не вдалося отримати активну вкладку', 'error');
        return;
      }
      
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
        
        showStatus(`Успішно! Знайдено ${result.data.length} рядків`, 'success');
      } else {
        showStatus('Таблицю не знайдено на цій сторінці', 'error');
      }
    } catch (error) {
      console.error('Помилка витягування таблиці:', error);
      showStatus('Помилка витягування таблиці', 'error');
    }
  });
  
  // Кнопка для відкриття додатку
  openAppBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
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
  
  // Функція для показу статусу
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = '';
    }, 3000);
  }
});
