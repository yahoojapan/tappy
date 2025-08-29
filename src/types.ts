/**
 * Represents a device with specific characteristics.
 */
export type Device = {
  /**
   * The name of the device.
   */
  name: string;

  /**
   * The width of the device in pixels.
   */
  width: number;

  /**
   * The height of the device in pixels.
   */
  height: number;

  /**
   * The pixels per inch (PPI) of the device.
   */
  ppi: number;

  /**
   * The scale factor of the device.
   */
  scale: number;
};

/**
 * Represents a tappable element
 * Defines the position and size of UI elements
 *
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */
export type TappableElement = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Adapter interface that abstracts interactions with browsers
 * @interface Adapter
 */
export interface Adapter {
  /**
   * Navigate to the specified URL
   * @param {string} url
   * @param {Device} device
   * @returns {Promise<void>}
   */
  navigate: (url: string, device: Device) => Promise<void>;

  /**
   * Get a list of tappable elements on the current page
   * @returns {Promise<TappableElement[]>}
   */
  getTappableElements: () => Promise<TappableElement[]>;

  /**
   * Get the HTML of the current page
   * @returns {Promise<string>}
   */
  getHtml: () => Promise<string>;

  /**
   * Get a screenshot of the current page
   * @returns {Promise<string>}
   */
  getScreenshot: () => Promise<string>;
}

/**
 * Represents the result of analyzing a web page for tappable elements.
 *
 * @interface AnalyzeResult
 */
export type AnalyzeResult = {
  device: Device;
  elements: (TappableElement & { tapSuccessRate: number })[];
  screenshot: string;
  html: string;
};
