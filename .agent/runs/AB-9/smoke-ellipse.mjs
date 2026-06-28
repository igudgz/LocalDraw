import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://127.0.0.1:5173/";
const SCREENSHOT = resolve(
  ".agent/runs/AB-9/smoke-ellipse.png",
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

  const ellipseToolButton = page.getByRole("button", { name: "Oval", exact: true });
  await ellipseToolButton.click();
  await page.waitForTimeout(100);

  const ellipsePressed = await ellipseToolButton.getAttribute("aria-pressed");
  if (ellipsePressed !== "true") {
    throw new Error(`Ellipse tool not active: aria-pressed=${ellipsePressed}`);
  }

  console.log("ELLIPSE_TOOL_PASS aria-pressed=true");

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

  const createdEllipse = page.locator('[data-element-id^="ellipse-"]');
  await createdEllipse.waitFor({ state: "attached", timeout: 3000 });
  const ellipseCount = await createdEllipse.count();

  if (ellipseCount !== 1) {
    throw new Error(`Expected 1 ellipse, found ${ellipseCount}`);
  }

  const afterCreateBox = await createdEllipse.boundingBox();
  if (!afterCreateBox) {
    throw new Error("Created ellipse has no bounding box");
  }

  console.log(
    "CREATE_ELLIPSE_PASS",
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

  console.log("SELECT_ELLIPSE_PASS selection-box-visible=true");

  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.mouse.move(centerX + 60, centerY + 40, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(150);

  const afterMoveBox = await createdEllipse.boundingBox();
  if (!afterMoveBox) {
    throw new Error("Ellipse missing after move drag");
  }

  const deltaX = Math.abs(afterMoveBox.x - afterCreateBox.x);
  const deltaY = Math.abs(afterMoveBox.y - afterCreateBox.y);
  const moved = deltaX > 8 || deltaY > 8;

  if (!moved) {
    throw new Error(
      `Ellipse did not move enough: deltaX=${deltaX}, deltaY=${deltaY}`,
    );
  }

  console.log(
    "MOVE_ELLIPSE_PASS",
    JSON.stringify({
      deltaX: Math.round(deltaX),
      deltaY: Math.round(deltaY),
      afterX: Math.round(afterMoveBox.x),
      afterY: Math.round(afterMoveBox.y),
    }),
  );

  await page.screenshot({ path: SCREENSHOT, fullPage: true });
  console.log("SCREENSHOT_SAVED", SCREENSHOT);
  console.log("SMOKE_ELLIPSE_PASS");

  await browser.close();
}

main().catch((error) => {
  console.error("SMOKE_ELLIPSE_FAIL", error);
  process.exit(1);
});
