/**
 * Capture screenshots of every main screen for visual review.
 *
 * Usage:
 *   1. npm run dev            (note the port it prints, e.g. 5173 or 5174)
 *   2. BASE=http://localhost:5173 npm run screenshots
 *
 * Output goes to .design/screens/ (git-ignored). Seeds local-mode sample data
 * so the QR grid and stats render with real content.
 *
 * Requires the Chromium browser: npx playwright install chromium
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = '.design/screens';

const seed = {
  scanron_local_accounts: JSON.stringify([
    { id: 'local_default', name: 'Main', order: 0, createdAt: 1 },
    { id: 'local_alt', name: 'Smurf', order: 1, createdAt: 2 },
  ]),
  scanron_local_friends_local_default: JSON.stringify([
    { id: 'f1', name: 'Goku', friendCode: 'dr85d9jy', createdAt: 10 },
    { id: 'f2', name: 'Vegeta', friendCode: '7q8s9t2b', createdAt: 20 },
    { id: 'f3', name: 'Piccolo', friendCode: 'mk44n8p2', createdAt: 30 },
  ]),
  scanron_lang: 'en',
};

const shots = [
  { name: 'landing', path: '/' },
  { name: 'codes-scan', path: '/dashboard' },
  { name: 'codes-manage', path: '/dashboard?tab=manage' },
  { name: 'settings', path: '/settings' },
  { name: 'login', path: '/login' },
];

const viewports = [
  { tag: 'desktop', width: 1280, height: 900 },
  { tag: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.addInitScript((data) => {
    for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v);
  }, seed);
  for (const s of shots) {
    await page.goto(BASE + s.path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${s.name}-${vp.tag}.png`, fullPage: true });
    console.log(`shot ${s.name}-${vp.tag}`);
  }
  if (vp.tag === 'desktop') {
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.getByText('Goku').first().click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/modal-desktop.png` });
    console.log('shot modal-desktop');
  }
  await ctx.close();
}
await browser.close();
console.log('done');
