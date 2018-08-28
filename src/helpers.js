/**
 * Determines if the given href does not starts with "javascript:"
 * @param href
 * @returns {boolean}
 */
export const isAllowedHref = href =>
  !href.replace(/\s+/g, "").match(/^javascript:/i);
