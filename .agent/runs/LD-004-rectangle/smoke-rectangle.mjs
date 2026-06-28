import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://127.0.0.1:5173/";
const SCREENSHOT = resolve(
  ".agent/runs/LD-004-rectangle/smoke-rectangle.png",
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

  const rectToolButton = page.getByRole("button", { name: "Rect", exact: true });
  await rectToolButton.click();
  await page.waitForTimeout(100);

  const rectPressed = await rectToolButton.getAttribute("aria-pressed");
  if (rectPressed !== "true") {
    throw new Error(`Rectangle tool not active: aria-pressed=${rectPressed}`);
  }

  console.log("RECT_TOOL_PASS aria-pressed=true");

  const svg = page.locator("svg.editor-surface");
  await svg.waitFor({ state: "attached", timeout: 5000 });
  const svgBox = await svg.boundingBox();

  if (!svgBox) {
    throw new Error("Editor SVG not found");
  }

  const startX = svgBox.x + svgBox.width * 0.35;
  const startY = svgBox.y + svgBox.height * 0.35;
  const endX = svgBox.x + svgBox.width * 0.55;
  const endY = svgBox.y + svgBox.height * 0.55;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(200);

  const createdRect = page.locator('[data-element-id^="rectangle-"]');
  await createdRect.waitFor({ state: "attached", timeout: 3000 });
  const rectCount = await createdRect.count();

  if (rectCount !== 1) {
    throw new Error(`Expected 1 rectangle, found ${rectCount}`);
  }

  const afterCreateBox = await createdRect.boundingBox();
  if (!afterCreateBox) {
    throw new Error("Created rectangle has no bounding box");
  }

  console.log(
    "CREATE_RECT_PASS",
    JSON.stringify({
      x: Math.round(afterCreateBox.x),
      y: Math.round(afterCreateBox.y),
      width: Math.round(afterCreateBox.width),
      height: Math.round(afterCreateBox.height),
    }),
  );

  const selectToolButton = page.getByRole("button", {
    name: "Select",
    exact: true,
  });
  await selectToolButton.click();
  await page.waitForTimeout(100);

  const selectPressed = await selectToolButton.getAttribute("aria-pressed");
  if (selectPressed !== "true") {
    throw new Error(`Select tool not active: aria-pressed=${selectPressed}`);
  }

  console.log("SELECT_TOOL_PASS aria-pressed=true");

  const centerX = afterCreateBox.x + afterCreateBox.width / 2;
  const centerY = afterCreateBox.y + afterCreateBox.height / 2;

  await page.mouse.click(centerX, centerY);
  await page.waitForTimeout(150);

  const selectionBox = page.locator("rect.selection-box");
  await selectionBox.waitFor({ state: "attached", timeout: 2000 });

  console.log("SELECT_RECT_PASS selection-box-visible=true");

  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.mouse.move(centerX + 60, centerY + 40, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(150);

  const afterMoveBox = await createdRect.boundingBox();
  if (!afterMoveBox) {
    throw new Error("Rectangle missing after move drag");
  }

  const deltaX = Math.abs(afterMoveBox.x - afterCreateBox.x);
  const deltaY = Math.abs(afterMoveBox.y - afterCreateBox.y);
  const moved = deltaX > 8 || deltaY > 8;

  if (!moved) {
    throw new Error(
      `Rectangle did not move enough: deltaX=${deltaX}, deltaY=${deltaY}`,
    );
  }

  console.log(
    "MOVE_RECT_PASS",
    JSON.stringify({
      deltaX: Math.round(deltaX),
      deltaY: Math.round(deltaY),
      afterX: Math.round(afterMoveBox.x),
      afterY: Math.round(afterMoveBox.y),
    }),
  );

  await page.screenshot({ path: SCREENSHOT, fullPage: true });
  console.log("SCREENSHOT_SAVED", SCREENSHOT);
  console.log("SMOKE_RECTANGLE_PASS");

  await browser.close();
}

main().catch((error) => {
  console.error("SMOKE_RECTANGLE_FAIL", error);
  process.exit(1);
});
