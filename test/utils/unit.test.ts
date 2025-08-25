import { describe, expect, it } from "vitest";
import { pixelToMm } from "../../src/utils/unit.js";

describe("pixelToMm", () => {
  it("converts pixels to millimeters correctly with basic values", () => {
    const result = pixelToMm(100, 96, 1);
    expect(result).toBeCloseTo(26.458, 3);
  });

  it("handles high DPI displays with scale factor", () => {
    const result = pixelToMm(200, 192, 2);
    expect(result).toBeCloseTo(52.917, 3);
  });

  it("works with fractional pixel values", () => {
    const result = pixelToMm(150.5, 96, 1);
    expect(result).toBeCloseTo(39.82, 3);
  });

  it("handles different PPI values", () => {
    const result = pixelToMm(72, 72, 1);
    expect(result).toBeCloseTo(25.4, 3);
  });

  it("works with scale factor greater than 1", () => {
    const result = pixelToMm(100, 96, 2);
    expect(result).toBeCloseTo(52.917, 3);
  });

  it("works with scale factor less than 1", () => {
    const result = pixelToMm(100, 96, 0.5);
    expect(result).toBeCloseTo(13.229, 3);
  });

  it("handles zero pixel value", () => {
    const result = pixelToMm(0, 96, 1);
    expect(result).toBe(0);
  });

  it("handles large pixel values", () => {
    const result = pixelToMm(1920, 96, 1);
    expect(result).toBeCloseTo(508, 0);
  });
});
