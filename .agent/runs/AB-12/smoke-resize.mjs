import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:5199/";
const SCREENSHOT = resolve(
  ".agent/runs/AB-12/smoke-resize.png",
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
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await waitForServer(page);

  await page.getByRole("button", { name: "Rect" }).click();

  const svg = page.locator("svg.editor-surface");
  const box = await svg.boundingBox();

  if (!box) {
    throw new Error("SVG canvas not found");
  }

  const x1 = box.x + box.width * 0.35;
  const y1 = box.y + box.height * 0.35;
  const x2 = box.x + box.width * 0.55;
  const y2 = box.y + box.height * 0.55;

  await page.mouse.move(x1, y1);
  await page.mouse.down();
  await page.mouse.move(x2, y2, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(200);

  const drawnRect = page.locator('[data-element-id]').first();
  await drawnRect.waitFor({ state: "attached", timeout: 3000 });
  const beforeBox = await drawnRect.boundingBox();

  if (!beforeBox) {
    throw new Error("Drawn rectangle not rendered");
  }

  console.log(
    "DRAW_PASS",
    JSON.stringify({
      width: Math.round(beforeBox.width),
      height: Math.round(beforeBox.height),
    }),
  );

  let handleCount = await page.locator("circle.resize-handle").count();
  console.log("HANDLES_AFTER_DRAW count=" + handleCount);

  await page.getByRole("button", { name: "Select" }).click();
  await page.waitForTimeout(150);

  handleCount = await page.locator("circle.resize-handle").count();
  if (handleCount < 4) {
    await drawnRect.click({ force: true });
    await page.waitForTimeout(200);
    handleCount = await page.locator("circle.resize-handle").count();
  }

  const handles = page.locator("circle.resize-handle");

  if (handleCount < 4) {
    throw new Error(`Expected 4 resize handles, got ${handleCount}`);
  }

  console.log("HANDLES_PASS count=" + handleCount);

  const seHandle = page.locator("circle.resize-handle-se");
  const seBox = await seHandle.boundingBox();

  if (!seBox) {
    throw new Error("SE resize handle not found");
  }

  const seX = seBox.x + seBox.width / 2;
  const seY = seBox.y + seBox.height / 2;
  const centerX = beforeBox.x + beforeBox.width / 2;
  const centerY = beforeBox.y + beforeBox.height / 2;

  await page.mouse.move(seX, seY);
  await page.mouse.down();
  await page.mouse.move(seX + 50, seY + 40, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(200);

  const afterResize = await drawnRect.boundingBox();

  if (!afterResize) {
    throw new Error("Rectangle missing after resize");
  }

  const widthDelta = afterResize.width - beforeBox.width;
  const heightDelta = afterResize.height - beforeBox.height;

  if (widthDelta < 20 || heightDelta < 15) {
    throw new Error(
      `Resize did not grow enough: dw=${widthDelta} dh=${heightDelta}`,
    );
  }

  console.log(
    "RESIZE_PASS",
    JSON.stringify({
      beforeW: Math.round(beforeBox.width),
      afterW: Math.round(afterResize.width),
      beforeH: Math.round(beforeBox.height),
      afterH: Math.round(afterResize.height),
    }),
  );

  await page.mouse.move(centerX + 30, centerY + 20);
  await page.mouse.down();
  await page.mouse.move(centerX + 90, centerY + 60, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(200);

  const afterMove = await drawnRect.boundingBox();

  if (!afterMove) {
    throw new Error("Rectangle missing after move");
  }

  const moveDeltaX = Math.abs(afterMove.x - afterResize.x);
  const moveDeltaY = Math.abs(afterMove.y - afterResize.y);

  if (moveDeltaX < 20 && moveDeltaY < 15) {
    throw new Error("Move after resize did not change position enough");
  }

  console.log(
    "MOVE_AFTER_RESIZE_PASS",
    JSON.stringify({
      dx: Math.round(moveDeltaX),
      dy: Math.round(moveDeltaY),
    }),
  );

  await page.screenshot({ path: SCREENSHOT, fullPage: true });
  console.log("SCREENSHOT_PASS " + SCREENSHOT);

  await browser.close();
}

main().catch((error) => {
  console.error("SMOKE_FAIL", error.message);
  process.exit(1);
});
