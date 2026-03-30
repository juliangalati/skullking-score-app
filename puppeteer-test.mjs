import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:19006';
const SCREENSHOTS_DIR = './screenshots';

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function waitForServer(url, maxWaitMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 1500));
  }
  throw new Error(`Server at ${url} did not start within ${maxWaitMs}ms`);
}

async function shot(page, name) {
  const path = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  console.log(`  ✓ ${path}`);
}

async function run() {
  console.log('Waiting for Expo web server...');
  await waitForServer(BASE_URL);
  console.log('Server ready.\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    defaultViewport: { width: 390, height: 844 },
  });

  const page = await browser.newPage();

  try {
    // 1. Home screen
    console.log('── Home Screen');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('[data-testid="home"], text/Skull King', { timeout: 10000 }).catch(() => {});
    await shot(page, '01-home');

    // 2. Click "New Game"
    console.log('── Player Setup Screen');
    await page.evaluate(() => {
      const els = [...document.querySelectorAll('*')];
      const btn = els.find(el => el.textContent?.trim() === 'New Game');
      btn?.click();
    });
    await page.waitForFunction(
      () => document.body.innerText.includes("Who's playing"),
      { timeout: 5000 }
    ).catch(() => {});
    await shot(page, '02-player-setup');

    // 3. Fill in player names
    console.log('── Fill in player names');
    const inputs = await page.$$('input');
    await inputs[0]?.click();
    await inputs[0]?.type('Anne');
    await inputs[1]?.click();
    await inputs[1]?.type('Blackbeard');

    // Add a 3rd player
    await page.evaluate(() => {
      const els = [...document.querySelectorAll('*')];
      const btn = els.find(el => el.textContent?.trim() === '+ Add Player');
      btn?.click();
    });
    await new Promise(r => setTimeout(r, 300));
    const inputs2 = await page.$$('input');
    await inputs2[2]?.click();
    await inputs2[2]?.type('Jolly Roger');
    await shot(page, '03-player-setup-filled');

    // 4. Start game
    console.log('── Round Entry Screen');
    await page.evaluate(() => {
      const els = [...document.querySelectorAll('*')];
      const btn = els.find(el => el.textContent?.trim() === 'Start Game');
      btn?.click();
    });
    await page.waitForFunction(
      () => document.body.innerText.includes('Round 1 of'),
      { timeout: 5000 }
    ).catch(() => {});
    await shot(page, '04-round-entry');

    // 5. Fill bids and tricks via JS to avoid click-target issues
    console.log('── Fill round 1 bids/tricks');
    const values = ['1', '1', '0', '0', '0', '0'];
    await page.evaluate((vals) => {
      const inputs = [...document.querySelectorAll('input')];
      inputs.forEach((input, i) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        )?.set;
        nativeInputValueSetter?.call(input, vals[i] ?? '0');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }, values);
    await new Promise(r => setTimeout(r, 300));
    await shot(page, '05-round-entry-filled');

    // 6. Submit round → Scoreboard
    console.log('── Scoreboard');
    await page.evaluate(() => {
      const els = [...document.querySelectorAll('*')];
      const btn = els.find(el => el.textContent?.trim() === 'Submit Round');
      btn?.click();
    });
    await page.waitForFunction(
      () => document.body.innerText.includes('After Round'),
      { timeout: 5000 }
    ).catch(() => {});
    await shot(page, '06-scoreboard');

    console.log('\nAll screenshots saved to ./screenshots/');
  } finally {
    await browser.close();
  }
}

run().catch(err => { console.error(err); process.exit(1); });
