
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


export function createSlugFromProduct(product) {
  if (!product || !product.name) return '';
  return createSlug(product.name);
}


export function getProductUrl(product) {
  if (!product) return '/products';
  const slug = product.slug || createSlugFromProduct(product);
  return `/product/${slug}`;
}

export function getPageUrl(page) {
  if (!page) return '/';
  const slug = page.slug || createSlug(page.name);
  return `/${slug}`;
}
