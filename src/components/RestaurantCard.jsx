import React, { useState } from 'react';
import { Star, MapPin, Heart, Clock, Utensils } from 'lucide-react';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

export default function RestaurantCard({ restaurant, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('foodly_favorites') || '[]');
      return favs.includes(restaurant.id);
    } catch {
      return false;
    }
  });

  const toggleFavorite = (e) => {
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem('foodly_favorites') || '[]');
      let updated;
      if (favs.includes(restaurant.id)) {
        updated = favs.filter(id => id !== restaurant.id);
        setIsFavorite(false);
      } else {
        updated = [...favs, restaurant.id];
        setIsFavorite(true);
      }
      localStorage.setItem('foodly_favorites', JSON.stringify(updated));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const displayImage = (!imgError && restaurant.logo) ? restaurant.logo : FALLBACK_PHOTO;

  return (
    <article 
      className="restaurant-card"
      onClick={() => onSelect && onSelect(restaurant)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(restaurant);
        }
      }}
      aria-label={`View details for ${restaurant.name}`}
    >
      <div className="restaurant-card-image-wrap">
        <img
          src={displayImage}
          alt={`Exterior or cuisine of ${restaurant.name}`}
          className="restaurant-card-image"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        
        {/* Restaurant ID badge (From API) */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, zIndex: 2 }}>
          <span className="badge badge-sage" style={{ fontWeight: 700, backdropFilter: 'blur(8px)', background: 'rgba(230, 236, 228, 0.92)' }}>
            #{restaurant.id}
          </span>
          <span className="badge badge-live" style={{ backdropFilter: 'blur(8px)', background: 'rgba(240, 253, 244, 0.92)' }}>
            Open Now
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          className="btn-icon"
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from saved' : 'Save restaurant'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 36,
            height: 36,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(6px)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s ease',
          }}
        >
          <Heart
            size={18}
            color={isFavorite ? '#E11D48' : '#4B5563'}
            fill={isFavorite ? '#E11D48' : 'none'}
          />
        </button>

        {/* Rating overlay pill */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(18, 60, 50, 0.88)',
            color: '#FFF',
            fontSize: '0.75rem',
            fontWeight: 700,
            backdropFilter: 'blur(6px)',
            zIndex: 2,
          }}
        >
          <Star size={13} fill="#FBBF24" color="#FBBF24" />
          <span>{restaurant.rating || '4.5'}</span>
        </div>
      </div>

      <div className="restaurant-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              lineHeight: 1.25,
            }}
          >
            {restaurant.name}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            <Utensils size={13} color="var(--color-accent)" />
            {restaurant.cuisine || 'Curated Kitchen'}
          </span>
          <span style={{ color: 'var(--color-border)' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            <Clock size={13} />
            {restaurant.distance || '1.5 km'}
          </span>
          <span style={{ color: 'var(--color-border)' }}>•</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            {restaurant.costForTwo || '₹1,200 for two'}
          </span>
        </div>

        {/* Verified API Address */}
        <p
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
            fontSize: '0.825rem',
            color: 'var(--color-muted)',
            marginTop: 4,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          <MapPin size={14} style={{ flexShrink: 0, marginTop: 2, color: 'var(--color-primary)' }} />
          <span>{restaurant.address}</span>
        </p>
      </div>
    </article>
  );
}
