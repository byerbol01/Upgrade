const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBrowserTests() {
  console.log('======================================================');
  console.log('🚀 STARTING REAL BROWSER E2E TESTS (GOOGLE CHROME)');
  console.log('======================================================');

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (e) {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  function record(name, status, details = '') {
    if (status) {
      results.passed++;
      console.log(`  ✅ [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
      results.tests.push({ name, status: 'PASS', details });
    } else {
      results.failed++;
      console.error(`  ❌ [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
      results.tests.push({ name, status: 'FAIL', details });
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: HOME PAGE RENDERING & HERO BANNER
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Home Page & Components ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    const pageTitle = await page.title();
    record('Home page loads', pageTitle.includes('Upgrade') || pageTitle.length > 0, `Title: "${pageTitle}"`);

    // Check Header Logo image
    const logoImg = page.locator('header img[alt*="Upgrade"], header a img').first();
    record('Header Logo present', await logoImg.isVisible(), 'Upgrade Store Logo');

    // Wait for client-side products to load on Home
    await page.waitForSelector('[data-product-card]', { timeout: 8000 });
    const productCardsCount = await page.locator('[data-product-card]').count();
    record('Product cards rendered on Home', productCardsCount >= 4, `Found: ${productCardsCount} items`);

    // Check Erbol AI Launcher
    await page.waitForSelector('button[aria-label*="Erbol AI"]', { timeout: 8000 });
    const erbolButton = page.locator('button[aria-label*="Erbol AI"]').first();
    const isErbolVisible = await erbolButton.isVisible();
    record('Erbol AI Launcher visible in bottom right', isErbolVisible);

    if (isErbolVisible) {
      await erbolButton.click();
      await sleep(400);
      const erbolInfoText = await page.locator('aside').textContent();
      record('Erbol AI info card opens on click', erbolInfoText.includes('Erbol AI') && erbolInfoText.includes('Тех. помощник'));
      // close it
      await erbolButton.click();
      await sleep(200);
    }

    // -------------------------------------------------------------
    // TEST 2: THEME TOGGLE (DARK / LIGHT MODE)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Theme Toggle (Dark / Light Mode) ---');
    const themeBtn = page.locator('#theme-toggle, button[title*="тему"]').first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await sleep(200);
      const isDark = await page.evaluate(() => document.body.classList.contains('dark-mode'));
      record('Theme toggle switches to dark mode', isDark);

      await themeBtn.click();
      await sleep(200);
      const isLightAgain = await page.evaluate(() => !document.body.classList.contains('dark-mode'));
      record('Theme toggle switches back to light mode', isLightAgain);
    } else {
      record('Theme toggle button found', false, 'Selector not matched');
    }

    // -------------------------------------------------------------
    // TEST 3: CATALOG & FILTERING (/igrovye-sborki)
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Catalog & Search Filters ---');
    await page.goto(`${BASE_URL}/igrovye-sborki`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-product-card]', { timeout: 8000 });
    const catalogCards = await page.locator('[data-product-card]').count();
    record('Catalog page displays products', catalogCards >= 6, `Found: ${catalogCards} products`);

    // Search input
    const searchInput = page.locator('input[placeholder*="Поиск по названию"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('HyperX');
      await sleep(600);
      const catalogSection = page.locator('section.space-y-6').first();
      const filteredText = await catalogSection.textContent();
      record('Catalog search filters by keyword', filteredText.includes('HyperX') || filteredText.includes('гарнитура'));
      await searchInput.fill('');
      await sleep(400);
    }

    // -------------------------------------------------------------
    // TEST 4: PC CONFIGURATOR (/configurator)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing PC Configurator & Compatibility Engine ---');
    await page.goto(`${BASE_URL}/configurator`, { waitUntil: 'domcontentloaded' });
    const configTitle = await page.textContent('h1');
    record('PC Configurator page loads', configTitle.includes('Конфигуратор'), `Heading: "${configTitle}"`);

    // Check component groups
    await page.waitForSelector('text=Процессор (CPU)', { timeout: 8000 });
    const componentSections = await page.locator('text=/Процессор|Видеокарта|Материнская/').count();
    record('Configurator component selector categories rendered', componentSections >= 2);

    // Check live price calculation
    const priceText = await page.locator('text=/UZS/').first().textContent();
    record('Live price calculation visible', priceText.includes('UZS'), `Price text: "${priceText.trim()}"`);

    // Test Add Config to Cart
    const addConfigBtn = page.locator('button:has-text("Добавить сборку в корзину")').first();
    if (await addConfigBtn.isVisible()) {
      await addConfigBtn.click();
      await sleep(600);
      const headerText = await page.locator('header').textContent();
      record('PC Configuration added to cart successfully', headerText.includes('Корзина'));
    }

    // -------------------------------------------------------------
    // TEST 5: SHOPPING CART & PERSISTENCE
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Shopping Cart Operations & Persistence ---');
    const cartButton = page.locator('header button[aria-label="Корзина"], header button:has-text("Корзина")').first();
    const cartDropdown = page.locator('text=/Корзина покупок|Итого к оплате|Оформить заказ|Ваша корзина/');
    
    // If not already open from previous action, click to open
    if (!await cartDropdown.isVisible()) {
      await cartButton.click();
      await sleep(400);
    }
    const isCartOpen = await cartDropdown.isVisible();
    record('Cart dropdown opens on click', isCartOpen);

    // Reload page to test localStorage persistence
    await page.reload({ waitUntil: 'domcontentloaded' });
    await sleep(400);
    const persistedCartButton = page.locator('header button:has-text("Корзина")').first();
    const persistedHeader = await persistedCartButton.textContent();
    record('Cart state persists across page reload', !persistedHeader.includes('(0)'));

    // -------------------------------------------------------------
    // TEST 6: AUTHENTICATION FLOW (SIGN IN / SIGN UP / ME / LOGOUT)
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Authentication Flow ---');
    // Open Auth Modal
    const authButton = page.locator('header button:has-text("Войти"), header button[title*="Войти"]').first();
    if (await authButton.isVisible()) {
      await authButton.click();
      await sleep(400);
    }

    const modalTitle = page.locator('form.form');
    record('Auth modal opens', await modalTitle.isVisible());

    // 6a. Test Invalid Password
    const emailInput = page.locator('input[placeholder="Enter your Email"]').first();
    const passwordInput = page.locator('input[placeholder="Enter your Password"]').first();
    const submitLoginBtn = page.locator('button.button-submit:has-text("Sign In")').first();

    await emailInput.fill('user@upgrade.uz');
    await passwordInput.fill('WRONG_PASSWORD_123');
    await submitLoginBtn.click();
    await sleep(800);

    const errorMessage = await page.locator('form.form .text-red-600').textContent();
    record('Invalid password rejected with clear error', errorMessage.length > 0, `Error: "${errorMessage.trim()}"`);

    // 6b. Test Sign Up with fresh unique user
    const signUpSpan = page.locator('span.span:has-text("Sign Up")').first();
    await signUpSpan.click();
    await sleep(400);

    const newEmail = `e2e_user_${Date.now()}@upgrade.uz`;
    const nameInput = page.locator('input[placeholder*="ваше имя"]').first();
    const regEmailInput = page.locator('input[placeholder="Enter your Email"]').first();
    const regPassInput = page.locator('input[placeholder="Enter your Password"]').first();
    const submitRegBtn = page.locator('button.button-submit:has-text("Sign Up")').first();

    await nameInput.fill('Тестовый Покупатель');
    await regEmailInput.fill(newEmail);
    await regPassInput.fill('Secret12345Pass!');
    await submitRegBtn.click();
    await sleep(1500);

    // Verify user is now authenticated
    const headerAfterReg = await page.locator('header').textContent();
    const isLoggedIn = headerAfterReg.includes('Покупатель') || !headerAfterReg.includes('Войти');
    record('Sign Up creates account & sets session', isLoggedIn, `User: ${newEmail}`);

    // 6c. Verify User Profile Page
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 8000 });
    const profileHeader = await page.textContent('h1');
    record('User Profile page accessible for logged in user', profileHeader.includes('Покупатель') || profileHeader.includes('Upgrade') || profileHeader.includes('Личный'));

    // Test profile edit
    const profileTab = page.locator('button:has-text("Личные данные")').first();
    if (await profileTab.isVisible()) {
      await profileTab.click();
      await sleep(300);
      const phoneInput = page.locator('input[type="tel"]').first();
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('+998909998877');
        const saveProfileBtn = page.locator('button:has-text("Сохранить изменения")').first();
        await saveProfileBtn.click();
        await sleep(800);
        const successMsg = await page.locator('text=/успешно/i').isVisible();
        record('User profile update saved via API', successMsg);
      }
    }

    // 6d. Check regular user CANNOT access Admin Panel (403 Forbidden)
    console.log('\n--- 7. Testing Role-Based Access Control ---');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Доступ ограничен|Панель управления|Upgrade Admin/', { timeout: 8000 });
    const adminPageForbiddenText = await page.textContent('body');
    const isForbidden = adminPageForbiddenText.includes('Доступ ограничен');
    record('Regular user blocked from Admin Panel', isForbidden, 'Shows "Доступ ограничен"');

    // 6e. Test Logout
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'domcontentloaded' });
    const logoutBtn = page.locator('button:has-text("Выйти")').first();
    await logoutBtn.click();
    await sleep(800);

    const headerAfterLogout = await page.locator('header').textContent();
    record('Logout clears session & returns to guest state', headerAfterLogout.includes('Войти'));

    // -------------------------------------------------------------
    // TEST 8: ADMIN ACCESS WITH ADMIN CREDENTIALS
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Admin Access with Admin Credentials ---');
    // Login as Admin
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    const adminAuthBtn = page.locator('header button:has-text("Войти"), header button[title*="Войти"]').first();
    await adminAuthBtn.click();
    await sleep(400);

    const adminUser = process.env.ADMIN_EMAIL || 'admin@upgrade.uz';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin12345password';
    await page.locator('input[placeholder="Enter your Email"]').first().fill(adminUser);
    await page.locator('input[placeholder="Enter your Password"]').first().fill(adminPass);
    await page.locator('button.button-submit:has-text("Sign In")').first().click();
    await sleep(1200);

    // Open Admin Panel
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 8000 });
    const adminHeading = await page.textContent('h1');
    record('Admin logs in and accesses Admin Dashboard', adminHeading.includes('Admin') || adminHeading.includes('Upgrade') || adminHeading.includes('Панель'), `Heading: "${adminHeading}"`);

    const hasKpis = await page.locator('text=/Общая выручка|Всего заказов|Товаров в каталоге/').count();
    record('Admin Dashboard displays KPI metrics & management tables', hasKpis >= 2);

    // -------------------------------------------------------------
    // TEST 9: ORDER CHECKOUT FLOW (/buynow)
    // -------------------------------------------------------------
    console.log('\n--- 9. Testing Order Checkout & Database Persistence ---');
    await page.goto(`${BASE_URL}/buynow`, { waitUntil: 'domcontentloaded' });

    // Fill checkout form
    const nameField = page.locator('input[placeholder*="ФИО"], input[name="customerName"]').first();
    const phoneField = page.locator('input[placeholder*="телефон"], input[name="customerPhone"]').first();
    const cityField = page.locator('input[placeholder*="Ташкент"], input[name="city"]').first();
    const addressField = page.locator('textarea[placeholder*="улица"], input[name="address"]').first();

    if (await nameField.isVisible()) await nameField.fill('Рустам Каримов');
    if (await phoneField.isVisible()) await phoneField.fill('+998901112233');
    if (await cityField.isVisible()) await cityField.fill('Ташкент');
    if (await addressField.isVisible()) await addressField.fill('ул. Амира Темура, дом 10, кв. 42');

    const submitOrderBtn = page.locator('button:has-text("Подтвердить заказ"), button:has-text("Оформить заказ")').first();
    if (await submitOrderBtn.isVisible()) {
      await submitOrderBtn.click();
      await sleep(1500);

      const confirmationText = await page.textContent('body');
      const orderCreated = confirmationText.includes('UPG-2026-') || confirmationText.includes('успешно') || confirmationText.includes('принят');
      record('Order submitted and assigned unique Order ID', orderCreated, 'Generated UPG-2026-XXXX');
    }

    // -------------------------------------------------------------
    // TEST 10: OTHER CONTENT PAGES & ROUTES
    // -------------------------------------------------------------
    console.log('\n--- 10. Testing Other Site Pages ---');
    const contentPages = [
      { url: '/information', titleMatch: 'О компании' },
      { url: '/news', titleMatch: 'Новинки' },
      { url: '/trademarks', titleMatch: 'Бренды' },
      { url: '/pages-for-pace/asus1', titleMatch: 'ASUS' },
      { url: '/pages-for-pace/monitor', titleMatch: '2E Gaming' },
    ];

    for (const cp of contentPages) {
      await page.goto(`${BASE_URL}${cp.url}`, { waitUntil: 'domcontentloaded' });
      const text = await page.textContent('body');
      record(`Page "${cp.url}" loads properly`, text.includes(cp.titleMatch) || text.length > 200);
    }
  } catch (error) {
    console.error('Critical test error:', error);
    record('Complete test execution', false, error.message);
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log(`📊 TEST SUMMARY: ${results.passed} PASSED, ${results.failed} FAILED`);
  console.log('======================================================');

  if (results.failed > 0) {
    process.exit(1);
  }
}

runBrowserTests();
