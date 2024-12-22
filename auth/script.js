// Після успішної реєстрації:
function handleRegistrationSuccess() {
    window.location.href = "public/index.html";  // Перехід на головну сторінку
  }
  
  // Збереження даних у localStorage при відправці форми
  document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Забороняє перезавантаження сторінки
  
    const userData = {
      fullname: document.getElementById('fullname').value,
      phone: document.getElementById('phone').value,
      district: document.getElementById('district').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      nickname: document.getElementById('nickname').value
    };
  
    // Зберігання даних в localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    alert('Дані успішно збережено!');
  
    // Відправка даних на сервер
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
  
    const result = await response.json();
    alert(result.message);
  
    // Перехід на головну сторінку після успішної реєстрації
    if (response.ok) {
      handleRegistrationSuccess(); // Перехід після реєстрації
    }
  });
  
  // Показуємо форму вибору ролі
  document.getElementById('chooseMaster').addEventListener('click', function() {
    document.getElementById('mainContainer').classList.add('hidden'); // Сховуємо основну сторінку
    document.getElementById('masterModal').style.display = 'flex'; // Показуємо модальне вікно для майстра
  });
  
  document.getElementById('chooseUser').addEventListener('click', function() {
    document.getElementById('mainContainer').classList.add('hidden'); // Сховуємо основну сторінку
    document.getElementById('userModal').style.display = 'flex'; // Показуємо модальне вікно для користувача
  });
  
  // Обробка форми реєстрації для майстра
  document.getElementById('submitMasterInfo').addEventListener('click', async function() {
    // Перевіряємо чи заповнена форма для майстра
    if (document.getElementById('fullname').value && document.getElementById('phone').value && document.getElementById('district').value) {
      const fullname = document.getElementById('fullname').value;
      const phone = document.getElementById('phone').value;
      const district = document.getElementById('district').value;
      const services = [];
    
      document.querySelectorAll('input[name="services"]:checked').forEach(service => {
        services.push(service.value);
      });
  
      // Збираємо дані
      const masterData = { fullname, phone, district, services };
  
      // Відправка даних на сервер
      try {
        const response = await fetch('/register', {  // Оновлений шлях до /register
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(masterData)
        });
  
        const result = await response.json();
        alert(result.message);
  
        // Перехід на головну сторінку після успішної реєстрації
        if (response.ok) {
          handleRegistrationSuccess(); // Перехід після реєстрації
        }
      } catch (error) {
        console.error('Помилка при відправці запиту:', error);
      }
    } else {
      alert('Будь ласка, заповніть всі поля!');
    }
  });
  