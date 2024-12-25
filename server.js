const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

//Відправлення заявок:

// Збільшення ліміту розміру запиту
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const APPLICATION_FILE = "application.json";

// Функція для читання заявок із файлу
const readApplications = () => {
  if (!fs.existsSync(APPLICATION_FILE)) {
    return [];
  }
  const data = fs.readFileSync(APPLICATION_FILE, "utf-8");
  return JSON.parse(data || "[]");
};

// Функція для запису заявок у файл
const writeApplications = (applications) => {
  fs.writeFileSync(APPLICATION_FILE, JSON.stringify(applications, null, 2));
};

// Обробка POST-запиту для отримання заявки
app.post("/api/submit-request", (req, res) => {
  const formData = req.body;
  const applications = readApplications();

  // Додаємо нову заявку
  const newApplication = {
    id: Date.now(), // Унікальний ідентифікатор заявки
    ...formData,
    completed: false, // Стан виконання заявки
  };

  applications.push(newApplication);
  writeApplications(applications);

  res.status(200).json({ message: "Заявка успішно збережена!", application: newApplication });
});

// Обробка GET-запиту для отримання всіх заявок
app.get("/api/applications", (req, res) => {
  const applications = readApplications();
  res.status(200).json(applications);
});

// Обробка PATCH-запиту для оновлення стану заявки
app.patch("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  let applications = readApplications();
  const applicationIndex = applications.findIndex((app) => app.id === parseInt(id));

  if (applicationIndex !== -1) {
    applications[applicationIndex].completed = completed;
    writeApplications(applications);
    res.status(200).json({ message: "Заявка оновлена!", application: applications[applicationIndex] });
  } else {
    res.status(404).json({ message: "Заявка не знайдена!" });
  }
});
//Кінець кодуз заявками

// Ініціалізація JSON-файлів
const initializeFile = (fileName) => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, '[]', 'utf8');
  }
};
initializeFile('masters.json');
initializeFile('users.json');
initializeFile('analytics.json');
initializeFile('CursorMovement.json'); // Додаємо ініціалізацію для CursorMovement.json

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

// Обробка даних про рух курсора
app.post('/api/track-actions', (req, res) => {
  const actions = req.body.actions;
  
  // Читаємо наявний файл JSON для курсорних даних
  fs.readFile('CursorMovement.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Помилка читання файлу:', err);
      return;
    }
    
    // Якщо файл порожній, створюємо масив, в іншому випадку парсимо дані
    let existingData = data ? JSON.parse(data) : [];
    
    // Додаємо нові дії до існуючих
    existingData.push(...actions);
    
    // Записуємо оновлені дані назад в файл
    fs.writeFile('CursorMovement.json', JSON.stringify(existingData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Помилка запису файлу:', err);
        return;
      }
      console.log('Дані успішно записано в CursorMovement.json');
      res.status(200).json({ message: 'Дані успішно збережено' });
    });
  });
});
// Роут для віддачі даних руху курсора
app.get('/api/get-cursor-data', (req, res) => {
  fs.readFile('CursorMovement.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Помилка читання файлу CursorMovement.json:', err);
          return res.status(500).send({ message: 'Не вдалося отримати дані руху курсора' });
      }

      res.status(200).json(JSON.parse(data));
  });
});
// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
