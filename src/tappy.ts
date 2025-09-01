import { erf } from "mathjs";
import type { Adapter, AnalyzeResult, Device } from "./types.js";
import { pixelToMm } from "./utils/unit.js";

export class Tappy {
  private adapter: Adapter;

  constructor(adapter: Adapter) {
    this.adapter = adapter;
  }

  async analyze(device: Device): Promise<AnalyzeResult> {
    await this.adapter.adjustPage();

    const elements = await this.adapter.getTappableElements();
    const screenshot = await this.adapter.getScreenshot();
    const html = await this.adapter.getHtml();

    const resultElements = elements.map((element) => {
      const widthMm = pixelToMm(element.width, device.ppi, device.scaleFactor);
      const heightMm = pixelToMm(
        element.height,
        device.ppi,
        device.scaleFactor,
      );
      const sigmaX = Math.sqrt(0.0091 * widthMm ** 2 + 1.0949);
      const sigmaY = Math.sqrt(0.0149 * heightMm ** 2 + 0.9414);
      const tapSuccessRate =
        erf(widthMm / (2 * Math.sqrt(2) * sigmaX)) *
        erf(heightMm / (2 * Math.sqrt(2) * sigmaY));

      return {
        ...element,
        widthMm: widthMm,
        heightMm: heightMm,
        tapSuccessRate: tapSuccessRate,
      };
    });

    return {
      device: device,
      elements: resultElements,
      html,
      screenshot,
    };
  }
}
