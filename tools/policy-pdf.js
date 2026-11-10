// Собирает PDF политики ПД из страницы policy/index.html (печатная версия).
// Запуск после python3 tools/build.py:  node tools/policy-pdf.js
// Нужен Playwright с Chromium (npm i -D playwright && npx playwright install chromium).
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'assets', 'docs', 'policy-pd.pdf');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(root, 'policy', 'index.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font-size:8px;color:#888;text-align:center;font-family:sans-serif"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
  });
  await browser.close();
  console.log('ok:', path.relative(root, out));
})();
