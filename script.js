// Получаем ссылку на базу данных
const db = firebase.database();
const productsRef = db.ref('products');

let products = [];

// ------------------------------------------------------------
// 1. СЛУШАЕМ ИЗМЕНЕНИЯ В БАЗЕ (синхронизация в реальном времени)
// ------------------------------------------------------------
productsRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    // Преобразуем объект в массив
    products = Object.values(data);
    products.sort((a, b) => a.id - b.id);
  } else {
    // Если данных нет – создаём начальные
    products = getDefaultProducts();
    saveProducts(products);
  }
  renderCatalog();
  // Если модалка открыта – обновляем её содержимое
  if (currentProductId !== null) {
    openModal(currentProductId);
  }
});

// ------------------------------------------------------------
// 2. ФУНКЦИЯ СОХРАНЕНИЯ В БАЗУ
// ------------------------------------------------------------
function saveProducts(data) {
  const obj = {};
  data.forEach(item => {
    obj[item.id] = item;
  });
  productsRef.set(obj);
}

// ------------------------------------------------------------
// 3. НАЧАЛЬНЫЕ ДАННЫЕ (14 товаров)
// ------------------------------------------------------------
function getDefaultProducts() {
  return [
    {
      id: 1,
      name: 'Лайтнинг',
      image: 'images/LightningB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 2,
      name: 'Pain',
      image: 'images/PainB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 3,
      name: 'Будда',
      image: 'images/BuddhaB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 4,
      name: 'Контроль',
      image: 'images/ControlB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 5,
      name: 'Гравитация',
      image: 'images/GravityB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 6,
      name: 'Газ',
      image: 'images/GasB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 7,
      name: 'Тесто',
      image: 'images/DoughB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 8,
      name: 'Яд',
      image: 'images/VenomB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 9,
      name: 'Портал',
      image: 'images/PortalB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 10,
      name: 'Кицуне',
      image: 'images/KitsuneB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 11,
      name: 'Дракон',
      image: 'images/DragonB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 12,
      name: 'Йети',
      image: 'images/YetiFruitB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 13,
      name: 'Геймпас',
      image: 'images/BadgeFruitNotifier.webp',   // замените на реальный файл, если есть
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    },
    {
      id: 14,
      name: 'Мамонт',
      image: 'images/MammothB.webp',
      accounts: [
        { name: 'Руслан', count: 0 },
        { name: 'Миша', count: 0 },
        { name: 'Гера', count: 0 },
        { name: 'Дима', count: 0 }
      ]
    }
  ];
}

// ------------------------------------------------------------
// 4. ОТРИСОВКА КАТАЛОГА
// ------------------------------------------------------------
function renderCatalog() {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';

  if (!products || products.length === 0) {
    catalog.innerHTML = '<div class="no-products">Товары не найдены</div>';
    return;
  }

  products.forEach(product => {
    const total = getTotalCount(product);

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <div class="total">Всего: <span id="total-${product.id}">${total}</span> шт.</div>
    `;

    card.addEventListener('click', () => openModal(product.id));
    catalog.appendChild(card);
  });
}

// ------------------------------------------------------------
// 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ------------------------------------------------------------
function getTotalCount(product) {
  return product.accounts.reduce((sum, acc) => sum + acc.count, 0);
}

// ------------------------------------------------------------
// 6. МОДАЛЬНОЕ ОКНО
// ------------------------------------------------------------
let currentProductId = null;

function openModal(productId) {
  currentProductId = productId;
  const product = products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modalTitle').textContent = product.name;

  const container = document.getElementById('accountsContainer');
  container.innerHTML = '';

  product.accounts.forEach((account, index) => {
    const accountCard = document.createElement('div');
    accountCard.className = 'account-card';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = account.name;

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'controls';

    const btnMinus = document.createElement('button');
    btnMinus.textContent = '−';
    btnMinus.addEventListener('click', (e) => {
      e.stopPropagation();
      changeAccountCount(productId, index, -1);
    });

    const countSpan = document.createElement('span');
    countSpan.className = 'count';
    countSpan.id = `acc-count-${productId}-${index}`;
    countSpan.textContent = account.count;

    const btnPlus = document.createElement('button');
    btnPlus.textContent = '+';
    btnPlus.addEventListener('click', (e) => {
      e.stopPropagation();
      changeAccountCount(productId, index, 1);
    });

    controlsDiv.appendChild(btnMinus);
    controlsDiv.appendChild(countSpan);
    controlsDiv.appendChild(btnPlus);

    accountCard.appendChild(nameSpan);
    accountCard.appendChild(controlsDiv);
    container.appendChild(accountCard);
  });

  document.getElementById('modalOverlay').classList.add('active');
}

// ------------------------------------------------------------
// 7. ИЗМЕНЕНИЕ КОЛИЧЕСТВА (сохраняем в Firebase)
// ------------------------------------------------------------
function changeAccountCount(productId, accountIndex, delta) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const account = product.accounts[accountIndex];
  if (!account) return;

  const newCount = Math.max(0, account.count + delta);
  account.count = newCount;

  // Сохраняем весь массив в базу данных Firebase
  saveProducts(products);
  // Обновление интерфейса произойдёт автоматически через 'value'
}

// ------------------------------------------------------------
// 8. ЗАКРЫТИЕ МОДАЛКИ
// ------------------------------------------------------------
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  currentProductId = null;
}

document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModal();
  }
});