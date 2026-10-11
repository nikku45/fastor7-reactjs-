import React, { useEffect, useState } from 'react';
import { X, Star, MapPin, Clock, Utensils, Share2, Check, Phone, ShieldCheck, Heart } from 'lucide-react';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

export default function RestaurantDetailModal({ restaurant, onClose }) {
  const [copied, setCopied] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!restaurant) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Hero Banner */}
        <div style={{ position: 'relative', width: '100%', height: 260, backgroundColor: 'var(--color-sage)' }}>
          <img
            src={restaurant.logo || FALLBACK_PHOTO}
            alt={restaurant.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(18, 60, 50, 0.7) 0%, transparent 60%)',
            }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(6px)',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
            }}
            aria-label="Close details"
          >
            <X size={20} color="var(--color-primary)" />
          </button>

          {/* Badge overlays */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-sage" style={{ fontWeight: 700, padding: '6px 12px' }}>
              Venue ID #{restaurant.id}
            </span>
            <span className="badge badge-live" style={{ padding: '6px 12px' }}>
              Open Today • 11:30 AM - 11:00 PM
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 24px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  lineHeight: 1.2,
                }}
              >
                {restaurant.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#B45309' }}>
                  <Star size={16} fill="#FBBF24" color="#FBBF24" />
                  {restaurant.rating || '4.6'} (240+ reviews)
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                  {restaurant.cuisine || 'Modern Contemporary'}
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  {restaurant.costForTwo || '₹1,500 for two'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="btn btn-secondary"
              style={{ minHeight: 40, padding: '8px 14px', fontSize: '0.85rem' }}
            >
              {copied ? <Check size={16} color="var(--color-success)" /> : <Share2 size={16} />}
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '20px 0' }} />

          {/* Location & Address */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted)', marginBottom: 8 }}>
              Location & Details
            </h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '16px',
                backgroundColor: 'var(--color-sage)',
                borderRadius: 'var(--radius-control)',
              }}
            >
              <MapPin size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  {restaurant.address}
                </p>
                <p className="text-xs text-muted" style={{ marginTop: 4 }}>
                  Fastor Staging Registry • City Zone #118 • Approx {restaurant.distance || '1.8 km'} from downtown
                </p>
              </div>
            </div>
          </div>

          {/* Amenities & Highlights */}
          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted)', marginBottom: 12 }}>
              Kitchen Highlights
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                <ShieldCheck size={18} color="var(--color-success)" />
                <span>Verified Fastor Partner</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                <Clock size={18} color="var(--color-primary)" />
                <span>Avg Preparation: 25 mins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                <Utensils size={18} color="var(--color-accent)" />
                <span>Table Reservation & Dine-in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                <Phone size={18} color="var(--color-primary)" />
                <span>Direct Concierge Support</span>
              </div>
            </div>
          </div>

          {/* Booking CTA Banner */}
          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleBook}
            >
              {booked ? <Check size={18} /> : <Utensils size={18} />}
              {booked ? 'Table Reserved for You!' : 'Reserve a Table'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
