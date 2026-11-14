// Measures real frame rate on the production build with Chrome DevTools CPU throttling.
// For each case: load the page, wait for idle-loaded modules (terminal, canvas, telemetry),
// move the mouse across the hero for 5s (so the canvas animates) and count
// requestAnimationFrame callbacks. Also reads the canvas state the page reports.
//
// Usage: npm run start  (other terminal)  then:
//   CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/measure-fps.mjs [url]
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:4173/vi/";
const executablePath = process.env.CHROME_PATH;
if (!executablePath) {
  process.stderr.write("Set CHROME_PATH to a local Chrome/Chromium executable.\n");
  process.exit(1);
}

const cases = [
  { name: "desktop 1280x800, CPU 1x", width: 1280, height: 800, cpu: 1, mobile: false },
  { name: "desktop 1280x800, CPU 4x", width: 1280, height: 800, cpu: 4, mobile: false },
  { name: "mobile 360x740, CPU 4x", width: 360, height: 740, cpu: 4, mobile: true },
];

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-first-run"] });
const results = [];
for (const c of cases) {
  const page = await browser.newPage();
  await page.setViewport({ width: c.width, height: c.height, deviceScaleFactor: c.mobile ? 2 : 1, isMobile: c.mobile, hasTouch: c.mobile });
  await page.emulateCPUThrottling(c.cpu);
  await page.goto(url, { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 5000)); // idle loaders + boot replay
  await page.evaluate(() => {
    window.__frames = 0;
    window.__t0 = performance.now();
    const loop = () => {
      window.__frames++;
      if (performance.now() - window.__t0 < 5000) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  const t0 = Date.now();
  let i = 0;
  while (Date.now() - t0 < 5000) {
    const x = (Math.sin(i / 20) * 0.4 + 0.5) * c.width;
    const y = (Math.cos(i / 27) * 0.3 + 0.4) * Math.min(c.height, 600);
    await page.mouse.move(x, y);
    i++;
    await new Promise((r) => setTimeout(r, 16));
  }
  await new Promise((r) => setTimeout(r, 200));
  const r = await page.evaluate(() => ({
    fps: Math.round((window.__frames * 1000) / Math.max(1, performance.now() - window.__t0) * 10) / 10,
    canvas: document.documentElement.dataset.canvas ?? "(not set)",
  }));
  results.push({ case: c.name, ...r });
  await page.close();
}
await browser.close();
process.stdout.write(JSON.stringify({ url, measuredAt: new Date().toISOString(), results }, null, 2) + "\n");
