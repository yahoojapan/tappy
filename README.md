<div align="center">
  <img width="828" src="./logo/tappy-logo-horizontal.png" alt="Tappy" />
</div>


---

[![npm version](https://badgen.net/npm/v/@lycorp-jp/tappy)](https://www.npmjs.com/package/@lycorp-jp/tappy)
[![Github Action](https://github.com/yahoojapan/tappy/actions/workflows/ci.yml/badge.svg)](https://github.com/yahoojapan/tappy/actions/workflows/ci.yml)

Analyze the sizes of buttons, links, and other elements on web pages, and output the tap success rate.

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
  scaleFactor: 3,
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

## Citation

```bibtex
@misc{usuba2024tappy,
      title={Tappy: Predicting Tap Accuracy of User-Interface Elements by Reverse-Engineering Webpage Structures},
      author={Hiroki Usuba and Junichi Sato and Naomi Sasaya and Shota Yamanaka and Fumiya Yamashita},
      year={2024},
      eprint={2403.03097},
      archivePrefix={arXiv},
      primaryClass={cs.HC},
      url={https://arxiv.org/abs/2403.03097},
}
```
