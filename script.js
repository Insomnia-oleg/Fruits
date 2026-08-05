// Получаем ссылку на базу данных
const db = firebase.database();
const productsRef = db.ref('products');

let products = [];

// ------------------------------------------------------------
// НОВАЯ ФУНКЦИЯ: Нормализация ссылок на картинки
// ------------------------------------------------------------
function normalizeImageUrl(url) {
  if (!url) return url;
  if (url.includes('images.weserv.nl')) return url;
  if (url.includes('wikia.nocookie.net') || url.includes('fandom.com') || url.includes('fandom')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
  }
  return url;
}

// ------------------------------------------------------------
// 1. СЛУШАЕМ ИЗМЕНЕНИЯ В БАЗЕ
// ------------------------------------------------------------
productsRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    products = Object.values(data);
    products.sort((a, b) => a.id - b.id);
  } else {
    products = getDefaultProducts();
    saveProducts(products);
  }
  renderCatalog();
  if (currentProductId !== null) {
    openModal(currentProductId);
  }
});

// ------------------------------------------------------------
// 2. СОХРАНЕНИЕ В БАЗУ
// ------------------------------------------------------------
function saveProducts(data) {
  const obj = {};
  data.forEach(item => {
    obj[item.id] = item;
  });
  productsRef.set(obj);
}

// ------------------------------------------------------------
// 3. НАЧАЛЬНЫЕ ДАННЫЕ (14 товаров) с нормализацией
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
      image: normalizeImageUrl('https://static.wikia.nocookie.net/blox-fruits/images/e/e7/DragonB.png/revision/latest/scale-to-width-down/110?cb=20241216070050&path-prefix=ru'),
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
// 4. ОТРИСОВКА КАТАЛОГА (с кнопкой удаления)
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

    // Используем нормализованную ссылку (она уже сохранена в БД, но на всякий случай)
    const imageSrc = product.image || 'https://via.placeholder.com/150x120/cccccc/000?text=Нет+картинки';
    card.innerHTML = `
      <img src="${imageSrc}" alt="${product.name}" referrerpolicy="no-referrer" />
      <h3>${product.name}</h3>
      <button class="delete-product-btn" data-product-id="${product.id}">🗑 Удалить</button>
      <div class="total">Всего: <span id="total-${product.id}">${total}</span> шт.</div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-product-btn')) return;
      openModal(product.id);
    });

    const deleteBtn = card.querySelector('.delete-product-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteProduct(product.id);
    });

    catalog.appendChild(card);
  });
}

// ------------------------------------------------------------
// 5. ВСПОМОГАТЕЛЬНЫЕ
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
  renderAccounts(productId);
  document.getElementById('modalOverlay').classList.add('active');
}

function renderAccounts(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

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

    const deleteAccountBtn = document.createElement('button');
    deleteAccountBtn.className = 'delete-account-btn';
    deleteAccountBtn.textContent = '×';
    deleteAccountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteAccount(productId, index);
    });

    controlsDiv.appendChild(btnMinus);
    controlsDiv.appendChild(countSpan);
    controlsDiv.appendChild(btnPlus);
    controlsDiv.appendChild(deleteAccountBtn);

    accountCard.appendChild(nameSpan);
    accountCard.appendChild(controlsDiv);
    container.appendChild(accountCard);
  });
}

// ------------------------------------------------------------
// 7. ИЗМЕНЕНИЕ КОЛИЧЕСТВА
// ------------------------------------------------------------
function changeAccountCount(productId, accountIndex, delta) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const account = product.accounts[accountIndex];
  if (!account) return;
  const newCount = Math.max(0, account.count + delta);
  account.count = newCount;
  saveProducts(products);
}

// ------------------------------------------------------------
// 8. ДОБАВЛЕНИЕ АККАУНТА
// ------------------------------------------------------------
function addAccountToProduct(productId, accountName) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  if (!accountName || accountName.trim() === '') {
    alert('Введите имя аккаунта');
    return;
  }
  product.accounts.push({ name: accountName.trim(), count: 0 });
  saveProducts(products);
}

// ------------------------------------------------------------
// 9. ДОБАВЛЕНИЕ ТОВАРА (с нормализацией ссылки)
// ------------------------------------------------------------
function addProduct(name, image) {
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
  const newId = maxId + 1;
  const imageUrl = image ? normalizeImageUrl(image) : 'https://via.placeholder.com/150x120/cccccc/000?text=Новый+товар';

  const newProduct = {
    id: newId,
    name: name,
    image: imageUrl,
    accounts: [
      { name: 'Руслан', count: 0 },
      { name: 'Миша', count: 0 },
      { name: 'Гера', count: 0 },
      { name: 'Дима', count: 0 }
    ]
  };

  products.push(newProduct);
  saveProducts(products);
}

// ------------------------------------------------------------
// 10. УДАЛЕНИЕ ТОВАРА
// ------------------------------------------------------------
function deleteProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  if (confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
    products = products.filter(p => p.id !== productId);
    saveProducts(products);
    if (currentProductId === productId) closeModal();
  }
}

// ------------------------------------------------------------
// 11. УДАЛЕНИЕ АККАУНТА
// ------------------------------------------------------------
function deleteAccount(productId, accountIndex) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const account = product.accounts[accountIndex];
  if (!account) return;
  if (confirm(`Вы уверены, что хотите удалить аккаунт "${account.name}"?`)) {
    product.accounts.splice(accountIndex, 1);
    saveProducts(products);
  }
}

// ------------------------------------------------------------
// 12. ЗАКРЫТИЕ МОДАЛКИ
// ------------------------------------------------------------
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  currentProductId = null;
}

document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// ------------------------------------------------------------
// 13. ОБРАБОТЧИКИ КНОПОК
// ------------------------------------------------------------
document.getElementById('addProductBtn').addEventListener('click', () => {
  document.getElementById('addProductModal').classList.add('active');
});

document.getElementById('cancelProductBtn').addEventListener('click', () => {
  document.getElementById('addProductModal').classList.remove('active');
  document.getElementById('newProductName').value = '';
  document.getElementById('newProductImage').value = '';
});

document.getElementById('saveProductBtn').addEventListener('click', () => {
  const name = document.getElementById('newProductName').value.trim();
  const image = document.getElementById('newProductImage').value.trim();
  if (!name) {
    alert('Введите название товара');
    return;
  }
  addProduct(name, image);
  document.getElementById('addProductModal').classList.remove('active');
  document.getElementById('newProductName').value = '';
  document.getElementById('newProductImage').value = '';
});

document.getElementById('addAccountBtn').addEventListener('click', () => {
  if (currentProductId === null) return;
  const name = prompt('Введите имя нового аккаунта:', 'Новый аккаунт');
  if (name !== null) {
    addAccountToProduct(currentProductId, name);
  }
});

document.getElementById('addProductModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('addProductModal')) {
    document.getElementById('addProductModal').classList.remove('active');
  }
});
