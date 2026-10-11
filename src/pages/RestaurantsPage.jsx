import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, SlidersHorizontal, MapPin, X, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchRestaurants } from '../api/restaurants.js';
import RestaurantCard from '../components/RestaurantCard.jsx';
import RestaurantDetailModal from '../components/RestaurantDetailModal.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';

const CATEGORIES = [
  { id: 'all', label: 'All Curated Venues' },
  { id: 'favorites', label: 'Saved Favorites' },
  { id: 'bistro', label: 'Artisanal & Bistro' },
  { id: 'heritage', label: 'Heritage & Regional' },
];

export default function RestaurantsPage() {
  const { token, isMockMode, toggleMockMode } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [meta, setMeta] = useState({ total_pages: 1, total_count: 0, page: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Selected for Modal view
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const loadData = useCallback(async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRestaurants({
        token,
        cityId: '118',
        page: targetPage,
        useMock: isMockMode,
      });
      setRestaurants(data.restaurants || []);
      setMeta(data.meta || { total_pages: 1, total_count: (data.restaurants || []).length, page: targetPage });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token, isMockMode, page]);

  // Load when page or mock mode changes
  useEffect(() => {
    loadData(page);
  }, [page, isMockMode, loadData]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (meta.total_pages || 1)) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered & Sorted List
  const filteredRestaurants = useMemo(() => {
    let list = [...restaurants];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.id.includes(q)
      );
    }

    // Category filter
    if (activeCategory === 'favorites') {
      try {
        const favs = JSON.parse(localStorage.getItem('foodly_favorites') || '[]');
        list = list.filter(r => favs.includes(r.id));
      } catch {
        list = [];
      }
    } else if (activeCategory === 'bistro') {
      list = list.filter(r => r.cuisine.toLowerCase().includes('bistro') || r.cuisine.toLowerCase().includes('artisanal'));
    } else if (activeCategory === 'heritage') {
      list = list.filter(r => r.cuisine.toLowerCase().includes('heritage') || r.cuisine.toLowerCase().includes('regional') || r.cuisine.toLowerCase().includes('royal'));
    }

    // Sorting
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'id') {
      list.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    }

    return list;
  }, [restaurants, searchQuery, activeCategory, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('default');
  };

  return (
    <div style={{ flex: 1, paddingBottom: 64 }}>
      {/* Editorial Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: '36px 0 28px',
        }}
      >
        <div className="content-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className="badge badge-accent">
                  <Sparkles size={12} />
                  Verified Registry
                </span>
                <span className="badge badge-sage">
                  <MapPin size={12} />
                  City 118 (NCR)
                </span>
              </div>
              <h1 className="heading-display">
                Discover Great Food Near You
              </h1>
              <p className="text-muted" style={{ marginTop: 8, fontSize: '1.05rem', lineHeight: 1.4 }}>
                Explore handpicked dining destinations, craft coffee spots, and celebrated kitchens.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div
              style={{
                backgroundColor: 'var(--color-sage)',
                padding: '12px 20px',
                borderRadius: 'var(--radius-control)',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div>
                <p className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Venues
                </p>
                <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
                  {meta.total_count || restaurants.length}
                </p>
              </div>
              <div style={{ width: 1, height: 32, backgroundColor: 'var(--color-border)' }} />
              <div>
                <p className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  City Code
                </p>
                <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
                  #118
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div
              className="form-control-row"
              style={{
                flex: '1 1 280px',
                borderRadius: 'var(--radius-pill)',
                padding: '0 16px',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <Search size={18} color="var(--color-muted)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search by restaurant name, address, or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '12px 10px', fontSize: '0.925rem' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn-icon"
                  style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={16} color="var(--color-muted)" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div
              className="form-control-row"
              style={{
                flex: '0 0 auto',
                borderRadius: 'var(--radius-pill)',
                padding: '0 14px',
                backgroundColor: 'var(--color-bg)',
                gap: 8,
              }}
            >
              <ArrowUpDown size={16} color="var(--color-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  outline: 'none',
                  cursor: 'pointer',
                  paddingRight: 6,
                }}
                aria-label="Sort restaurants"
              >
                <option value="default">Sort: Recommended</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="id">Sort: Newest (ID)</option>
              </select>
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 16,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.id === 'favorites' && <Heart size={14} fill={activeCategory === 'favorites' ? '#FFF' : 'none'} />}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="content-wrapper" style={{ marginTop: 32 }}>
        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState
            error={error}
            onRetry={() => loadData(page)}
            onSwitchMock={() => toggleMockMode(true)}
          />
        ) : filteredRestaurants.length === 0 ? (
          <EmptyState
            title={activeCategory === 'favorites' ? 'No Saved Restaurants' : 'No Venues Found'}
            message={
              activeCategory === 'favorites'
                ? 'You have not favorited any restaurants yet. Tap the heart icon on any card to save it here.'
                : 'No venues match your current filter or search criteria.'
            }
            onReset={resetFilters}
          />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p className="text-sm text-muted">
                Showing <strong style={{ color: 'var(--color-text)' }}>{filteredRestaurants.length}</strong> venues in City 118
              </p>
              {meta.total_pages > 1 && (
                <span className="text-xs text-muted">
                  Page {page} of {meta.total_pages}
                </span>
              )}
            </div>

            <div className="restaurant-grid">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelect={(r) => setSelectedRestaurant(r)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {meta.total_pages > 1 && (
              <div
                style={{
                  marginTop: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="btn btn-secondary"
                  style={{ minHeight: 42, padding: '8px 16px' }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div style={{ display: 'flex', gap: 6 }}>
                  {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`btn ${page === p ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        minHeight: 40,
                        width: 40,
                        padding: 0,
                        borderRadius: 'var(--radius-control)',
                        fontWeight: page === p ? 700 : 500,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= meta.total_pages}
                  className="btn btn-secondary"
                  style={{ minHeight: 42, padding: '8px 16px' }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Restaurant Detail Modal */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </div>
  );
}
