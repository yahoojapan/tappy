export const DEFAULT_ACCEPTED_TAG_NAMES = [
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
];

export const DEFAULT_ACCEPTED_EVENT_NAMES = [
  /**
   * Touch Events
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
   */
  "touchstart",
  "touchend",
  "touchcancel",
  "touchmove",
  /**
   * Pointer Events
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
   */
  "pointerover",
  "pointerenter",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointercancel",
  "pointerout",
  "pointerleave",
  "gotpointercapture",
  "lostpointercapture",
  /**
   * UI Events
   * @note abort, error, load, & unload events are intentionally excluded
   * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events
   */
  "auxclick",
  "beforeinput",
  "blur",
  "click",
  "compositionend",
  "compositionstart",
  "compositionupdate",
  "contextmenu",
  "dblclick",
  "focus",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keypress",
  "keyup",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "wheel",
];
