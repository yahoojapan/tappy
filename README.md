<div align="center">
  <img width="828" src="./logo.png" alt="Tappy" />
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

> **Note**: Puppeteer is a peer dependency. You need to install it separately.

## Examples

Check out the [examples](./examples) directory for usage patterns:

- [Basic usage](./examples/basic.ts)
- [Visualization](./examples/visualization.ts)

## Requirements

- Node.js 20 or higher
- Puppeteer (currently the only supported browser adapter)

## License

This project is licensed under the [Apache License 2.0](LICENSE).
