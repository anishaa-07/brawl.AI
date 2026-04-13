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
  await page.goto('http://127.0.0.1:5173/brawl.AI/', { waitUntil: 'networkidle2' });

  // Simulate picking username "Player" if prompts exist
  // We'll wait for the Quick battle button
  console.log("Waiting for app to boot and UI to render...");
  await new Promise(r => setTimeout(r, 2000));

  try {
    const quickBattleBtn = await page.waitForSelector('.cta-start-v4', { timeout: 3000 });
    if (quickBattleBtn) {
       console.log("Clicking 'Quick Battle' button...");
       await quickBattleBtn.click();
    } else {
       console.log("No quick battle button found. Maybe it's random battle?");
    }
  } catch(e) {
    console.log("Could not find quick battle button. Looking for random battle or other modes.");
    const altBtn = await page.$('.cta-start-v4');
    if (altBtn) {
        await altBtn.click();
    } else {
      console.log("No CTA found.");
    }
  }

  console.log("Waiting for potential crash log...");
  await new Promise(r => setTimeout(r, 3000));

  await browser.close();
  console.log("Debug session complete.");
})();
