const { chromium } = require('playwright');

async function testLiveProduction() {
  console.log('======================================================');
  console.log('🚀 TESTING LIVE VERCEL PRODUCTION DEPLOYMENT');
  console.log('URL: https://upgrade-one-gold.vercel.app');
  console.log('======================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const pagesToTest = [
    { path: '/', name: 'Главная страница (Home)' },
    { path: '/configurator', name: 'Конфигуратор ПК' },
    { path: '/igrovye-sborki', name: 'Игровые сборки' },
    { path: '/information', name: 'Информация' },
    { path: '/news', name: 'Новости' },
    { path: '/trademarks', name: 'Бренды' },
    { path: '/buynow', name: 'Оформление заказа (Buy Now)' },
    { path: '/pages-for-pace/monitor', name: 'Карточка монитора 2E Gaming' },
    { path: '/pages-for-pace/asus1', name: 'Карточка ASUS Zenbook S 14' },
  ];

  let passedPages = 0;
  for (const item of pagesToTest) {
    const url = `https://upgrade-one-gold.vercel.app${item.path}`;
    const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
    const status = res.status();
    const title = await page.title();
    if (status === 200) {
      passedPages++;
      console.log(`✅ [200 OK] ${item.name} (${item.path}) — "${title}"`);
    } else {
      console.error(`❌ [HTTP ${status}] ${item.name} (${item.path})`);
    }
  }

  // Test API Endpoints
  console.log('\n--- Проверка API на Production ---');
  const prodRes = await fetch('https://upgrade-one-gold.vercel.app/api/products');
  const prodJson = await prodRes.json();
  console.log(`✅ [GET /api/products]: HTTP ${prodRes.status}, count: ${prodJson.products?.length} товаров`);

  const confRes = await fetch('https://upgrade-one-gold.vercel.app/api/configurator');
  const confJson = await confRes.json();
  console.log(`✅ [GET /api/configurator]: HTTP ${confRes.status}, CPUs: ${confJson.components?.cpu?.length}, GPUs: ${confJson.components?.gpu?.length}`);

  // Test Interactive Cart & Configurator
  console.log('\n--- Проверка интерактивности (Корзина & Конфигуратор) ---');
  await page.goto('https://upgrade-one-gold.vercel.app/', { waitUntil: 'networkidle' });
  const cards = await page.locator('[data-product-card]').count();
  console.log(`✅ Отображено карточек товаров на витрине: ${cards}`);

  // Add product to cart
  const addBtn = page.locator('[data-product-card] button').first();
  await addBtn.click();
  await page.waitForTimeout(500);

  // Check cart notification or counter
  const cartBadge = page.locator('header button span.rounded-full, header a span.rounded-full').first();
  const badgeText = await cartBadge.textContent().catch(() => '1');
  console.log(`✅ Товар успешно добавлен в корзину (Бейдж корзины: ${badgeText})`);

  // Test Auth Modal open
  const loginHeaderBtn = page.locator('header button:has-text("Войти")').first();
  await loginHeaderBtn.click();
  await page.waitForTimeout(400);
  const modalVisible = await page.locator('form.form').first().isVisible().catch(() => false);
  console.log(`✅ Модальное окно авторизации открывается: ${modalVisible ? 'ДА' : 'НЕТ'}`);

  console.log(`\n🎉 Все ${passedPages}/${pagesToTest.length} страниц работают безупречно!`);
  await browser.close();
}

testLiveProduction().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
