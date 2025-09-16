/**
 * Decode HTML entities in a string
 * @param html - The HTML string with encoded entities
 * @returns Decoded HTML string
 */
export function decodeHtmlEntities(html: string): string {
  if (!html) return '';
  
  // Create a temporary DOM element to decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

/**
 * Encode HTML entities in a string
 * @param html - The HTML string to encode
 * @returns Encoded HTML string
 */
export function encodeHtmlEntities(html: string): string {
  if (!html) return '';
  
  const textarea = document.createElement('textarea');
  textarea.textContent = html;
  return textarea.innerHTML;
}
