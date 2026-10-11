import { apiRequest, ApiError } from './client.js';
import { MOCK_RESTAURANTS_PAGE_1, MOCK_META } from './mockData.js';

// Editorial fallback imagery for restaurants whose logo is missing or broken
const EDITORIAL_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
];

/**
 * Deterministic hash to pick a pleasing photo if logo is unavailable
 */
function getFallbackImage(id, name) {
  const seed = (id || name || 'foodly').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return EDITORIAL_FALLBACK_IMAGES[seed % EDITORIAL_FALLBACK_IMAGES.length];
}

/**
 * Normalizes raw API restaurant items to ensure safe rendering in the UI
 * Keeps verified API fields (restaurant_id, restaurant_name, address_complete, logo)
 * and provides safe fallbacks for UI styling.
 */
export function normalizeRestaurant(raw, index = 0) {
  if (!raw) return null;

  const id = String(raw.restaurant_id || raw.id || `temp-${index}`);
  const name = raw.restaurant_name || raw.name || 'Unnamed Kitchen';
  const address = raw.address_complete || raw.address || 'Address on file';
  
  // Prefer provided logo, fallback to photography
  const logo = (raw.logo && typeof raw.logo === 'string' && raw.logo.startsWith('http'))
    ? raw.logo
    : getFallbackImage(id, name);

  // Extract locality or city from comma separated address
  const addressParts = address.split(',').map(s => s.trim()).filter(Boolean);
  const neighborhood = addressParts.length > 2 ? addressParts[addressParts.length - 3] : (addressParts[0] || 'Downtown');

  return {
    id,
    name,
    address,
    neighborhood,
    logo,
    rawLogo: raw.logo,
    // Editorial aesthetic helpers (non-destructive)
    cuisine: raw.cuisine || (index % 2 === 0 ? 'Artisanal & Contemporary' : 'Heritage & Regional'),
    rating: raw.rating || (4.2 + ((parseInt(id, 10) || 5) % 8) * 0.1).toFixed(1),
    distance: raw.distance || `${(0.8 + ((parseInt(id, 10) || 3) % 40) * 0.1).toFixed(1)} km`,
    costForTwo: raw.costForTwo || `₹${800 + ((parseInt(id, 10) || 2) % 15) * 100}`,
    isOpen: true,
  };
}

/**
 * Fetch restaurants for city_id=118
 * Endpoint: GET /v1/m/restaurant?city_id=118&page={page}
 */
export async function fetchRestaurants({ token, cityId = '118', page = 1, useMock = false }) {
  if (useMock) {
    // Artificial latency for realistic skeleton demonstration
    await new Promise((resolve) => setTimeout(resolve, 550));
    return {
      restaurants: MOCK_RESTAURANTS_PAGE_1.map(normalizeRestaurant),
      meta: MOCK_META,
      isMock: true,
    };
  }

  if (!token) {
    throw new ApiError('Authentication token is required to explore restaurants.', 401);
  }

  const endpoint = `/v1/m/restaurant?city_id=${encodeURIComponent(cityId)}&page=${encodeURIComponent(page)}`;
  
  const response = await apiRequest(endpoint, {
    method: 'GET',
    token,
  });

  const rawResults = response?.data?.results || (Array.isArray(response?.data) ? response.data : []);
  const meta = response?.data?.meta || {
    total_pages: 1,
    total_count: rawResults.length,
    page,
  };

  const restaurants = rawResults.map(normalizeRestaurant);

  return {
    restaurants,
    meta,
    isMock: false,
    rawResponse: response,
  };
}
