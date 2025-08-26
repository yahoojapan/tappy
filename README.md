<div align="center">
  <img width="828" src="./logo/tappy-logo-horizontal.png" alt="Tappy" />
</div>

---

[![Github Action](https://github.com/yahoojapan/tappy/actions/workflows/ci.yml/badge.svg)](https://github.com/yahoojapan/tappy/actions/workflows/ci.yml)

Tappy analyzes the size of buttons, links, and other interactive elements on smartphone web screens and displays tap success rates.

## Installation

```bash
npm install @lycorp-jp/tappy puppeteer
# or
yarn add @lycorp-jp/tappy puppeteer
# or
pnpm add @lycorp-jp/tappy puppeteer
```

## Usage

```typescript
import { type Device, Tappy } from "@lycorp-jp/tappy";
import { PuppeteerAdapter } from "@lycorp-jp/tappy/adapters";
import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();

const adapter = new PuppeteerAdapter(page);
const tappy = new Tappy(adapter);

// For accurate device specs, refer to: https://www.ios-resolution.com/
const device: Device = {
  name: "iPhone 12 Pro",
  width: 390,
  height: 844,
  scale: 3,
  ppi: 460,
};

const result = await tappy.analyze("https://example.com", device);

console.log(result.elements);

// Example output:
// [
//   {
//     width: 136.984375,      // Element width in CSS pixels
//     height: 18,             // Element height in CSS pixels
//     left: 32,               // X position from left edge
//     top: 200.875,           // Y position from top edge
//     tapSuccessRate: 0.8497559260608007  // Success rate (0-1, where 1 is 100%)
//   }
// ]

await browser.close();
```

Check out the [examples](./examples) directory for other usage

## Contributing

Please see [CONTRIBUTING](./CONTRIBUTING.md) for details on how to get started.

## Project status

This package is in early development stage. The API may change significantly between releases without prior notice. Please use with caution in production environments.
