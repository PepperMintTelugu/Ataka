/**
 * Convert a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\-]+/g, "-") // Replace spaces and hyphens with single hyphen
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, ""); // Trim hyphens from end
}

/**
 * Convert a slug back to display text (capitalize first letters)
 * @param slug The slug to convert back
 * @returns Display-friendly text
 */
export function slugToText(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get author URL path
 * @param authorName The author's name
 * @returns URL path for the author
 */
export function getAuthorPath(authorName: string): string {
  return `/author/${createSlug(authorName)}`;
}

/**
 * Get publisher URL path
 * @param publisherName The publisher's name
 * @returns URL path for the publisher
 */
export function getPublisherPath(publisherName: string): string {
  return `/publisher/${createSlug(publisherName)}`;
}
