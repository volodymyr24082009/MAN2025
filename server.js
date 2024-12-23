const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

// Ініціалізація JSON-файлів
const initializeFile = (fileName) => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, '[]', 'utf8');
  }
};
initializeFile('masters.json');
initializeFile('users.json');
initializeFile('analytics.json');

// Додавання статичних файлів
app.use('/auth', express.static(path.join(__dirname, 'auth')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Роут для початкової сторінки
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth', 'index.html'));
});

// Обробка JSON-запитів
app.use(express.json());

// Функція для перекладу району на українську
function translateDistrict(district) {
  const districts = {
    "korolyovsky": "Корольовський",
    "bogunsky": "Богунський",
    // Додайте інші переклади тут
  };

  return districts[district.toLowerCase()] || district; // Якщо район не знайдений, залишаємо оригінальний
}

// POST: Реєстрація користувачів та майстрів
app.post('/register', (req, res) => {
  const userData = req.body;

  // Переклад району на українську, якщо він вказаний латиницею
  if (userData.district) {
    userData.district = translateDistrict(userData.district);
  }

  const fileName = userData.services ? 'masters.json' : 'users.json';

  fs.readFile(fileName, (err, data) => {
    let users = [];
    if (!err) {
      users = JSON.parse(data);
    }

    users.push(userData);

    fs.writeFile(fileName, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Помилка при запису:', err);
        return res.status(500).send({ message: 'Помилка при запису даних.' });
      }

      // Відправляємо статус з повідомленням, щоб клієнт знав про успішну реєстрацію
      res.status(200).send({ message: 'Дані успішно збережено!' });
    });
  });
});

// GET: Отримання майстрів із файлу masters.json
app.get('/masters', (req, res) => {
  fs.readFile('masters.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Помилка читання файлу masters.json:', err);
      return res.status(500).send({ message: 'Не вдалося завантажити майстрів.' });
    }

    const masters = JSON.parse(data);
    res.status(200).send(masters);
  });
});

// Функція для запису аналітики в файл
function logAnalytics(data) {
  fs.readFile('analytics.json', (err, jsonData) => {
    let analytics = [];
    if (!err && jsonData.length > 0) {
      analytics = JSON.parse(jsonData);
    }

    analytics.push(data);

    fs.writeFile('analytics.json', JSON.stringify(analytics, null, 2), (err) => {
      if (err) {
        console.error('Error writing analytics data', err);
      }
    });
  });
}

// Мідлвар для аналізу запитів
app.use((req, res, next) => {
  const analyticsData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  };

  logAnalytics(analyticsData);
  next();
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
