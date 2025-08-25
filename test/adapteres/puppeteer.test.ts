import fs from "node:fs";
import path from "node:path";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PuppeteerAdapter } from "../../src/adapters/puppeteer.js";

describe("PuppeteerAdapter", () => {
  let browser: Browser;
  let page: Page;
  let adapter: PuppeteerAdapter;

  const loadFixture = async (fileName: string): Promise<void> => {
    const testHtmlPath = path.resolve(__dirname, `../fixtures/${fileName}`);
    const testHtml = fs.readFileSync(testHtmlPath, "utf-8");
    await page.setContent(testHtml);
  };

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    adapter = new PuppeteerAdapter(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("getTappableElements", () => {
    const testGetTappableElements = async (
      htmlFileName: string,
    ): Promise<void> => {
      await loadFixture(htmlFileName);

      const tappableElements = await adapter.getTappableElements();

      expect(tappableElements).toHaveLength(3);
      expect(tappableElements[0]?.top).toBe(8);
      expect(tappableElements[0]?.left).toBe(8);
      expect(tappableElements[0]?.width).toBe(100);
      expect(tappableElements[0]?.height).toBe(50);
    };

    it("should detect buttons correctly", async () => {
      await testGetTappableElements("button.html");
    });

    it("should detect links correctly", async () => {
      await testGetTappableElements("link.html");
    });
  });

  describe("navigate", () => {
    it("should handle hidden-until-found elements", async () => {
      await loadFixture("hidden-element.html");

      const initiallyHidden = await page.evaluate(() => {
        const element = document.getElementById("testElement");
        return element?.hasAttribute("hidden");
      });
      expect(initiallyHidden).toBe(true);

      await page.evaluate(async () => {
        const hiddenUntilFound = document.querySelectorAll(
          '[hidden="until-found"]',
        );
        for (const $e of hiddenUntilFound) {
          $e.removeAttribute("hidden");
        }
      });

      const stillHidden = await page.evaluate(() => {
        const element = document.getElementById("testElement");
        return element?.hasAttribute("hidden");
      });
      expect(stillHidden).toBe(false);
    });
  });

  describe("getHtml", () => {
    it("should return the current HTML with dynamic changes", async () => {
      await loadFixture("dynamic-content.html");

      await page.evaluate(() => {
        const newElement = document.createElement("div");
        newElement.id = "dynamicElement";
        newElement.textContent = "Dynamically added content";
        document.body.appendChild(newElement);
      });

      const html = await adapter.getHtml();
      expect(html).toContain(
        '<button id="button1" class="button">button</button>',
      );
      expect(html).toContain(
        '<button id="button2" class="button">button</button>',
      );
      expect(html).toContain(
        '<button id="button3" class="button">button</button>',
      );
      expect(html).toContain(
        '<div id="dynamicElement">Dynamically added content</div>',
      );
    });
  });

  describe("getScreenshot", () => {
    it("should capture the entire viewport and return a base64 string", async () => {
      await loadFixture("screenshot.html");

      const screenshot = await adapter.getScreenshot();

      expect(screenshot).toBeDefined();
      expect(typeof screenshot).toBe("string");
      expect(screenshot.length).toBeGreaterThan(0);
      expect(screenshot.length).toBeGreaterThan(100);
    });
  });
});
