import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function ErrorState({
  title = 'Something Went Wrong',
  error,
  onRetry,
  onSwitchMock,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to communicate with Fastor staging server.');

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '56px 24px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid #FECACA',
        boxShadow: 'var(--shadow-card)',
        maxWidth: 580,
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          backgroundColor: 'var(--color-error-bg)',
          color: 'var(--color-error)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AlertTriangle size={34} />
      </div>

      <div style={{ maxWidth: 440 }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            color: 'var(--color-text)',
            marginBottom: 8,
          }}
        >
          {title}
        </h3>
        <p className="text-sm text-muted" style={{ lineHeight: 1.5 }}>
          {errorMessage}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn btn-primary"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}

        {onSwitchMock && (
          <button
            type="button"
            onClick={onSwitchMock}
            className="btn btn-secondary"
            title="Switch to curated mock preview mode"
          >
            <Sparkles size={16} color="var(--color-accent)" />
            Explore Mock Data Mode
          </button>
        )}
      </div>

      {error?.data && (
        <div style={{ width: '100%', marginTop: 12, borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
          <button
            type="button"
            className="btn-subtle text-xs"
            onClick={() => setShowDetails(!showDetails)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', margin: '0 auto' }}
          >
            <span>{showDetails ? 'Hide Technical Details' : 'View Technical Details'}</span>
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDetails && (
            <pre
              style={{
                marginTop: 8,
                padding: 12,
                backgroundColor: 'var(--color-sage)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left',
                fontSize: '0.75rem',
                overflowX: 'auto',
                color: 'var(--color-text)',
              }}
            >
              {JSON.stringify(error.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
