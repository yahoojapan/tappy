import fs from "node:fs";
import libpath from "node:path";
import type { Page } from "puppeteer";
import {
  DEFAULT_ACCEPTED_EVENT_NAMES,
  DEFAULT_ACCEPTED_TAG_NAMES,
} from "../constants.js";
import type { Adapter, Device, TappableElement } from "../types.js";

export class PuppeteerAdapter implements Adapter {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string, device: Device): Promise<void> {
    await this.page.setViewport({
      width: device.width,
      height: device.height,
      deviceScaleFactor: device.scale,
    });
    await this.page.goto(url);
    await this.page.evaluate(async () => {
      const hiddenUntilFound = document.querySelectorAll(
        '[hidden="until-found"]',
      );
      for (const $e of hiddenUntilFound) {
        $e.removeAttribute("hidden");
      }
    });
  }

  async getScreenshot(): Promise<string> {
    const cdp = await this.page.createCDPSession();

    const { data: screenshot } = await cdp.send("Page.captureScreenshot", {
      format: "webp",
      clip: {
        x: 0,
        y: 0,
        width: this.page.viewport()?.width || 0,
        height: Math.min(
          await this.page.evaluate(() => document.documentElement.scrollHeight),
          5000,
        ),
        scale: this.page.viewport()?.deviceScaleFactor ?? 1,
      },
      captureBeyondViewport: true,
    });

    return screenshot;
  }

  async getHtml(): Promise<string> {
    return this.page.content();
  }

  async getTappableElements(): Promise<TappableElement[]> {
    const cdp = await this.page.createCDPSession();

    const ratio =
      (this.page.viewport()?.width || 0) /
      (await this.page.evaluate(() => window.innerWidth));

    const origin = await this.page.evaluate(
      () =>
        document.documentElement.getBoundingClientRect().toJSON() as DOMRect,
    );

    const detector = fs
      .readFileSync(libpath.join(process.cwd(), "src/browser/detector.js"), {
        encoding: "utf-8",
      })
      .replace('"{{arg0}}"', JSON.stringify(DEFAULT_ACCEPTED_TAG_NAMES))
      .replace('"{{arg1}}"', JSON.stringify(DEFAULT_ACCEPTED_EVENT_NAMES));

    const {
      result: { value: evaluated },
    } = await cdp.send("Runtime.evaluate", {
      expression: detector,
      includeCommandLineAPI: true,
    });

    const results: TappableElement[] = [];

    for (const rect of JSON.parse(evaluated) as DOMRect[]) {
      if (rect.width === 0 || rect.height === 0) {
        continue;
      }

      results.push({
        width: rect.width * ratio,
        height: rect.height * ratio,
        left: (rect.left - origin.left) * ratio,
        top: (rect.top - origin.top) * ratio,
      });
    }

    return results;
  }
}
