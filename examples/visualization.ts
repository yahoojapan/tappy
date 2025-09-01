import { type Device, Tappy } from "@lycorp-jp/tappy";
import { PuppeteerAdapter } from "@lycorp-jp/tappy/adapters";
import { visualize } from "@lycorp-jp/tappy/utils";
import puppeteer from "puppeteer";

const device: Device = {
  name: "iPhone 12 Pro",
  width: 390,
  height: 844,
  scaleFactor: 3,
  ppi: 460,
};

const browser = await puppeteer.launch();
const page = await browser.newPage();

const adapter = new PuppeteerAdapter(page);
await adapter.page.setViewport({
  width: device.width,
  height: device.height,
  deviceScaleFactor: device.scaleFactor,
  isMobile: true,
});
await adapter.page.goto("https://example.com/");

const tappy = new Tappy(adapter);
const result = await tappy.analyze(device);

visualize(result, "output");

await browser.close();
