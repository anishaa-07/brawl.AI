const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  console.log("Navigating to app...");
  await page.goto('http://localhost:5173/brawl.AI/', { waitUntil: 'networkidle2' });

  // 1. Landing Page
  console.log("Waiting for Landing Page CTA...");
  try {
      await page.waitForSelector('button, a', { timeout: 3000 });
      const btns = await page.$$('button, a');
      for (let btn of btns) {
          const text = await page.evaluate(el => el.innerText, btn);
          if (text && text.toLowerCase().includes('initialize')) {
               console.log("Clicking Initialize System...");
               await btn.click();
               break;
          }
      }
  } catch(e) { console.log(e); }

  await new Promise(r => setTimeout(r, 2000));
  
  // 2. Login Page
  try {
      console.log("Looking for Login inputs...");
      const input = await page.$('input[placeholder*="Player"]');
      if (input) {
          await input.type("TestUser");
          const enterBtn = await page.$('button[type="submit"]');
          if (enterBtn) await enterBtn.click();
      }
  } catch (e) { console.log(e); }

  await new Promise(r => setTimeout(r, 4000));
  
  // 3. Lobby Page
  console.log("Looking for Quick Battle...");
  try {
      const quickBtn = await page.waitForSelector('.cta-start-v4', { timeout: 3000 });
      if (quickBtn) {
         console.log("Found Quick Battle button, clicking...");
         await quickBtn.click();
      }
  } catch(e) {
      console.log("Could not click Quick battle.");
  }

  console.log("Waiting to see what happens on Battle Page...");
  await new Promise(r => setTimeout(r, 3000));

  await browser.close();
  console.log("Debug session complete.");
})();
