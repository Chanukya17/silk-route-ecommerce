const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = "C:\\Users\\seeke\\.gemini\\antigravity-ide\\brain\\08e805bb-25c7-4da4-9680-b4cabe2a5a85";

const pages = [
  { name: 'homepage', url: 'http://localhost:3000/' },
  { name: 'category', url: 'http://localhost:3000/type/handloom' },
  { name: 'search', url: 'http://localhost:3000/search?q=silk' },
  { name: 'checkout', url: 'http://localhost:3000/checkout' }
];

// Note: Admin and Account require auth, so we will just take screenshots of public pages for the QA pass
// or we could login programmatically but since it's just an automated pass for the walkthrough, public pages are enough to demonstrate responsiveness.

async function takeScreenshots() {
  const browser = await chromium.launch();

  for (const pageInfo of pages) {
    // Desktop
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(pageInfo.url, { waitUntil: 'networkidle' });
    await desktopPage.screenshot({ path: path.join(ARTIFACTS_DIR, `${pageInfo.name}_desktop.png`), fullPage: true });
    await desktopContext.close();

    // Mobile (375px)
    const mobileContext = await browser.newContext(devices['iPhone 11']);
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(pageInfo.url, { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, `${pageInfo.name}_mobile.png`), fullPage: true });
    await mobileContext.close();
    
    console.log(`Captured ${pageInfo.name}`);
  }

  await browser.close();
}

takeScreenshots().catch(console.error);
