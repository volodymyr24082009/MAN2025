document.addEventListener("DOMContentLoaded", () => {
  const servicesList = document.getElementById("services-list");
  const contactForm = document.getElementById("contact-form");
  const navLinks = document.querySelector(".nav-links");
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav");
  const header = document.querySelector("header");

  // **Послуги**
  const services = [
    { name: "Діагностика двигуна", icon: "fa-car" },
    { name: "Ремонт трансмісії", icon: "fa-cogs" },
    { name: "Заміна гальмівних дисків", icon: "fa-bolt" },
    { name: "Ремонт кондиціонера", icon: "fa-oil-can" },
    { name: "Заміна масла", icon: "fa-car-crash" },
    { name: "Ремонт підвіски", icon: "fa-car" },
    { name: "Заміна свічок запалювання", icon: "fa-cogs" },
    { name: "Покраска автомобіля", icon: "fa-bolt" },
    { name: "Ремонт електричних систем", icon: "fa-oil-can" },
    { name: "Охолодження двигуна", icon: "fa-car-crash" },
    { name: "Заміна фільтру", icon: "fa-car" },
    { name: "Ремонт стартера", icon: "fa-cogs" },
    { name: "Ремонт електродвигуна", icon: "fa-bolt" },
    { name: "Перевірка системи живлення", icon: "fa-oil-can" },
    { name: "Проблеми з акумулятором", icon: "fa-car-crash" },
    { name: "Ремонт вихлопної системи", icon: "fa-car" },
    { name: "Заміна ременя", icon: "fa-cogs" },
    { name: "Перевірка системи охолодження", icon: "fa-bolt" },
    { name: "Ремонт підшипників", icon: "fa-oil-can" },
    { name: "Ремонт системи підйому", icon: "fa-car-crash" },
    { name: "Ремонт рульового управління", icon: "fa-car" },
    { name: "Заміна гальмівної рідини", icon: "fa-cogs" },
    { name: "Ремонт паливної системи", icon: "fa-bolt" },
    { name: "Заміна амортизаторів", icon: "fa-oil-can" },
    { name: "Ремонт системи запалювання", icon: "fa-car-crash" },
    { name: "Проблеми з трансмісією", icon: "fa-car" },
    { name: "Ремонт кузова", icon: "fa-cogs" },
    { name: "Ремонт фар", icon: "fa-bolt" },
    { name: "Заміна гальмівних колодок", icon: "fa-oil-can" },
    { name: "Ремонт двигуна", icon: "fa-car-crash" },
    { name: "Ремонт системи випуску газів", icon: "fa-wrench" },
  ];

  if (servicesList) {
    services.forEach((service) => {
      const div = document.createElement("div");
      div.className = "service-card";
      div.innerHTML = `
        <i class="fas ${service.icon} service-icon"></i>
        <h3 class="service-title">${service.name}</h3>
      `;
      servicesList.appendChild(div);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Отримуємо контейнер для майстрів на сторінці
    const mastersContainer = document.querySelector(".masters-grid");

    // Очищаємо контейнер перед завантаженням нових даних
    mastersContainer.innerHTML = "";

    // Завантажуємо дані майстрів з файлу masters.json
    fetch("/masters.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Перевірка, що дані отримано
        data.forEach((master) => {
          // Створюємо елемент для кожного майстра
          const masterCard = document.createElement("div");
          masterCard.classList.add("master-card");

          // Створюємо список послуг майстра
          const servicesList = master.services
            .map((service) => `<li>${service}</li>`)
            .join("");

          // Наповнюємо картку майстра інформацією
          masterCard.innerHTML = `
            <h3>${master.fullname}</h3>
            <p><strong>Номер телефону:</strong> ${
              master.phone || "Не вказано"
            }</p>
            <p><strong>Район:</strong> ${master.district}</p>
            <p><strong>Послуги:</strong></p>
            <ul>${servicesList}</ul>
          `;

          // Додаємо картку в контейнер
          mastersContainer.appendChild(masterCard);
        });
      })
      .catch((error) => {
        console.error("Помилка при завантаженні даних:", error);
        // Можна додати повідомлення про помилку на сторінці
      });
  });

  // **Обробка форми контактів**
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Відмінити перезавантаження сторінки

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/api/submit-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message + " Ми зв'яжемося з вами протягом 15 хвилин.");
          contactForm.reset();
        } else {
          throw new Error(result.error || "Помилка при відправці заявки");
        }
      } catch (error) {
        alert(
          "Виникла помилка при відправці заявки. Будь ласка, спробуйте ще раз пізніше."
        );
        console.error("Помилка:", error);
      }
    });
  }

  // **Мобільна навігація**
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
    });
  }

  // **Анімації при прокручуванні**
  const faders = document.querySelectorAll(".fade-in");
  const sliders = document.querySelectorAll(".slide-in");

  const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -100px 0px",
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach((fader) => appearOnScroll.observe(fader));
  sliders.forEach((slider) => appearOnScroll.observe(slider));

  // **Зміна стилю хедера при прокручуванні**
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // **Плавна прокрутка**
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const districtSelect = document.getElementById("district");
  const streetSelect = document.getElementById("street");

  let streetsData = {}; // Об'єкт для збереження завантажених даних

  // Функція для завантаження JSON
  async function loadStreets() {
    try {
      const response = await fetch("streets.json"); // Завантаження файлу
      streetsData = await response.json(); // Збереження даних у змінну
    } catch (error) {
      console.error("Помилка завантаження JSON:", error);
    }
  }

  // Викликаємо функцію завантаження при завантаженні сторінки
  loadStreets();

  // Подія при зміні району
  districtSelect.addEventListener("change", () => {
    const selectedDistrict = districtSelect.value;

    // Очищення списку вулиць
    streetSelect.innerHTML =
      '<option value="">Спочатку оберіть вулицю</option>';

    if (selectedDistrict && streetsData[selectedDistrict]) {
      // Додавання вулиць у список
      streetsData[selectedDistrict].forEach((street) => {
        const option = document.createElement("option");
        option.value = street;
        option.textContent = street;
        streetSelect.appendChild(option);
      });
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Кнопка для редагування профілю
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const editProfileForm = document.getElementById("edit-profile-form");
  const userName = document.getElementById("user-name");
  const userEmail = document.getElementById("user-email");
  const userPhone = document.getElementById("user-phone");

  // Перемикач між переглядом профілю і його редагуванням
  editProfileBtn.addEventListener("click", function () {
    editProfileForm.style.display = "block";
    // Оскільки ми починаємо редагування, приховуємо профіль
    editProfileBtn.style.display = "none";
  });

  // Обробка форми редагування профілю
  const editProfile = document.getElementById("edit-profile");
  editProfile.addEventListener("submit", function (e) {
    e.preventDefault();
    // Оновлюємо дані на сторінці
    userName.textContent = document.getElementById("edit-name").value;
    userEmail.textContent = document.getElementById("edit-email").value;
    userPhone.textContent = document.getElementById("edit-phone").value;

    // Приховуємо форму редагування та повертаємо кнопку "Редагувати профіль"
    editProfileForm.style.display = "none";
    editProfileBtn.style.display = "block";
  });
});
// Функція для отримання майстрів з сервера та відображення їх на сторінці
fetch("/masters")
  .then((response) => response.json())
  .then((masters) => {
    const mastersContainer = document.getElementById("masters-container");
    masters.forEach((master) => {
      const masterElement = document.createElement("div");
      masterElement.classList.add("master");

      // Додаємо інформацію про майстра
      masterElement.innerHTML = `
        <h2>${master.fullname}</h2>
        <p>Телефон: ${master.phone}</p>
        <p>Район: ${master.district}</p>
        <p>Послуги:</p>
        <ul>
          ${master.services.map((service) => `<li>${service}</li>`).join("")}
        </ul>
      `;

      mastersContainer.appendChild(masterElement);
    });
  })
  .catch((error) => {
    console.error("Помилка при завантаженні майстрів:", error);
  });
//Статистика майстрів

// Функція для оновлення статистики
function updateMasterStats() {
  // Приклад динамічного оновлення
  document.getElementById("requests-count").textContent = "150"; // Приклад зміни кількості запитів
  document.getElementById("avg-response-time").textContent = "25 хвилин"; // Заміна середнього часу відповіді
  document.getElementById("positive-reviews").textContent = "97%"; // Заміна відсотка позитивних відгуків
}

// Оновлення статистики при завантаженні сторінки
window.onload = function () {
  updateMasterStats();
};
let userActions = []; // Масив для зберігання рухів і взаємодій користувача

// Відслідковуємо рух курсора
document.addEventListener('mousemove', (event) => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    
    // Зберігаємо дані про рух
    userActions.push({ type: 'mousemove', x: mouseX, y: mouseY, timestamp: new Date() });
});

// Відслідковуємо кліки по елементах
document.addEventListener('click', (event) => {
    let element = event.target;
    userActions.push({
        type: 'click',
        element: element.tagName,
        id: element.id,
        class: element.className,
        timestamp: new Date()
    });
});

// Функція для відправки зібраних даних на сервер
function sendUserActionsToServer() {
    fetch('/api/track-actions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actions: userActions }),
    })
    .then(response => response.json())
    .then(data => console.log('Дані на сервері:', data))
    .catch(error => console.error('Помилка:', error));
}

// Відправляти дані на сервер кожні 30 секунд
setInterval(sendUserActionsToServer, 30000);
     // Функція для отримання даних з сервера
     async function fetchCursorData() {
      const response = await fetch('/api/get-cursor-data');
      const data = await response.json();
      return data;
  }

  // Створення графіка руху курсора
  function createCursorChart(data) {
      const ctx = document.getElementById('cursorMovementChart').getContext('2d');
      
      // Мапуємо дані у формат, який Chart.js розуміє
      const coordinates = data.map(d => ({ x: d.x, y: d.y }));

      new Chart(ctx, {
          type: 'scatter',
          data: {
              datasets: [{
                  label: 'Рух курсора',
                  data: coordinates,
                  backgroundColor: 'rgba(75, 192, 192, 1)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  x: {
                      type: 'linear',
                      position: 'bottom'
                  },
                  y: {
                      type: 'linear',
                      position: 'left'
                  }
              }
          }
      });
  }

  // Завантаження та візуалізація даних
  async function loadAndVisualize() {
      const data = await fetchCursorData();
      createCursorChart(data);
  }

  loadAndVisualize();

  