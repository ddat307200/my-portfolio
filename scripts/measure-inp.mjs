// Measures INP on the production build under 4x CPU throttling, using the page's own
// telemetry (PerformanceObserver "event" entries): type terminal commands, run both
// demos, open the palette, then read the INP value the page reports.
// Actions are spaced 300ms apart (a fast human); back-to-back robot clicks a few ms
// apart would mostly measure the previous click's work, not this one.
//
// Usage: npm run start  (other terminal)  then:
//   CHROME_PATH=... node scripts/measure-inp.mjs [url]
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:4173/vi/";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true });
const results = [];
for (const c of [
  { name: "desktop 1280x800, CPU 4x", vp: { width: 1280, height: 800 } },
  { name: "mobile 360x740, CPU 4x", vp: { width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
]) {
  const page = await browser.newPage();
  await page.setViewport(c.vp);
  await page.emulateCPUThrottling(4);
  await page.goto(url, { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 6000));
  // record every interaction so the slowest one can be named
  await page.evaluate(() => {
    window.__events = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (!e.interactionId) continue;
        const t = e.target;
        window.__events.push({
          type: e.name,
          at: Math.round(e.startTime),
          ms: Math.round(e.duration),
          input: Math.round(e.processingStart - e.startTime),
          processing: Math.round(e.processingEnd - e.processingStart),
          target: t ? `${t.tagName.toLowerCase()}${t.dataset ? Object.keys(t.dataset).map((k) => `[${k}]`).join("") : ""}` : "?",
        });
      }
    }).observe({ type: "event", durationThreshold: 16 });
  });
  const pause = () => new Promise((r) => setTimeout(r, 300));
  // real input events (mouse clicks and key presses), not element.click()
  await page.click('[data-term-run="whoami"]');
  await pause();
  await page.click("[data-term-input]");
  await page.keyboard.type("ls projects", { delay: 60 });
  await page.keyboard.press("Enter");
  await pause();
  await page.keyboard.press("Escape");
  await pause();
  await page.evaluate(() => document.querySelector("#run").scrollIntoView());
  await page.waitForFunction(() => performance.getEntriesByType("resource").some((e) => e.name.includes("/demos-")));
  await new Promise((r) => setTimeout(r, 500));
  await page.click("[data-extract-sample]");
  await pause();
  await page.click("[data-reconcile-sample]");
  await pause();
  await page.keyboard.down("Control");
  await page.keyboard.press("k");
  await page.keyboard.up("Control");
  await new Promise((r) => setTimeout(r, 400));
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.querySelector("#status").scrollIntoView());
  await page.waitForFunction(() => /ms/.test(document.querySelector('[data-tm="inp"]')?.textContent ?? ""), { timeout: 15000 });
  const inp = await page.evaluate(() => document.querySelector('[data-tm="inp"]').textContent);
  const slowest = await page.evaluate(() => [...window.__events].sort((a, b) => b.ms - a.ms).slice(0, 4));
  if (process.env.INP_DEBUG) {
    const timeline = await page.evaluate(() => window.__events.map((e) => `${e.at}:${e.type}:${e.target}:${e.ms}`));
    process.stderr.write(`${c.name} ${JSON.stringify(timeline)}${String.fromCharCode(10)}`);
  }
  results.push({ case: c.name, inp, slowest });
  await page.close();
}
await browser.close();
process.stdout.write(JSON.stringify({ url, measuredAt: new Date().toISOString(), results }, null, 2) + "\n");
