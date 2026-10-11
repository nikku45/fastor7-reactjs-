import React from 'react';

export default function LoadingState({ count = 6 }) {
  return (
    <div className="restaurant-grid" aria-busy="true" aria-label="Loading restaurants">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="restaurant-card" style={{ pointerEvents: 'none' }}>
          {/* Image skeleton */}
          <div className="skeleton" style={{ width: '100%', aspectRatio: '16 / 10' }} />

          {/* Card body skeleton */}
          <div className="restaurant-card-body" style={{ gap: 12 }}>
            <div className="skeleton" style={{ height: 24, width: '70%', borderRadius: 6 }} />
            
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 16, width: '25%', borderRadius: 4 }} />
            </div>

            <div className="skeleton" style={{ height: 14, width: '90%', borderRadius: 4, marginTop: 4 }} />
            <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
