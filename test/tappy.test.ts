import { describe, expect, it, vitest } from "vitest";
import type { PuppeteerAdapter } from "../src/adapters/puppeteer.js";
import { Tappy } from "../src/tappy.js";
import type { Device, TappableElement } from "../src/types.js";

describe("Tappy", () => {
  it("should analyze a page and return correct results", async () => {
    const mockDevice: Device = {
      name: "MockDevice",
      width: 800,
      height: 600,
      scaleFactor: 2,
      ppi: 96,
    };

    const mockAdapter = {
      navigate: vitest.fn().mockReturnValue(undefined),
      getTappableElements: vitest
        .fn()
        .mockReturnValue([
          { left: 10, top: 20, width: 100, height: 50 } as TappableElement,
          { left: 150, top: 20, width: 200, height: 30 } as TappableElement,
        ]),
      getScreenshot: vitest.fn().mockReturnValue("base64_image_data"),
      getHtml: vitest.fn().mockReturnValue("<html><body>Test</body></html>"),
    };

    const tappy = new Tappy(mockAdapter as unknown as PuppeteerAdapter);

    const result = await tappy.analyze("https://example.com", mockDevice);

    expect(mockAdapter.navigate).toHaveBeenCalledWith(
      "https://example.com",
      mockDevice,
    );
    expect(mockAdapter.getTappableElements).toHaveBeenCalled();
    expect(mockAdapter.getScreenshot).toHaveBeenCalled();
    expect(mockAdapter.getHtml).toHaveBeenCalled();

    expect(result).toHaveProperty("elements");
    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("screenshot");
    expect(result.elements).toHaveLength(2);
    expect(result.html).toBe("<html><body>Test</body></html>");
    expect(result.screenshot).toBe("base64_image_data");

    expect(result.elements[0]).toBeDefined();
    expect(result.elements[1]).toBeDefined();
    expect(result.elements[0]).toHaveProperty("widthMm");
    expect(result.elements[1]).toHaveProperty("widthMm");
    expect(result.elements[0]).toHaveProperty("heightMm");
    expect(result.elements[1]).toHaveProperty("heightMm");
    expect(result.elements[0]).toHaveProperty("tapSuccessRate");
    expect(result.elements[1]).toHaveProperty("tapSuccessRate");

    const firstElement = result.elements[0];

    if (firstElement) {
      expect(typeof firstElement.tapSuccessRate).toBe("number");
      expect(firstElement.tapSuccessRate).toBeGreaterThan(0);
      expect(firstElement.tapSuccessRate).toBeLessThan(1);
    }
  });

  it("should handle errors from adapter methods", async () => {
    const mockDevice: Device = {
      name: "MockDevice",
      width: 800,
      height: 600,
      scaleFactor: 2,
      ppi: 96,
    };

    const mockAdapter = {
      setViewport: vitest.fn().mockReturnValue(undefined),
      navigate: vitest.fn().mockImplementation(() => {
        throw new Error("Navigation failed");
      }),
      getTappableElements: vitest.fn(),
      getScreenshot: vitest.fn(),
      getHtml: vitest.fn(),
    };

    const tappy = new Tappy(mockAdapter as unknown as PuppeteerAdapter);

    await expect(
      tappy.analyze("https://example.com", mockDevice),
    ).rejects.toThrow("Navigation failed");
  });
});
