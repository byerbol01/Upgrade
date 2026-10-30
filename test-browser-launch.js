const { chromium } = require('playwright');

async function testLaunch() {
  try {
    // Try launching chrome or bundled chromium
    let browser;
    try {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
      console.log('Successfully launched installed Google Chrome');
    } catch (e) {
      console.log('Falling back to default chromium launcher...');
      browser = await chromium.launch({ headless: true });
      console.log('Successfully launched Chromium');
    }
    const page = await browser.newPage();
    await page.setContent('<h1>Upgrade 2.0 Browser Test</h1>');
    const h1 = await page.textContent('h1');
    console.log('Browser rendered:', h1);
    await browser.close();
    console.log('Browser test passed!');
  } catch (err) {
    console.error('Launch error:', err);
  }
}

testLaunch();
