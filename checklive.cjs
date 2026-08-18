const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));
  await page.goto('https://yassine.gzeed.com/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'C:/Users/hp/AppData/Local/Temp/claude/c--Users-hp-Downloads-BEYA/232cd9c0-5ce7-4f5d-96fb-314b04eacff4/scratchpad/livestore.png' });
  console.log('title:', await page.title());
  console.log('url:', page.url());
  console.log('errors:', errors);
  await browser.close();
})();
