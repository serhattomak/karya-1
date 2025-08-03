/**
 * Create a URL-friendly slug from a string
 * @param {string} text - The text to convert to slug
 * @returns {string} - URL-friendly slug
 */
export function createSlug(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Create slug from product object
 * @param {Object} product - Product object with name property
 * @returns {string} - Product slug
 */
export function createSlugFromProduct(product) {
  if (!product || !product.name) return '';
  return createSlug(product.name);
}

/**
 * Get product URL with slug
 * @param {Object} product - Product object
 * @returns {string} - Product URL with slug
 */
export function getProductUrl(product) {
  if (!product) return '/products';
  
  // Use backend slug if available, otherwise generate from name
  const slug = product.slug || createSlugFromProduct(product);
  return `/product/${slug}`;
}

/**
 * Get page URL with slug
 * @param {Object} page - Page object
 * @returns {string} - Page URL with slug
 */
export function getPageUrl(page) {
  if (!page) return '/';
  
  // Use backend slug if available, otherwise generate from name
  const slug = page.slug || createSlug(page.name);
  return `/${slug}`;
}
