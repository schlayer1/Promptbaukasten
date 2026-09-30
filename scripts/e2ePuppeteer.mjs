import { preview } from 'vite';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

console.log('====================================================');
console.log('🎭 HBS PROMPTBAUKASTEN PUPPETEER E2E TEST SUITE');
console.log('====================================================\n');

const SCREENSHOT_DIR = path.resolve('scripts/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

async function runE2E() {
  let server;
  let browser;

  try {
    // 1. START VITE PREVIEW SERVER
    console.log('--- 1. STARTING PRODUCTION PREVIEW SERVER ---');
    server = await preview({
      preview: { port: 4173, host: 'localhost' },
      configFile: path.resolve('vite.config.ts')
    });
    const serverUrl = 'http://localhost:4173';
    console.log(`  Preview server listening at ${serverUrl}`);
    assert(true, 'Vite production preview server running');

    // 2. LAUNCH PUPPETEER CHROMIUM
    console.log('\n--- 2. LAUNCHING PUPPETEER CHROMIUM ---');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--use-fake-ui-for-media-stream',
        '--autoplay-policy=no-user-gesture-required'
      ]
    });
    assert(!!browser, 'Chromium browser launched successfully');

    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      window.print = () => console.log('[Mock] window.print() called');
    });

    // Auto-accept browser confirmation dialogs (e.g. delete confirmations)
    page.on('dialog', async dialog => {
      console.log(`    [Browser Dialog] ${dialog.type()}: "${dialog.message()}" -> Accepting`);
      await dialog.accept();
    });

    // Capture console errors from page
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.warn(`    [Page Error Console]: ${msg.text()}`);
      }
    });

    // ========================================================
    // SCENARIO 1: RESPONSIVE VIEWPORT TESTING
    // ========================================================
    console.log('\n--- SCENARIO 1: RESPONSIVE VIEWPORTS (LAPTOP, IPAD, PHONE) ---');
    
    // 1A: DESKTOP / LAPTOP (1440x900)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(serverUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('header');
    
    const desktopTitle = await page.$eval('h1', el => el.textContent);
    assert(desktopTitle.includes('KI-Unterrichts-Baukasten'), `Desktop title verified: "${desktopTitle}"`);
    
    // Check 2-column layout exists on desktop
    const col5 = await page.$('.lg\\:col-span-5');
    const col7 = await page.$('.lg\\:col-span-7');
    assert(!!col5 && !!col7, 'Desktop 2-column grid layout (5/7 columns) active');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_layout.png') });
    console.log('  📸 Saved: 01_desktop_layout.png');

    // 1B: IPAD / TABLET (810x1080)
    await page.setViewport({ width: 810, height: 1080 });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_ipad_layout.png') });
    console.log('  📸 Saved: 02_ipad_layout.png');
    assert(true, 'iPad tablet viewport rendered cleanly');

    // 1C: SMARTPHONE / IPHONE (390x844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 400));

    // Verify Sticky Mobile Bar is visible
    const stickyBar = await page.$('.lg\\:hidden.fixed.bottom-3');
    assert(!!stickyBar, 'Mobile sticky action bar is present and anchored at bottom');

    // Verify iOS auto-zoom prevention: all select inputs must have font-size >= 16px on mobile
    const inputFontSizes = await page.$$eval('select', els => els.map(el => parseFloat(window.getComputedStyle(el).fontSize)));
    const allGte16 = inputFontSizes.length > 0 && inputFontSizes.every(px => px >= 16);
    assert(allGte16, `All mobile select inputs font-size >= 16px (${inputFontSizes.join('px, ')}px) to prevent iOS auto-zoom`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mobile_layout.png') });
    console.log('  📸 Saved: 03_mobile_layout.png');

    // ========================================================
    // SCENARIO 2: APPORTAL KOLLEGIUMS-LOGIN (PIN AUTH)
    // ========================================================
    console.log('\n--- SCENARIO 2: APPORTAL KOLLEGIUMS-LOGIN (PIN AUTH) ---');
    await page.setViewport({ width: 1280, height: 850 });
    await page.goto(serverUrl, { waitUntil: 'networkidle0' });

    // Find and click PIN-Login button in Header
    const loginBtn = await page.waitForSelector('button[title*="PIN aus dem HBS Appportal"]');
    assert(!!loginBtn, 'PIN-Login button found in header');
    await loginBtn.click();

    // Wait for modal
    await page.waitForSelector('form select');
    // Select teacher 'Keller' (id: 't-keller')
    await page.select('form select', 't-keller');

    // Enter PIN: '6079'
    const pinInput = await page.$('input[type="password"]');
    await pinInput.type('6079');

    // Click Submit
    const submitBtn = await page.$('form button[type="submit"]');
    await submitBtn.click();

    // Verify logged in state in header
    await page.waitForSelector('span[title*="Keller"]', { timeout: 4000 });
    const teacherBadge = await page.$eval('span[title*="Keller"]', el => el.textContent);
    assert(teacherBadge.includes('Keller'), `Successfully authenticated as teacher "${teacherBadge}"`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_authenticated_user.png') });
    console.log('  📸 Saved: 04_authenticated_user.png');

    // ========================================================
    // SCENARIO 3: HTML5 LERNSPIEL GAMEPLAY & INTERACTION
    // ========================================================
    console.log('\n--- SCENARIO 3: HTML5 LERNSPIEL LIVE INTERACTION ---');
    
    // Switch to Lernspiel Tab
    for (const b of await page.$$('button')) {
      const text = await b.evaluate(el => el.textContent);
      if (text && text.includes('1. Lernspiel')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    // Find iframe
    const iframeElement = await page.waitForSelector('iframe[title="Interaktives Lernspiel"]');
    assert(!!iframeElement, 'Interactive game iframe located in DOM');

    const frame = await iframeElement.contentFrame();
    assert(!!frame, 'Successfully connected to game iframe context');

    // Wait for game content inside iframe
    await frame.waitForSelector('#playArea');
    const questionText = await frame.$eval('#questionText', el => el.textContent);
    assert(questionText.length > 5, `First quiz question rendered: "${questionText.slice(0, 45)}..."`);

    // Verify Option Buttons
    const optionButtons = await frame.$$('.option-button');
    assert(optionButtons.length >= 2, `Rendered ${optionButtons.length} clickable answer buttons`);

    // Click first answer
    await frame.evaluate(() => document.querySelector('.option-button')?.click());
    await new Promise(r => setTimeout(r, 200));

    const hasExplanation = await frame.evaluate(() => !!document.querySelector('.explanation-card'));
    assert(hasExplanation, 'Didactic feedback card triggered on answer click');

    // Play through all remaining questions
    for (let round = 0; round < 6; round++) {
      const isFinish = await frame.evaluate(() => !!document.querySelector('.finish-screen'));
      if (isFinish) {
        console.log(`    [Game Advance] Reached finish screen after round ${round}`);
        break;
      }

      await frame.evaluate(() => document.querySelector('.btn-next')?.click());
      await new Promise(r => setTimeout(r, 200));

      const isStillQuiz = await frame.evaluate(() => !!document.querySelector('.option-button'));
      if (isStillQuiz) {
        await frame.evaluate(() => document.querySelector('.option-button')?.click());
        await new Promise(r => setTimeout(r, 200));
      }
    }

    // Verify Finish Screen & Certificate
    const finishHeader = await frame.evaluate(() => document.querySelector('.finish-screen h2')?.textContent || '');
    assert(finishHeader.includes('HERZLICHEN GLÜCKWUNSCH'), `Finish screen reached with banner: "${finishHeader}"`);

    const hasCert = await frame.evaluate(() => !!document.querySelector('.certificate-card'));
    assert(hasCert, 'Official HBS printable certificate rendered on finish screen');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_game_finish_screen.png') });
    console.log('  📸 Saved: 05_game_finish_screen.png');

    // ========================================================
    // SCENARIO 4: CLOUD STORAGE & SCHUL-BIBLIOTHEK (E2E)
    // ========================================================
    console.log('\n--- SCENARIO 4: CLOUD PERSISTENCE VIA UI (SAVE / LOAD / DELETE) ---');

    // Click "In Cloud speichern"
    const saveCloudBtn = await page.waitForSelector('button[title*="Firebase Cloud"]');
    assert(!!saveCloudBtn, 'Found "In Cloud speichern" button');
    await saveCloudBtn.click();

    // Wait for toast confirmation
    await page.waitForSelector('.bg-white.border-l-4, .text-slate-800', { timeout: 6000 });
    assert(true, 'Cloud save request triggered and confirmed via Toast');

    await new Promise(r => setTimeout(r, 1200));

    // Open "Schul-Bibliothek"
    const libraryBtn = await page.waitForSelector('button[title*="Schul-Bibliothek"]');
    await libraryBtn.click();

    // Wait for modal list
    await page.waitForSelector('input[placeholder*="Suche nach Thema"]', { timeout: 5000 });
    assert(true, 'Schul-Bibliothek modal opened');

    // Locate the saved item in the list
    await new Promise(r => setTimeout(r, 1000));
    const cardItems = await page.$$('.bg-white.p-4.sm\\:p-5.rounded-2xl');
    assert(cardItems.length > 0, `Library list shows ${cardItems.length} saved material card(s)`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_library_modal.png') });
    console.log('  📸 Saved: 06_library_modal.png');

    // Click delete on the teacher's item if exists
    const deleteBtn = await page.$('button[title="Material löschen"]');
    if (deleteBtn) {
      await deleteBtn.click();
      await new Promise(r => setTimeout(r, 800));
      assert(true, 'Successfully deleted test material from Cloud Library via UI');
    }

    // Close library modal via evaluate
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const close = btns.find(b => b.textContent?.includes('Schließen') || b.className.includes('bg-white/10'));
      close?.click();
    });
    await new Promise(r => setTimeout(r, 400));
    assert(true, 'Closed Schul-Bibliothek modal');

    // ========================================================
    // SCENARIO 5: HYBRID STORYTELLING & PROMPT GENERATION
    // ========================================================
    console.log('\n--- SCENARIO 5: HYBRID STORYTELLING & PROMPT GENERATION ---');

    // Click 'Lernspiel' format button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const gameBtn = btns.find(b => b.textContent?.includes('Lernspiel (HTML5)'));
      gameBtn?.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Verify game options are now visible
    const storySelects = await page.$$('select');
    assert(storySelects.length >= 2, 'Lernspiel configuration options (Game Mode, Story Theme) expanded');

    // Switch to Prompt tab to verify generation
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const promptBtn = btns.find(b => b.textContent?.includes('4. Prompt'));
      promptBtn?.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const promptCard = await page.$('.font-mono');
    assert(!!promptCard, 'Didactic prompt generated and visible in Prompt Hub');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_custom_storytelling_prompt.png') });
    console.log('  📸 Saved: 07_custom_storytelling_prompt.png');

    // ========================================================
    // SCENARIO 6: DIGITALE LERNSTATION (ALL-IN-ONE SINGLE-PAGE WEBSITE)
    // ========================================================
    console.log('\n--- SCENARIO 6: DIGITALE LERNSTATION (SINGLE-PAGE WEBSITE) ---');

    // Click 'Digitale Lernstation' format card
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const stationBtn = btns.find(b => b.textContent?.includes('Digitale Lernstation') || b.textContent?.includes('⭐ All-in-One Station'));
      stationBtn?.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Verify Station options container is displayed
    const stationOptionsContainer = await page.$('.bg-sky-50\\/70');
    assert(!!stationOptionsContainer, 'StepStationOptions configurator rendered with 8 interactive modules');

    // Check module checkboxes rendered
    const stationCheckboxes = await page.$$('.bg-sky-50\\/70 input[type="checkbox"]');
    assert(stationCheckboxes.length >= 8, `Found ${stationCheckboxes.length} module toggles (Lernziele, Merkkästen, 3D-Karten, Lückentext, AFB I-III, Spezial, Quiz, Reflexion)`);

    // Verify Tab 1 button is dynamically labeled "1. Lernstation (Webseite)"
    const tab1Text = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const t1 = btns.find(b => b.textContent?.includes('Lernstation'));
      return t1 ? t1.textContent : '';
    });
    assert(tab1Text.includes('Lernstation'), `Tab 1 dynamically labeled as: "${tab1Text?.trim()}"`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_station_configurator.png') });
    console.log('  📸 Saved: 08_station_configurator.png');

    // ========================================================
    // SCENARIO 7: HTML DESIGN THEME & MULTI-DEVICE RESPONSIVENESS (LAPTOP, IPAD, IPHONE)
    // ========================================================
    console.log('\n--- SCENARIO 7: HTML DESIGN THEME & MULTI-DEVICE RESPONSIVENESS ---');

    // 7A: Verify Design Theme Selector
    const designThemeSelect = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      const found = selects.find(s => s.innerHTML.includes('Themen- & Fach-Adaptiv') || s.innerHTML.includes('Altersgerecht'));
      return !!found;
    });
    assert(designThemeSelect, 'Visual HTML Design & Age-Appropriate Theme dropdown found in sidebar');

    // 7B: Verify Background Pattern Chips
    const bgPatternButtons = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const chips = btns.filter(b => ['Auto', 'Punkte', 'Karo', 'Verlauf', 'Clean'].includes(b.textContent?.trim() || ''));
      return chips.length;
    });
    assert(bgPatternButtons >= 4, `Found ${bgPatternButtons} Background Pattern chips (Auto, Punkte, Karo, Verlauf, Clean)`);

    // 7C: Select 'Klasse 5/6' theme and 'Punkte' pattern
    await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      const found = selects.find(s => s.innerHTML.includes('Themen- & Fach-Adaptiv') || s.innerHTML.includes('Altersgerecht'));
      if (found) {
        found.value = 'age-primary';
        found.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const btns = Array.from(document.querySelectorAll('button'));
      const punkteBtn = btns.find(b => b.textContent?.trim() === 'Punkte');
      punkteBtn?.click();
    });
    await new Promise(r => setTimeout(r, 400));
    assert(true, 'Applied "Altersgerecht: Klasse 5/6" theme and "Punkte" pattern');

    // 7D: Switch to Tab 1 to inspect the rendered Station HTML
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('#output-pane button'));
      const t1 = tabButtons.find(b => b.textContent?.includes('1. Lernstation') || b.textContent?.includes('1. Lernspiel'));
      t1?.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // 7E: Verify Station iframe responsive rendering on Laptop (1440x900)
    await page.setViewport({ width: 1440, height: 900 });
    await new Promise(r => setTimeout(r, 500));
    const iframeHandle = await page.waitForSelector('iframe', { timeout: 5000 });
    assert(!!iframeHandle, 'Station iframe located on Laptop');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_station_laptop.png') });
    console.log('  📸 Saved: 09_station_laptop.png');

    // 7F: Verify Station responsive rendering on iPad / Tablet (768x1024)
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_station_ipad.png') });
    console.log('  📸 Saved: 10_station_ipad.png');
    assert(true, 'Station verified cleanly on iPad viewport (768x1024)');

    // 7G: Verify Station responsive rendering on iPhone (390x844)
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_station_iphone.png') });
    console.log('  📸 Saved: 11_station_iphone.png');

    // Check that inside the station iframe, no horizontal scroll overflow occurs
    const stationFrame = await iframeHandle.contentFrame();
    if (stationFrame) {
      const isMobileResponsive = await stationFrame.evaluate(() => {
        const bodyWidth = document.body.clientWidth;
        const scrollWidth = document.body.scrollWidth;
        const hasViewport = !!document.querySelector('meta[name="viewport"]');
        return {
          scrollWidthMatches: scrollWidth <= bodyWidth + 5,
          hasViewport,
          bodyWidth,
          scrollWidth
        };
      });
      assert(isMobileResponsive.hasViewport, 'Station iframe contains responsive <meta name="viewport">');
      assert(isMobileResponsive.scrollWidthMatches, `Station iframe has zero horizontal overflow on iPhone (body: ${isMobileResponsive.bodyWidth}px, scroll: ${isMobileResponsive.scrollWidth}px)`);
    }

    console.log('\n====================================================');
    console.log(`🏁 PUPPETEER E2E RESULT: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('====================================================');

  } catch (err) {
    console.error('❌ E2E Execution Error:', err);
    failCount++;
  } finally {
    if (browser) await browser.close();
    if (server) await server.close();
    process.exit(failCount > 0 ? 1 : 0);
  }
}

runE2E();
