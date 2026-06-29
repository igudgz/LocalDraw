import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.SMOKE_URL ?? "http://localhost:5176/";
const RUN_DIR = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT = resolve(RUN_DIR, "smoke-keyboard-shortcuts.png");

async function waitForServer(page) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
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

async function drawRectangle(page) {
  await page.keyboard.press("r");
  await page.waitForTimeout(150);

  const rectPressed = await page
    .getByRole("button", { name: "Rect" })
    .getAttribute("aria-pressed");
  if (rectPressed !== "true") {
    throw new Error(
      "R shortcut did not activate Rect tool (aria-pressed=" + rectPressed + ")",
    );
  }
  console.log("TOOL_R_PASS");

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
  await page.waitForTimeout(250);

  const count = await page.locator("[data-element-id]").count();
  if (count < 1) {
    throw new Error("Rectangle not drawn");
  }
  console.log("DRAW_PASS count=" + count);
}

async function main() {
  await mkdir(dirname(SCREENSHOT), { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME,
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await waitForServer(page);

  await page.getByRole("region", { name: "Drawing editor" }).waitFor();
  await page.locator("svg.editor-surface").click({ position: { x: 200, y: 200 } });
  await page.waitForTimeout(300);

  await drawRectangle(page);

  await page.keyboard.press("v");
  await page.waitForTimeout(100);
  const selectPressed = await page
    .getByRole("button", { name: "Select" })
    .getAttribute("aria-pressed");
  if (selectPressed !== "true") {
    throw new Error("V shortcut did not activate Select tool");
  }
  console.log("TOOL_V_PASS");

  await page.locator("[data-element-id]").first().click({ force: true });
  await page.waitForTimeout(150);

  let count = await page.locator("[data-element-id]").count();
  await page.keyboard.press("Delete");
  await page.waitForTimeout(200);
  count = await page.locator("[data-element-id]").count();
  if (count !== 0) {
    throw new Error("Delete shortcut did not remove element");
  }
  console.log("DELETE_PASS");

  await page.keyboard.press("Control+Z");
  await page.waitForTimeout(200);
  count = await page.locator("[data-element-id]").count();
  if (count !== 1) {
    throw new Error("Ctrl+Z did not undo delete");
  }
  console.log("UNDO_PASS");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  const handles = await page.locator("circle.resize-handle").count();
  if (handles > 0) {
    throw new Error("Esc did not clear selection (handles still visible)");
  }
  console.log("ESC_PASS");

  await page.keyboard.press("h");
  await page.waitForTimeout(100);
  const handPressed = await page
    .getByRole("button", { name: "Hand" })
    .getAttribute("aria-pressed");
  if (handPressed !== "true") {
    throw new Error("H shortcut did not activate Hand tool");
  }
  console.log("TOOL_H_PASS");

  await page.screenshot({ path: SCREENSHOT, fullPage: true });
  console.log("SCREENSHOT_PASS " + SCREENSHOT);

  await browser.close();
}

main().catch((error) => {
  console.error("SMOKE_FAIL", error.message);
  process.exit(1);
});
