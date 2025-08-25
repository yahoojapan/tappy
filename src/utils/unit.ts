export function pixelToMm(pixel: number, ppi: number, scale: number): number {
  return (pixel * 25.4) / (ppi / scale);
}
