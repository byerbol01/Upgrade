const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Upgrade database...');

  // 1. Create Admin user if ADMIN_PASSWORD environment variable is provided
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@upgrade.uz';
  const adminRawPassword = process.env.ADMIN_PASSWORD;

  if (adminRawPassword) {
    const adminPassword = await bcrypt.hash(adminRawPassword, 10);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: adminPassword,
        role: 'ADMIN',
      },
      create: {
        email: adminEmail,
        password: adminPassword,
        name: 'Upgrade Administrator',
        phone: '+998 99 124-24-24',
        address: 'г. Ташкент, ул. Навои 37',
        role: 'ADMIN',
      },
    });
    console.log(`Admin user configured for: ${admin.email}`);
  } else {
    console.log('Notice: ADMIN_PASSWORD not set in environment. Skipping automatic admin user creation for security.');
  }

  // 2. Clear and seed products
  await prisma.product.deleteMany({});
  
  const products = [
    {
      id: 'prod-mon-1',
      title: '2E Gaming R2723BV 27" 165Hz VA (Curved)',
      slug: 'monitor',
      description: 'Изогнутый игровой монитор 2E Gaming R2723BV с диагональю 27 дюймов, частотой обновления 165 Гц и радиусом кривизны 1500R.',
      price: 2019000,
      oldPrice: 2350000,
      category: 'monitors',
      brand: '2E Gaming',
      inStock: true,
      stockCount: 15,
      rating: 4.9,
      reviewsCount: 38,
      image: '/images/monitor.webp',
      images: JSON.stringify(['/images/monitor.webp', '/images/monitor2.webp', '/images/monitor-3.webp', '/images/monitor-4.webp']),
      specs: JSON.stringify({
        'Диагональ экрана': '27 дюймов',
        'Частота обновления': '165 Гц',
        'Тип матрицы': 'VA (Curved 1500R)',
        'Разрешение': '1920x1080 (Full HD)',
      }),
      featured: true,
      isNew: false,
    },
    {
      id: 'prod-laptop-1',
      title: 'ASUS Zenbook 14 OLED UX3405CA-PZ541W Korean Layout',
      slug: 'asus1',
      description: 'Ультрабук премиального уровня с 14-дюймовым OLED-дисплеем 3K 120 Гц, процессором Intel Core Ultra и инновационным тонким корпусом.',
      price: 13310000,
      oldPrice: 14500000,
      category: 'laptops',
      brand: 'Asus',
      inStock: true,
      stockCount: 8,
      rating: 4.8,
      reviewsCount: 12,
      image: '/images/asus1.webp',
      images: JSON.stringify(['/images/asus1.webp', '/images/asus2.webp', '/images/asus3.webp', '/images/asus4.webp']),
      specs: JSON.stringify({
        'Процессор': 'Intel Core Ultra 7 155H (16 ядер)',
        'Оперативная память': '16GB LPDDR5X',
        'Накопитель': '1TB PCIe 4.0 NVMe SSD',
        'Экран': '14.0" 3K OLED 120Hz',
      }),
      featured: true,
      isNew: true,
    },
    {
      id: 'prod-laptop-2',
      title: 'Asus GAMING V16 V3607VM-RP005 Korean Layout',
      slug: 'asus2',
      description: 'Мощный игровой ноутбук Asus Gaming V16 на базе современного процессора и графики NVIDIA GeForce RTX 40-й серии.',
      price: 16170000,
      oldPrice: 17800000,
      category: 'laptops',
      brand: 'Asus',
      inStock: true,
      stockCount: 5,
      rating: 4.9,
      reviewsCount: 19,
      image: '/images/monitor2.webp',
      images: JSON.stringify(['/images/monitor2.webp', '/images/asus6.webp', '/images/asus7.webp', '/images/asus8.webp']),
      specs: JSON.stringify({
        'Процессор': 'Intel Core i7-13620H',
        'Оперативная память': '16GB DDR5',
        'Видеокарта': 'NVIDIA GeForce RTX 4060 8GB',
        'Экран': '16.0" WUXGA 165Hz',
      }),
      featured: true,
      isNew: true,
    },
    {
      id: 'prod-laptop-3',
      title: 'ASUS Zenbook 14 OLED UX3405CA-PZ541W (Space Edition)',
      slug: 'asus3',
      description: 'Эксклюзивная версия ультрабука ASUS Zenbook 14 OLED с футуристичным дизайном и непревзойденной автономностью.',
      price: 13845000,
      oldPrice: 15200000,
      category: 'laptops',
      brand: 'Asus',
      inStock: true,
      stockCount: 6,
      rating: 5.0,
      reviewsCount: 15,
      image: '/images/asus3.webp',
      images: JSON.stringify(['/images/asus3.webp', '/images/asus9.webp', '/images/asus10.webp']),
      specs: JSON.stringify({
        'Процессор': 'Intel Core Ultra 7 155H',
        'Оперативная память': '32GB LPDDR5X',
        'Накопитель': '1TB SSD',
      }),
      featured: true,
      isNew: false,
    },
    {
      id: 'prod-pc-1',
      title: 'UPGRADE GAMING MASTER: Core i5-13400F / RTX 4060 / 16GB / 1TB SSD',
      slug: 'pc-master',
      description: 'Оптимальная игровая сборка для игр в 1080p и 1440p на максимальных настройках с гарантией 1 год.',
      price: 9850000,
      oldPrice: 10800000,
      category: 'gaming-pc',
      brand: 'UPGRADE',
      inStock: true,
      stockCount: 10,
      rating: 5.0,
      reviewsCount: 42,
      image: '/images/mt1.webp',
      images: JSON.stringify(['/images/mt1.webp', '/images/corusel1.png']),
      specs: JSON.stringify({
        'Процессор': 'Intel Core i5-13400F',
        'Видеокарта': 'NVIDIA GeForce RTX 4060 8GB',
        'Оперативная память': '16GB DDR5',
        'Накопитель': '1TB M.2 NVMe',
      }),
      featured: true,
      isNew: true,
    },
    {
      id: 'prod-pc-2',
      title: 'UPGRADE GAMING PRO: Core i7-14700F / RTX 4070 Ti / 32GB / 2TB SSD',
      slug: 'pc-pro',
      description: 'Высокопроизводительный игровой ПК для киберспорта и 4K-гейминга, рендеринга и работы с графикой.',
      price: 18900000,
      oldPrice: 20500000,
      category: 'gaming-pc',
      brand: 'UPGRADE',
      inStock: true,
      stockCount: 4,
      rating: 5.0,
      reviewsCount: 27,
      image: '/images/mt2.webp',
      images: JSON.stringify(['/images/mt2.webp']),
      specs: JSON.stringify({
        'Процессор': 'Intel Core i7-14700F',
        'Видеокарта': 'NVIDIA GeForce RTX 4070 Ti 16GB',
        'Оперативная память': '32GB DDR5 6000MHz',
        'Накопитель': '2TB Gen4 SSD',
      }),
      featured: true,
      isNew: false,
    },
    {
      id: 'prod-pc-3',
      title: 'UPGRADE ULTRA EXTREME: Ryzen 7 7800X3D / RTX 4080 Super / 32GB',
      slug: 'pc-extreme',
      description: 'Ультимативная игровая машина с лучшим игровым процессором AMD Ryzen 7 7800X3D.',
      price: 26500000,
      oldPrice: 28900000,
      category: 'gaming-pc',
      brand: 'UPGRADE',
      inStock: true,
      stockCount: 3,
      rating: 5.0,
      reviewsCount: 18,
      image: '/images/mt3.webp',
      images: JSON.stringify(['/images/mt3.webp']),
      specs: JSON.stringify({
        'Процессор': 'AMD Ryzen 7 7800X3D',
        'Видеокарта': 'NVIDIA GeForce RTX 4080 Super 16GB',
        'Оперативная память': '32GB DDR5 6000MHz',
      }),
      featured: true,
      isNew: true,
    },
    {
      id: 'prod-acc-1',
      title: 'Кронштейн для монитора Brateck Heavy-Duty Gas Spring',
      slug: 'brateck-mount',
      description: 'Настольный кронштейн с газлифтом для мониторов диагональю до 35 дюймов и весом до 15 кг.',
      price: 1089000,
      oldPrice: 1250000,
      category: 'accessories',
      brand: 'Brateck',
      inStock: true,
      stockCount: 25,
      rating: 4.9,
      reviewsCount: 65,
      image: '/images/box.png',
      images: JSON.stringify(['/images/box.png']),
      specs: JSON.stringify({
        'Диагональ': '17"-35"',
        'Нагрузка': 'до 15 кг',
        'VESA': '75x75, 100x100',
      }),
      featured: true,
      isNew: false,
    },
    {
      id: 'prod-acc-2',
      title: 'Студийный свет Grava star RGB Ambient Light',
      slug: 'gravastar-light',
      description: 'Футуристичная настольная лампа со стильным мех-дизайном и управляемой подсветкой RGB.',
      price: 799000,
      oldPrice: 950000,
      category: 'accessories',
      brand: 'Grava star',
      inStock: true,
      stockCount: 18,
      rating: 5.0,
      reviewsCount: 31,
      image: '/images/cave.webp',
      images: JSON.stringify(['/images/cave.webp']),
      specs: JSON.stringify({
        'Режимы': '16.8 млн цветов RGB',
        'Материал': 'Металл + ABS',
      }),
      featured: true,
      isNew: true,
    },
    {
      id: 'prod-kb-1',
      title: 'Механическая клавиатура HyperX Alloy Origins RGB',
      slug: 'hyperx-alloy',
      description: 'Надежная механическая клавиатура в алюминиевом корпусе с фирменными свитчами HyperX.',
      price: 1150000,
      oldPrice: 1350000,
      category: 'keyboards',
      brand: 'HyperX',
      inStock: true,
      stockCount: 14,
      rating: 4.9,
      reviewsCount: 52,
      image: '/images/klavish.webp',
      images: JSON.stringify(['/images/klavish.webp']),
      specs: JSON.stringify({
        'Тип': 'Механическая',
        'Свитчи': 'HyperX Aqua',
        'Материал': 'Алюминий',
      }),
      featured: true,
      isNew: false,
    },
    {
      id: 'prod-mouse-1',
      title: 'Беспроводная мышь Logitech G Pro X Superlight White',
      slug: 'logitech-superlight',
      description: 'Сверхлегкая беспроводная мышь весом менее 63 граммов с датчиком HERO 25K.',
      price: 1420000,
      oldPrice: 1650000,
      category: 'mice',
      brand: 'Logitech',
      inStock: true,
      stockCount: 22,
      rating: 5.0,
      reviewsCount: 88,
      image: '/images/mishka1.webp',
      images: JSON.stringify(['/images/mishka1.webp']),
      specs: JSON.stringify({
        'Сенсор': 'HERO 25K',
        'Вес': '63 г',
        'Автономность': 'до 70 ч',
      }),
      featured: true,
      isNew: true,
    },
    {
      id: 'prod-audio-1',
      title: 'Беспроводная гарнитура HyperX Cloud II Wireless 7.1',
      slug: 'hyperx-cloud-2',
      description: 'Легендарная гарнитура с объемным звуком 7.1 и автономностью до 30 часов.',
      price: 1650000,
      oldPrice: 1890000,
      category: 'accessories',
      brand: 'HyperX',
      inStock: true,
      stockCount: 12,
      rating: 4.9,
      reviewsCount: 76,
      image: '/images/naushnik.webp',
      images: JSON.stringify(['/images/naushnik.webp']),
      specs: JSON.stringify({
        'Динамики': '53 мм',
        'Звук': '7.1 Virtual Surround',
        'Связь': '2.4 GHz',
      }),
      featured: true,
      isNew: false,
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`Seeded ${products.length} products.`);

  // 3. Clear and seed PC components
  await prisma.pCComponent.deleteMany({});
  const components = [
    { id: 'cpu-1', type: 'cpu', name: 'Intel Core i5-14400F', price: 2250000, brand: 'Intel', socket: 'LGA1700', powerUsage: 65, inStock: true },
    { id: 'cpu-2', type: 'cpu', name: 'Intel Core i7-14700F', price: 4350000, brand: 'Intel', socket: 'LGA1700', powerUsage: 125, inStock: true },
    { id: 'cpu-3', type: 'cpu', name: 'AMD Ryzen 5 7600', price: 2400000, brand: 'AMD', socket: 'AM5', powerUsage: 65, inStock: true },
    { id: 'cpu-4', type: 'cpu', name: 'AMD Ryzen 7 7800X3D', price: 5100000, brand: 'AMD', socket: 'AM5', powerUsage: 120, inStock: true },

    { id: 'mb-1', type: 'motherboard', name: 'ASUS PRIME B760-PLUS DDR5', price: 1850000, brand: 'Asus', socket: 'LGA1700', ramType: 'DDR5', inStock: true },
    { id: 'mb-2', type: 'motherboard', name: 'MSI MAG B760 TOMAHAWK DDR4', price: 2100000, brand: 'MSI', socket: 'LGA1700', ramType: 'DDR4', inStock: true },
    { id: 'mb-3', type: 'motherboard', name: 'ASUS TUF B650-PLUS WIFI DDR5', price: 2450000, brand: 'Asus', socket: 'AM5', ramType: 'DDR5', inStock: true },
    { id: 'mb-4', type: 'motherboard', name: 'GIGABYTE B650M DS3H DDR5', price: 1700000, brand: 'Gigabyte', socket: 'AM5', ramType: 'DDR5', inStock: true },

    { id: 'ram-1', type: 'ram', name: 'Kingston Fury Beast 16GB (2x8) DDR4', price: 550000, brand: 'Kingston', ramType: 'DDR4', capacity: '16GB', inStock: true },
    { id: 'ram-2', type: 'ram', name: 'Kingston Fury Beast 32GB (2x16) DDR5', price: 1550000, brand: 'Kingston', ramType: 'DDR5', capacity: '32GB', inStock: true },

    { id: 'gpu-1', type: 'gpu', name: 'GeForce RTX 4060 8GB GDDR6', price: 3900000, brand: 'NVIDIA', powerUsage: 115, inStock: true },
    { id: 'gpu-2', type: 'gpu', name: 'GeForce RTX 4070 Super 12GB GDDR6X', price: 7900000, brand: 'NVIDIA', powerUsage: 220, inStock: true },
    { id: 'gpu-3', type: 'gpu', name: 'GeForce RTX 4080 Super 16GB GDDR6X', price: 14500000, brand: 'NVIDIA', powerUsage: 320, inStock: true },

    { id: 'ssd-1', type: 'ssd', name: 'Kingston NV2 1TB M.2 PCIe 4.0', price: 820000, brand: 'Kingston', capacity: '1TB', inStock: true },
    { id: 'ssd-2', type: 'ssd', name: 'Samsung 980 Pro 1TB M.2 NVMe', price: 1250000, brand: 'Samsung', capacity: '1TB', inStock: true },

    { id: 'psu-1', type: 'psu', name: 'DeepCool PF600 600W 80+', price: 580000, brand: 'DeepCool', wattage: 600, inStock: true },
    { id: 'psu-2', type: 'psu', name: 'DeepCool PK750D 750W 80+ Bronze', price: 890000, brand: 'DeepCool', wattage: 750, inStock: true },
    { id: 'psu-3', type: 'psu', name: 'be quiet! Pure Power 12 M 850W Gold', price: 1650000, brand: 'be quiet!', wattage: 850, inStock: true },

    { id: 'case-1', type: 'case', name: 'DeepCool CC560 V2 ARGB Black', price: 650000, brand: 'DeepCool', inStock: true },
    { id: 'case-2', type: 'case', name: 'Lian Li O11 Dynamic EVO Black', price: 2200000, brand: 'Lian Li', inStock: true },
  ];

  for (const c of components) {
    await prisma.pCComponent.create({ data: c });
  }
  console.log(`Seeded ${components.length} PC components.`);

  // 4. Create sample order for test user
  await prisma.order.deleteMany({});
  await prisma.order.create({
    data: {
      orderNumber: 'UPG-2026-0001',
      userId: testUser.id,
      customerName: 'Шохрух Тест',
      customerEmail: 'user@upgrade.uz',
      customerPhone: '+998 90 987-65-43',
      city: 'г. Ташкент',
      address: 'Юнусабад 14, кв. 22',
      deliveryNotes: 'Позвонить перед доставкой',
      deliveryMethod: 'STANDARD',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      status: 'PROCESSING',
      totalAmount: 2019000,
      itemsJson: JSON.stringify([
        {
          id: 'prod-mon-1',
          title: '2E Gaming R2723BV 27" 165Hz VA (Curved)',
          price: 2019000,
          quantity: 1,
          image: '/images/monitor.webp',
        },
      ]),
    },
  });

  console.log('Sample order seeded.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
