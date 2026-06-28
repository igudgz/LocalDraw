import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://127.0.0.1:5173/";
const SCREENSHOT = resolve(
  ".agent/runs/LD-003-selection/smoke-selection.png",
);

async function waitForServer(page) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await page.goto(URL, { waitUntil: "domcontentloaded" });
      if (response && response.ok()) {
        return;
      }
    } catch {
      // retry
    }
    await page.waitForTimeout(500);
  }

  throw new Error("Dev server did not respond at " + URL);
}

async function main() {
  await mkdir(dirname(SCREENSHOT), { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME,
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await waitForServer(page);

  const seedRect = page.locator('[data-element-id="seed-rectangle"]');
  await seedRect.waitFor({ state: "attached", timeout: 5000 });
  const beforeBox = await seedRect.boundingBox();

  if (!beforeBox) {
    throw new Error("Seed rectangle not rendered");
  }

  console.log(
    "SEED_RECT_PASS",
    JSON.stringify({
      x: Math.round(beforeBox.x),
      y: Math.round(beforeBox.y),
      width: Math.round(beforeBox.width),
      height: Math.round(beforeBox.height),
    }),
  );

  const centerX = beforeBox.x + beforeBox.width / 2;
  const centerY = beforeBox.y + beforeBox.height / 2;
  await page.mouse.click(centerX, centerY);

  const selectionBox = page.locator("rect.selection-box");
  await selectionBox.waitFor({ state: "attached", timeout: 2000 });
  const selectionVisible = (await selectionBox.count()) > 0;

  if (!selectionVisible) {
    throw new Error("Selection box did not appear after click");
  }

  console.log("SELECT_PASS selection-box-visible=true");

  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.mouse.move(centerX + 60, centerY + 40, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(150);

  const afterBox = await seedRect.boundingBox();

  if (!afterBox) {
    throw new Error("Seed rectangle missing after drag");
  }

  const deltaX = Math.abs(afterBox.x - beforeBox.x);
  const deltaY = Math.abs(afterBox.y - beforeBox.y);
  const moved = deltaX > 8 || deltaY > 8;

  if (!moved) {
    throw new Error(
      `Element did not move enough: deltaX=${deltaX}, deltaY=${deltaY}`,
    );
  }

  console.log(
    "DRAG_PASS",
    JSON.stringify({
      deltaX: Math.round(deltaX),
      deltaY: Math.round(deltaY),
      afterX: Math.round(afterBox.x),
      afterY: Math.round(afterBox.y),
    }),
  );

  const svg = page.locator("svg.editor-surface");
  const svgBox = await svg.boundingBox();

  if (!svgBox) {
    throw new Error("Editor SVG not found");
  }

  await page.mouse.click(svgBox.x + 24, svgBox.y + 24);
  await page.waitForTimeout(150);

  const selectionAfterBackgroundClick = await selectionBox.count();

  if (selectionAfterBackgroundClick !== 0) {
    throw new Error(
      `Selection not cleared after background click: count=${selectionAfterBackgroundClick}`,
    );
  }

  console.log("DESELECT_PASS selection-box-count=0");

  await page.screenshot({ path: SCREENSHOT, fullPage: true });
  console.log("SCREENSHOT_SAVED", SCREENSHOT);
  console.log("SMOKE_SELECTION_PASS");

  await browser.close();
}

main().catch((error) => {
  console.error("SMOKE_SELECTION_FAIL", error);
  process.exit(1);
});
