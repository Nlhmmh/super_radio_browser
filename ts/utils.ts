/**
 * Truncates a string if it exceeds a specified max length.
 * @param {string} str The input string.
 * @param {number} maxLength The maximum allowed length.
 * @returns {string} The truncated string.
 */
export const truncateString = (str, maxLength = 15) => {
  if (!str) return ''
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...'
  }
  return str
}
