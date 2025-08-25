import fs from "node:fs";
import path from "node:path";
import type { AnalyzeResult, Device } from "../types.js";

export function visualize(
  device: Device,
  analyzeResult: AnalyzeResult,
  outputPath: string,
): string {
  fs.mkdirSync(outputPath, { recursive: true });

  const screenshotPath = path.join(outputPath, "screenshot.png");
  fs.writeFileSync(screenshotPath, analyzeResult.screenshot, "base64");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .container { position: relative; display: inline-block; }
    .rect {
      position: absolute;
      border: 2px solid red;
      pointer-events: none;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="screenshot.png" style="display:block; width: ${device.width}px;">
    ${analyzeResult.elements
      .map(
        (r) => `
      <div class="rect" style="
        left: ${r.left}px;
        top: ${r.top}px;
        width: ${r.width}px;
        height: ${r.height}px;
      " title="sr: ${r.tapSuccessRate}">
        <span style="position:absolute; left:0; top:0; background:rgba(255,255,255,0.7); color:#d00; font-size:12px;">${r.tapSuccessRate?.toFixed(3) ?? "-"}</span>
      </div>
    `,
      )
      .join("")}
  </div>
</body>
</html>
  `;

  fs.writeFileSync(path.join(outputPath, "page.html"), html);
  return html;
}
