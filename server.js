const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Ініціалізація JSON-файлів
const initializeFile = (fileName) => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, '[]', 'utf8');
  }
};
initializeFile('masters.json');
initializeFile('users.json');

// Додавання статичних файлів
app.use('/auth', express.static(path.join(__dirname, 'auth')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Роут для початкової сторінки
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth', 'index.html'));
});

// Обробка JSON-запитів
app.use(express.json());

// POST: Реєстрація користувачів та майстрів
app.post('/register', (req, res) => {
  const userData = req.body;
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
