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
  
  // Check if URL is from a service that supports image optimization
  if (url.includes('i.annihil.us')) {
    // Marvel API images can be optimized with size parameters
    return `${url}/detail/portrait_${width}x${width * 1.5}.jpg`;
  }
  
  // For other URLs, we could implement a proxy service or use a CDN
  // For now, just return the original URL
  return url;
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
