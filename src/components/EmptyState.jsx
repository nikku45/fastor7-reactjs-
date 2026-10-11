import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function EmptyState({
  title = 'No Restaurants Found',
  message = 'We could not find any culinary spots matching your current search or filter criteria.',
  onReset,
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '64px 24px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        border: '1.5px dashed var(--color-border)',
        maxWidth: 560,
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: 'var(--color-sage)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
        }}
      >
        <SearchX size={36} />
      </div>

      <div style={{ maxWidth: 400 }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            color: 'var(--color-primary)',
            marginBottom: 8,
          }}
        >
          {title}
        </h3>
        <p className="text-sm text-muted">
          {message}
        </p>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="btn btn-secondary"
          style={{ marginTop: 8 }}
        >
          <RotateCcw size={16} />
          Reset Filters & Show All
        </button>
      )}
    </div>
  );
}
