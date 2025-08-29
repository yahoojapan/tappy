import { erf } from "mathjs";
import type { Adapter, AnalyzeResult, Device } from "./types.js";
import { pixelToMm } from "./utils/unit.js";

export class Tappy {
  private adapter: Adapter;

  constructor(adapter: Adapter) {
    this.adapter = adapter;
  }

  async analyze(url: string, device: Device): Promise<AnalyzeResult> {
    await this.adapter.navigate(url, device);

    const elements = await this.adapter.getTappableElements();
    const screenshot = await this.adapter.getScreenshot();
    const html = await this.adapter.getHtml();

    const resultElements = elements.map((element) => {
      const mmWidth = pixelToMm(element.width, device.ppi, device.scaleFactor);
      const mmHeight = pixelToMm(element.height, device.ppi, device.scaleFactor);
      const sigmaX = Math.sqrt(0.0091 * mmWidth ** 2 + 1.0949);
      const sigmaY = Math.sqrt(0.0149 * mmHeight ** 2 + 0.9414);
      const tapSuccessRate =
        erf(mmWidth / (2 * Math.sqrt(2) * sigmaX)) *
        erf(mmHeight / (2 * Math.sqrt(2) * sigmaY));

      return {
        ...element,
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
