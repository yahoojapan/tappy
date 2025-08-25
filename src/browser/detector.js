(() => {
  /**
   * Check if small is inside large
   * @param {DOMRect} small
   * @param {DOMRect} large
   * @returns {boolean}
   */
  const rectInRect = (small, large) => {
    return (
      large.left <= small.left &&
      large.top <= small.top &&
      small.right <= large.right &&
      small.bottom <= large.bottom
    );
  };

  /**
   * If parent element's opacity is 0, child elements are also invisible, so recursively check if opacity is 0
   * @param {Element} $e
   * @returns {boolean}
   */
  const checkElementOpacityIsZero = ($e) => {
    let $target = $e;
    let is = false;

    while ($target !== null) {
      const styles = getComputedStyle($target);

      if (styles["opacity"] === "0") {
        is = true;
        break;
      }

      $target = $target.parentElement;
    }

    return is;
  };

  /**
   * Check if $e is invisible (if parent element's visibility is hidden, child elements are also hidden)
   * @param {Element} $e
   * @returns {boolean}
   */
  const isHidden = ($e) => {
    return (
      getComputedStyle($e)["visibility"] === "hidden" ||
      checkElementOpacityIsZero($e)
    );
  };

  const elements = [];

  // Actually an array
  // Passed by the adapter
  const acceptedTagNames = "{{arg0}}";
  const acceptedEventNames = "{{arg1}}";

  // Get elements with specific events from elements excluding <a /> and non-rendering tags
  Array.from(
    document.querySelectorAll(
      ":not(html, head, link, title, style, script, meta, body, a)",
    ),
    ($e) => {
      if (isHidden($e)) {
        return;
      }

      const eventNames = Object.keys(getEventListeners($e));

      if (
        !acceptedTagNames.includes($e.tagName) &&
        !eventNames.some((a) => acceptedEventNames.includes(a))
      ) {
        return;
      }

      // Add data-tappy attribute to already explored elements
      $e.setAttribute("data-tappy", "");
      elements.push($e);
    },
  );

  Array.from(document.querySelectorAll("label:not([data-tappy])"), ($e) => {
    if (isHidden($e)) {
      return;
    }

    const a = $e.getAttribute("for");

    if (a && document.getElementById(a)) {
      elements.push($e);
    }
  });

  Array.from(document.querySelectorAll("a"), ($e) => {
    let childIsLargerThanParent = false;
    const aRect = $e.getBoundingClientRect();

    for (const $child of $e.children) {
      const rect = $child.getBoundingClientRect();

      // If <a /> completely surrounds the child element, exclude the child element from prediction
      if (rectInRect(rect, aRect)) {
        continue;
      }

      // If the child element is larger than <a />, exclude <a /> from prediction
      if (rectInRect(aRect, rect)) {
        childIsLargerThanParent = true;
      }

      elements.push($child);
    }

    if (!childIsLargerThanParent) {
      elements.push($e);
    }
  });

  return JSON.stringify(elements.map(($e) => $e.getBoundingClientRect()));
})();
