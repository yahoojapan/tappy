import { type Device, Tappy } from "@lycorp-jp/tappy";
import { PuppeteerAdapter } from "@lycorp-jp/tappy/adapters";
import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();

const adapter = new PuppeteerAdapter(page);
const tappy = new Tappy(adapter);

const device: Device = {
  name: "iPhone 12 Pro",
  width: 390,
  height: 844,
  scale: 3,
  ppi: 460,
};

const result = await tappy.analyze("https://example.com", device);

console.log(result.elements);

await browser.close();
