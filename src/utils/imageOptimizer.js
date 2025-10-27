/**
 * Utility functions for image optimization
 */

/**
 * Get optimized image URL with width and quality parameters
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @param {number} options.width - Desired width in pixels
 * @param {number} options.quality - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (url, { width = 300, quality = 80 } = {}) => {
  if (!url) return '';

  // Marvel CDN example (kept for completeness if used later)
  if (url.includes('i.annihil.us')) {
    return url; // keep original; variants depend on provided path
  }

  // For hosts that block hotlinking (e.g., superherodb.com), route through proxy
  try {
    const u = new URL(url);
    const allowedHosts = new Set([
      'www.superherodb.com',
      'superherodb.com'
    ]);
    if (allowedHosts.has(u.hostname)) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
  } catch (_) {
    // If URL constructor fails, fall back to original
  }

  return url;
};

// Build a slug from a hero name for Akabab dataset URLs
export const toSlug = (name = '') =>
  name
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// Construct Akabab dataset image URL as a fallback
export const getAkababImageUrl = (hero, size = 'md') => {
  if (!hero || !hero.id || !hero.name) return '';
  const slug = toSlug(hero.name);
  return `https://akabab.github.io/superhero-api/api/images/${size}/${hero.id}-${slug}.jpg`;
};

// Prefer official image URL (proxied when needed); callers can use onError to swap to Akabab
export const getHeroImageUrl = (hero, { size = 'md' } = {}) => {
  if (!hero) return '';
  const primary = getOptimizedImageUrl(hero.image?.url || '');
  if (primary) return primary;
  return getAkababImageUrl(hero, size);
};

/**
 * Preload an image to improve perceived performance
 * @param {string} url - Image URL to preload
 */
export const preloadImage = (url) => {
  if (!url) return;
  
  const img = new Image();
  img.src = url;
};

/**
 * Get appropriate image size based on device
 * @returns {number} Appropriate image width for current device
 */
export const getResponsiveImageSize = () => {
  if (typeof window === 'undefined') return 300; // Default for SSR
  
  const width = window.innerWidth;
  
  if (width < 640) return 150; // Small mobile
  if (width < 768) return 200; // Mobile
  if (width < 1024) return 250; // Tablet
  return 300; // Desktop
};
