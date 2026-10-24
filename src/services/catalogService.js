/**
 * BombayBooze Catalog API Service
 * Handles communication with the FastAPI backend catalog endpoints:
 * 1. GET /api/categories
 * 2. GET /api/categories/{category_id}/products
 * 3. GET /api/products
 * 4. GET /api/products/{product_id}
 */

import { MOCK_PRODUCTS, CATEGORIES } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Fallback category visuals when database categories don't have images
 */
const CATEGORY_META = {
  'Whisky': {
    image: '/images/premium_whisky.png',
    tagline: 'Single Malts & Blended Scotch',
    badge: 'Popular',
  },
  'Vodka': {
    image: '/images/premium_whisky.png',
    tagline: 'Crisp, Clean & Triple Distilled',
    badge: 'Best Seller',
  },
  'Rum': {
    image: '/images/premium_whisky.png',
    tagline: 'Dark, Spiced & Caribbean Gold',
    badge: 'Trending',
  },
  'Gin': {
    image: '/images/craft_beer.png',
    tagline: 'Botanical & Artisanal Distills',
    badge: 'Craft',
  },
  'Tequila': {
    image: '/images/premium_whisky.png',
    tagline: '100% Blue Agave Reposado & Blanco',
    badge: 'Top Shelf',
  },
  'Brandy & Cognac': {
    image: '/images/red_wine.png',
    tagline: 'Aged French Cognac & Fine Brandy',
    badge: 'Luxury',
  },
  'Liqueur': {
    image: '/images/red_wine.png',
    tagline: 'Velvety Creams & Aperitifs',
    badge: 'Dessert',
  },
  'Wine': {
    image: '/images/red_wine.png',
    tagline: 'Full-Bodied Reds & Crisp Whites',
    badge: 'Selected',
  },
  'Beer': {
    image: '/images/craft_beer.png',
    tagline: 'Chilled Craft IPAs & Premium Lagers',
    badge: 'Express 30m',
  },
};

export const PLACEHOLDER_IMAGE = '/placeholder/image-unavailable.svg';

/**
 * Clean & normalize a backend product object into a standard format.
 * Directly uses the image_url from the API response, falling back to
 * image-unavailable.svg if no image URL is provided.
 */
export function normalizeProduct(p) {
  if (!p) return null;

  const id = p.product_id ?? p.id;
  const categoryName = p.category_name ?? p.category ?? 'Spirits';

  // Extract raw image URL from API response
  const rawUrl = p.image_url ?? p.image;
  let finalImageUrl = PLACEHOLDER_IMAGE;

  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
    const trimmed = rawUrl.trim();
    if (trimmed.includes('/static/')) {
      // Normalize any full URL (http://127.0.0.1:8000/static/... or http://localhost:8000/static/...)
      // to the same-origin relative path '/static/...'
      finalImageUrl = trimmed.substring(trimmed.indexOf('/static/'));
    } else if (trimmed.startsWith('static/')) {
      finalImageUrl = `/${trimmed}`;
    } else {
      finalImageUrl = trimmed;
    }
  }

  const hasRealImage = p.has_image ?? (!finalImageUrl.includes('image-unavailable.svg'));

  return {
    id: id,
    productId: id,
    categoryId: p.category_id ?? (typeof p.category === 'number' ? p.category : null),
    category: categoryName,
    categoryName: categoryName,
    sku: p.sku || `SKU-${id}`,
    name: p.name || 'Unnamed Spirit',
    brand: p.brand || null,
    description: p.description || '',
    abv: p.abv != null ? Number(p.abv) : null,
    volume_ml: p.volume_ml || 750,
    volume: p.volume_ml ? `${p.volume_ml}ml` : (p.volume || '750ml'),
    price: typeof p.price === 'number' ? p.price : parseFloat(p.price || 0),
    quantityInStock: p.quantity_in_stock ?? 25,
    inStock: p.in_stock ?? (p.quantity_in_stock == null || p.quantity_in_stock > 0),
    image: finalImageUrl,
    imageUrl: finalImageUrl,
    hasImage: hasRealImage,
  };
}

/**
 * Fetch all categories from GET /api/categories
 */
export async function getCategories() {
  const endpoints = [
    `${API_BASE}/api/categories`,
    'http://localhost:8000/api/categories',
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map(cat => ({
            categoryId: cat.category_id,
            name: cat.name,
            description: cat.description,
            productCount: cat.product_count,
            image: CATEGORY_META[cat.name]?.image || '/images/premium_whisky.png',
            tagline: CATEGORY_META[cat.name]?.tagline || cat.description || 'Premium selection',
            badge: CATEGORY_META[cat.name]?.badge || null,
          }));
        }
      }
    } catch {
      // Continue to next endpoint or fallback
    }
  }

  // Graceful fallback to default categories if API is not running
  return CATEGORIES.filter(c => c !== 'All').map((name, idx) => ({
    categoryId: idx + 1,
    name,
    description: `Curated ${name.toLowerCase()} selection`,
    productCount: MOCK_PRODUCTS.filter(p => p.category === name).length,
    image: CATEGORY_META[name]?.image || '/images/premium_whisky.png',
    tagline: CATEGORY_META[name]?.tagline || 'Finest selection',
    badge: CATEGORY_META[name]?.badge || null,
  }));
}

/**
 * Fetch products for a specific category using GET /api/categories/{category_id}/products
 */
export async function getCategoryProducts(categoryId, { inStockOnly = false, page = 1, pageSize = 20 } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    in_stock_only: String(inStockOnly),
  });

  const endpoints = [
    `${API_BASE}/api/categories/${categoryId}/products?${query}`,
    `http://localhost:8000/api/categories/${categoryId}/products?${query}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        return {
          items: (data.items || []).map(normalizeProduct),
          total: data.total || 0,
          page: data.page || page,
          pageSize: data.page_size || pageSize,
          totalPages: data.total_pages || 1,
        };
      }
    } catch {
      // Try next or fallback
    }
  }

  // Fallback to local mock data filtered by category
  const catObj = (await getCategories()).find(c => c.categoryId === categoryId);
  const catName = catObj ? catObj.name : null;
  const filtered = catName 
    ? MOCK_PRODUCTS.filter(p => p.category === catName)
    : MOCK_PRODUCTS;

  return {
    items: filtered.map(normalizeProduct),
    total: filtered.length,
    page: 1,
    pageSize: pageSize,
    totalPages: 1,
  };
}

/**
 * Fetch products via GET /api/products (supports category_id, search term q, pagination)
 */
export async function getProducts({ categoryId = null, q = '', inStockOnly = false, page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    in_stock_only: String(inStockOnly),
  });
  if (categoryId != null) params.append('category_id', String(categoryId));
  if (q && q.trim().length >= 2) params.append('q', q.trim());

  const endpoints = [
    `${API_BASE}/api/products?${params}`,
    `http://localhost:8000/api/products?${params}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        return {
          items: (data.items || []).map(normalizeProduct),
          total: data.total || 0,
          page: data.page || page,
          pageSize: data.page_size || pageSize,
          totalPages: data.total_pages || 1,
        };
      }
    } catch {
      // Try next or fallback
    }
  }

  // Fallback
  let filtered = MOCK_PRODUCTS;
  if (q && q.trim().length >= 2) {
    const queryLower = q.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(queryLower));
  }
  return {
    items: filtered.map(normalizeProduct),
    total: filtered.length,
    page: 1,
    pageSize: pageSize,
    totalPages: 1,
  };
}

export default {
  getCategories,
  getCategoryProducts,
  getProducts,
  normalizeProduct,
};
