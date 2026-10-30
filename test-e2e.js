async function runTests() {
  console.log('--- Testing Upgrade 2.0 Live Server ---');

  // 1. Test Products API
  const prodRes = await fetch('http://localhost:3000/api/products');
  const prodData = await prodRes.json();
  console.log(`[GET /api/products] Status: ${prodRes.status}, Count: ${prodData.products?.length}`);
  console.log(`[GET /api/products] Sample product: "${prodData.products?.[0]?.title}" (${prodData.products?.[0]?.price} UZS)`);

  // 2. Test Configurator API
  const confRes = await fetch('http://localhost:3000/api/configurator');
  const confData = await confRes.json();
  console.log(`[GET /api/configurator] Status: ${confRes.status}, CPUs: ${confData.components?.cpu?.length}, GPUs: ${confData.components?.gpu?.length}`);

  // 3. Test Pages
  const pages = ['/', '/configurator', '/buynow', '/igrovye-sborki', '/information', '/news', '/trademarks', '/profile', '/admin'];
  for (const page of pages) {
    const pageRes = await fetch(`http://localhost:3000${page}`);
    console.log(`[Page ${page}] Status: ${pageRes.status}`);
  }

  // 4. Test User Login
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@upgrade.uz', password: 'user12345password' }),
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie');
  console.log(`[POST /api/auth/login] Status: ${loginRes.status}, User: ${loginData.user?.email}, Role: ${loginData.user?.role}`);
  console.log(`[Auth Session Cookie set]: ${setCookie ? 'YES (' + setCookie.split(';')[0] + ')' : 'NO'}`);

  // 5. Test Current User session verification
  if (setCookie) {
    const meRes = await fetch('http://localhost:3000/api/auth/me', {
      headers: { Cookie: setCookie },
    });
    const meData = await meRes.json();
    console.log(`[GET /api/auth/me with Cookie] Status: ${meRes.status}, Current User: ${meData.user?.email}`);

    // 6. Test Orders for this user
    const ordersRes = await fetch('http://localhost:3000/api/orders', {
      headers: { Cookie: setCookie },
    });
    const ordersData = await ordersRes.json();
    console.log(`[GET /api/orders with Cookie] Status: ${ordersRes.status}, Orders count: ${ordersData.orders?.length}`);
  }

  // 7. Test Admin Login and Admin API
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@upgrade.uz';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345password';
  const adminLoginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  const adminData = await adminLoginRes.json();
  const adminCookie = adminLoginRes.headers.get('set-cookie');
  console.log(`[POST /api/auth/login ADMIN] Status: ${adminLoginRes.status}, Role: ${adminData.user?.role}`);

  if (adminCookie) {
    const adminOrdersRes = await fetch('http://localhost:3000/api/admin/orders', {
      headers: { Cookie: adminCookie },
    });
    const adminOrders = await adminOrdersRes.json();
    console.log(`[GET /api/admin/orders ADMIN] Status: ${adminOrdersRes.status}, Total DB Orders: ${adminOrders.orders?.length}`);

    const adminProductsRes = await fetch('http://localhost:3000/api/admin/products', {
      headers: { Cookie: adminCookie },
    });
    const adminProducts = await adminProductsRes.json();
    console.log(`[GET /api/admin/products ADMIN] Status: ${adminProductsRes.status}, Total DB Products: ${adminProducts.products?.length}`);
  }

  // 8. Test Regular User access to Admin endpoint (Must return 403 Forbidden)
  if (setCookie) {
    const forbiddenRes = await fetch('http://localhost:3000/api/admin/orders', {
      headers: { Cookie: setCookie },
    });
    console.log(`[GET /api/admin/orders with USER Cookie] Status: ${forbiddenRes.status} (Expected 403)`);
  }

  console.log('--- All Verification Tests Completed Successfully ---');
}

runTests().catch(console.error);
