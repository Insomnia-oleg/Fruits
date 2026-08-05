// Получаем ссылку на базу данных
const db = firebase.database();
const productsRef = db.ref('products');
const globalAccountsRef = db.ref('globalAccounts');

let products = [];
let globalAccounts = []; // массив имён аккаунтов

// ------------------------------------------------------------
// Нормализация ссылок на картинки
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
// ЗАГРУЗКА ГЛОБАЛЬНЫХ АККАУНТОВ
// ------------------------------------------------------------
globalAccountsRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data && Array.isArray(data) && data.length > 0) {
    globalAccounts = data;
  } else {
    // Если нет – создаём начальные
    globalAccounts = ['Руслан', 'Миша', 'Гера', 'Дима'];
    globalAccountsRef.set(globalAccounts);
  }
  // После обновления аккаунтов синхронизируем с товарами
  syncAccountsWithProducts();
});

// ------------------------------------------------------------
// МИГРАЦИЯ СТАРЫХ ДАННЫХ (из accounts в counts)
// ------------------------------------------------------------
function migrateOldData() {
  let changed = false;
  products.forEach(product => {
    // Если есть поле accounts (массив) и нет counts – конвертируем
    if (product.accounts && Array.isArray(product.accounts) && !product.counts) {
      const counts = {};
      product.accounts.forEach(acc => {
        counts[acc.name] = acc.count || 0;
      });
      product.counts = counts;
      delete product.accounts;
      changed = true;
    }
    // Если нет ни accounts, ни counts – создаём пустой counts
    if (!product.counts) {
      product.counts = {};
      changed = true;
    }
  });
  return changed;
}

// ------------------------------------------------------------
// СИНХРОНИЗАЦИЯ: добавляем недостающие аккаунты в каждый товар
// ------------------------------------------------------------
function syncAccountsWithProducts() {
  if (!products.length) return;
  // Сначала мигрируем старые данные
  const migrated = migrateOldData();
  if (migrated) {
    saveProducts(products);
  }

  // Теперь добавляем недостающие аккаунты из глобального списка
  let changed = false;
  products.forEach(product => {
    if (!product.counts) product.counts = {};
    globalAccounts.forEach(accName => {
      if (!(accName in product.counts)) {
        product.counts[accName] = 0;
        changed = true;
      }
    });
  });

  // Если глобальный список пуст – создаём из всех имён, которые есть в товарах
  if (globalAccounts.length === 0) {
    const allNames = new Set();
    products.forEach(product => {
      if (product.counts) {
        Object.keys(product.counts).forEach(name => allNames.add(name));
      }
    });
    if (allNames.size > 0) {
      globalAccounts = Array.from(allNames);
      globalAccountsRef.set(globalAccounts);
      changed = true;
    }
  }

  if (changed) {
    saveProducts(products);
  }
  // Перерисовываем каталог
  renderCatalog();
  if (currentProductId !== null) {
    openModal(currentProductId);
  }
}

// ------------------------------------------------------------
// 1. ЗАГРУЗКА ТОВАРОВ
// ------------------------------------------------------------
productsRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    products = Object.values(data);
    products.sort((a, b) => a.id - b.id);
  } else {
    // Если товаров нет – создаём начальные (с учётом globalAccounts)
    products = getDefaultProducts();
    saveProducts(products);
  }
  // Синхронизация и миграция
  syncAccountsWithProducts();
});

// ------------------------------------------------------------
// 2. СОХРАНЕНИЕ ТОВАРОВ
// ------------------------------------------------------------
function saveProducts(data) {
  const obj = {};
  data.forEach(item => {
    // Убеждаемся, что поле counts есть (для новых товаров)
    if (!item.counts) item.counts = {};
    obj[item.id] = item;
  });
  productsRef.set(obj);
}

// ------------------------------------------------------------
// 3. НАЧАЛЬНЫЕ ТОВАРЫ (создаются с текущими глобальными аккаунтами)
// ------------------------------------------------------------
function getDefaultProducts() {
  const accs = globalAccounts.length ? globalAccounts : ['Руслан', 'Миша', 'Гера', 'Дима'];
  const createCounts = () => {
    const counts = {};
    accs.forEach(name => { counts[name] = 0; });
    return counts;
  };

  return [
    {
      id: 1,
      name: 'Лайтнинг',
      image: 'images/LightningB.webp',
      counts: createCounts()
    },
    {
      id: 2,
      name: 'Pain',
      image: 'images/PainB.webp',
      counts: createCounts()
    },
    {
      id: 3,
      name: 'Будда',
      image: 'images/BuddhaB.webp',
      counts: createCounts()
    },
    {
      id: 4,
      name: 'Контроль',
      image: 'images/ControlB.webp',
      counts: createCounts()
    },
    {
      id: 5,
      name: 'Гравитация',
      image: 'images/GravityB.webp',
      counts: createCounts()
    },
    {
      id: 6,
      name: 'Газ',
      image: 'images/GasB.webp',
      counts: createCounts()
    },
    {
      id: 7,
      name: 'Тесто',
      image: 'images/DoughB.webp',
      counts: createCounts()
    },
    {
      id: 8,
      name: 'Яд',
      image: 'images/VenomB.webp',
      counts: createCounts()
    },
    {
      id: 9,
      name: 'Портал',
      image: 'images/PortalB.webp',
      counts: createCounts()
    },
    {
      id: 10,
      name: 'Кицуне',
      image: 'images/KitsuneB.webp',
      counts: createCounts()
    },
    {
      id: 11,
      name: 'Дракон',
      image: 'images/DragonB.webp',
      counts: createCounts()
    },
    {
      id: 12,
      name: 'Йети',
      image: 'images/YetiFruitB.webp',
      counts: createCounts()
    },
    {
      id: 13,
      name: 'Геймпас',
      image: normalizeImageUrl('https://static.wikia.nocookie.net/blox-fruits/images/e/e7/DragonB.png/revision/latest/scale-to-width-down/110?cb=20241216070050&path-prefix=ru'),
      counts: createCounts()
    },
    {
      id: 14,
      name: 'Мамонт',
      image: 'images/MammothB.webp',
      counts: createCounts()
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

    const imageSrc = product.image ? normalizeImageUrl(product.image) : 'https://via.placeholder.com/150x120/cccccc/000?text=Нет+картинки';

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
// 5. ПОДСЧЁТ ОБЩЕГО КОЛИЧЕСТВА
// ------------------------------------------------------------
function getTotalCount(product) {
  if (!product.counts) return 0;
  return Object.values(product.counts).reduce((sum, val) => sum + val, 0);
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
  if (!product.counts) product.counts = {};

  const container = document.getElementById('accountsContainer');
  container.innerHTML = '';

  // Проходим по глобальному списку, чтобы порядок был единым
  globalAccounts.forEach((accName) => {
    const count = product.counts[accName] !== undefined ? product.counts[accName] : 0;

    const accountCard = document.createElement('div');
    accountCard.className = 'account-card';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = accName;

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'controls';

    const btnMinus = document.createElement('button');
    btnMinus.textContent = '−';
    btnMinus.addEventListener('click', (e) => {
      e.stopPropagation();
      changeAccountCount(productId, accName, -1);
    });

    const countSpan = document.createElement('span');
    countSpan.className = 'count';
    countSpan.id = `acc-count-${productId}-${accName}`;
    countSpan.textContent = count;

    const btnPlus = document.createElement('button');
    btnPlus.textContent = '+';
    btnPlus.addEventListener('click', (e) => {
      e.stopPropagation();
      changeAccountCount(productId, accName, 1);
    });

    const deleteAccountBtn = document.createElement('button');
    deleteAccountBtn.className = 'delete-account-btn';
    deleteAccountBtn.textContent = '×';
    deleteAccountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteGlobalAccount(accName);
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
function changeAccountCount(productId, accountName, delta) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  if (!product.counts) product.counts = {};
  const current = product.counts[accountName] || 0;
  const newCount = Math.max(0, current + delta);
  product.counts[accountName] = newCount;
  saveProducts(products);
}

// ------------------------------------------------------------
// 8. ДОБАВЛЕНИЕ НОВОГО АККАУНТА (глобально)
// ------------------------------------------------------------
function addGlobalAccount(accountName) {
  if (!accountName || accountName.trim() === '') {
    alert('Введите имя аккаунта');
    return;
  }
  const name = accountName.trim();
  if (globalAccounts.includes(name)) {
    alert('Аккаунт с таким именем уже существует');
    return;
  }

  // Добавляем в глобальный список
  globalAccounts.push(name);
  globalAccountsRef.set(globalAccounts);

  // Добавляем этот аккаунт во все товары (с нулём)
  products.forEach(product => {
    if (!product.counts) product.counts = {};
    product.counts[name] = 0;
  });
  saveProducts(products);
  // Интерфейс обновится через события
}

// ------------------------------------------------------------
// 9. УДАЛЕНИЕ АККАУНТА (глобально)
// ------------------------------------------------------------
function deleteGlobalAccount(accountName) {
  if (!confirm(`Вы уверены, что хотите удалить аккаунт "${accountName}" из всех товаров?`)) return;

  // Удаляем из глобального списка
  const index = globalAccounts.indexOf(accountName);
  if (index === -1) return;
  globalAccounts.splice(index, 1);
  globalAccountsRef.set(globalAccounts);

  // Удаляем это поле из всех товаров
  products.forEach(product => {
    if (product.counts) {
      delete product.counts[accountName];
    }
  });
  saveProducts(products);
  // Интерфейс обновится
}

// ------------------------------------------------------------
// 10. ДОБАВЛЕНИЕ ТОВАРА
// ------------------------------------------------------------
function addProduct(name, image) {
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
  const newId = maxId + 1;
  const imageUrl = image ? normalizeImageUrl(image) : 'https://via.placeholder.com/150x120/cccccc/000?text=Новый+товар';

  const counts = {};
  globalAccounts.forEach(acc => { counts[acc] = 0; });

  const newProduct = {
    id: newId,
    name: name,
    image: imageUrl,
    counts: counts
  };

  products.push(newProduct);
  saveProducts(products);
}

// ------------------------------------------------------------
// 11. УДАЛЕНИЕ ТОВАРА
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
  const name = prompt('Введите имя нового аккаунта (будет добавлен ко всем товарам):', 'Новый аккаунт');
  if (name !== null) {
    addGlobalAccount(name);
  }
});

document.getElementById('addProductModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('addProductModal')) {
    document.getElementById('addProductModal').classList.remove('active');
  }
});
