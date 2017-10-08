
/**
 * Find closest parent which match selector.
 * @param {Element} el
 * @param {String} selector
 * @param {String} stopSelector
 */
export function closest(el, selector, stopSelector) {
  var retval = null;
  while (el) {
    if (el.matches(selector)) {
      retval = el;
      break;
    } else if (stopSelector && el.matches(stopSelector)) {
      break;
    }
    el = el.parentElement;
  }
  return retval;
}
