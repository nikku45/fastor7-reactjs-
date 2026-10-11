import React from 'react';
import { MapPin, LogOut, Smartphone, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppHeader({ isPhoneView, onTogglePhoneView }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        className="content-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
          gap: 16,
        }}
      >
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: 'var(--color-primary)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              fontWeight: 800,
              boxShadow: '0 4px 10px rgba(18, 60, 50, 0.25)',
            }}
          >
            F
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-primary)',
                  lineHeight: 1,
                }}
              >
                Foodly.
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: 4,
                  backgroundColor: 'var(--color-sage)',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.04em',
                }}
              >
                Fastor7
              </span>
            </div>
            <p className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <MapPin size={11} color="var(--color-accent)" />
              <span>Connaught Place • City ID #118</span>
            </p>
          </div>
        </div>

        {/* Right actions: Mode toggles and user session */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Device Mockup Toggle for reviewers on desktop */}
          {onTogglePhoneView && (
            <button
              type="button"
              onClick={onTogglePhoneView}
              className="btn-icon btn-secondary"
              title={isPhoneView ? 'Switch to Full Desktop View' : 'Preview in Mobile Device Bezel'}
              style={{ width: 38, height: 38 }}
            >
              {isPhoneView ? <Monitor size={17} /> : <Smartphone size={17} />}
            </button>
          )}

          {/* User logout if authenticated */}
          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
              <div
                style={{
                  display: 'none',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
                className="desktop-only-user"
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {user?.name || 'Explorer'}
                </span>
                <span className="text-xs text-muted">
                  {user?.phone ? `+91 ${user.phone.slice(-4)}` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="btn btn-secondary"
                style={{
                  minHeight: 38,
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  gap: 6,
                  color: 'var(--color-muted)',
                }}
                title="Sign out of current session"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
