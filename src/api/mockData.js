/**
 * High-fidelity fallback / mock data mirroring the Fastor Staging API schema.
 * Schema contract:
 * {
 *   restaurant_id: string,
 *   restaurant_name: string,
 *   address_complete: string,
 *   logo: string
 * }
 */

export const MOCK_RESTAURANTS_PAGE_1 = [
  {
    restaurant_id: '75',
    restaurant_name: 'VYB — Botanical Bistro',
    address_complete: 'Plot 14, Inner Circle, Connaught Place, New Delhi, 110001, India',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Modern European & Botanicals',
    rating: 4.8,
    costForTwo: '₹1,800',
    distance: '1.2 km',
    isCurated: true,
  },
  {
    restaurant_id: '74',
    restaurant_name: 'Mother India Heritage',
    address_complete: 'Kaveri Complex, BM Road, Bangalore Urban, Karnataka, 573201, India',
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Authentic Coastal & Heritage',
    rating: 4.7,
    costForTwo: '₹1,200',
    distance: '2.4 km',
    isCurated: true,
  },
  {
    restaurant_id: '68',
    restaurant_name: 'The Big Foot Roastery',
    address_complete: 'Sector 29, Leisure Valley Road, Gurugram, Haryana, 122002, India',
    logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Artisanal Coffee & Small Plates',
    rating: 4.9,
    costForTwo: '₹950',
    distance: '3.1 km',
    isCurated: false,
  },
  {
    restaurant_id: '67',
    restaurant_name: 'Osteria Del Sole',
    address_complete: 'Level 2, DLF Emporio, Vasant Kunj, New Delhi, 110070, India',
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Woodfired Italian & Cicchetti',
    rating: 4.6,
    costForTwo: '₹2,400',
    distance: '4.8 km',
    isCurated: true,
  },
  {
    restaurant_id: '66',
    restaurant_name: 'Buddy Craft Kitchen',
    address_complete: 'Shop 12, Indiranagar 100 Feet Road, Bangalore, Karnataka, 560038, India',
    logo: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Craft Brews & Smoked Meats',
    rating: 4.5,
    costForTwo: '₹1,500',
    distance: '1.9 km',
    isCurated: false,
  },
  {
    restaurant_id: '64',
    restaurant_name: 'L’Atelier Gourmand',
    address_complete: 'The Manor, 77 Friends Colony West, New Delhi, 110065, India',
    logo: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    cuisine: 'French Contemporary Gastronomy',
    rating: 4.9,
    costForTwo: '₹3,200',
    distance: '5.2 km',
    isCurated: true,
  },
  {
    restaurant_id: '62',
    restaurant_name: 'IndiStylist Tea Lounge',
    address_complete: 'Heritage Arcade, Colaba Causeway, Mumbai, Maharashtra, 400005, India',
    logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    cuisine: 'High Tea & Single Estate Brews',
    rating: 4.4,
    costForTwo: '₹1,100',
    distance: '0.8 km',
    isCurated: false,
  },
  {
    restaurant_id: '58',
    restaurant_name: 'Saffron & Silk Dining Room',
    address_complete: 'Civic Centre, Minto Road, New Delhi, 110002, India',
    logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    cuisine: 'North Indian Royal Awadhi',
    rating: 4.7,
    costForTwo: '₹2,000',
    distance: '2.0 km',
    isCurated: true,
  },
];

export const MOCK_META = {
  total_pages: 3,
  total_count: 56,
  page: 1,
};
