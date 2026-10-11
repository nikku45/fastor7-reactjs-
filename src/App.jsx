import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppHeader from './components/AppHeader.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OtpPage from './pages/OtpPage.jsx';
import RestaurantsPage from './pages/RestaurantsPage.jsx';

function MainAppContent() {
  const { step, isAuthenticated } = useAuth();
  const [isPhoneView, setIsPhoneView] = useState(false);

  // Determine active view
  const renderCurrentStep = () => {
    switch (step) {
      case 'otp':
        return <OtpPage />;
      case 'restaurants':
        return isAuthenticated ? <RestaurantsPage /> : <LoginPage />;
      case 'login':
      default:
        return <LoginPage />;
    }
  };

  const content = (
    <div className="app-container">
      <AppHeader
        isPhoneView={isPhoneView}
        onTogglePhoneView={() => setIsPhoneView(!isPhoneView)}
      />
      {renderCurrentStep()}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          padding: '24px 0',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--color-muted)',
        }}
      >
        <div className="content-wrapper">
          <p>
            <strong>Foodly</strong> — Warm, Editorial Restaurant Discovery • Fastor7 Assessment
          </p>
          <p className="text-xs" style={{ marginTop: 4 }}>
            Curated culinary experiences, craft kitchens & fine dining near you.
          </p>
        </div>
      </footer>
    </div>
  );

  if (isPhoneView) {
    return (
      <div className="preview-shell is-phone-mode">
        <div style={{ marginBottom: 12, textAlign: 'center' }}>
          <span className="badge badge-sage" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            📱 Mobile Device Simulator Active (iPhone Frame)
          </span>
        </div>
        <div className="phone-mockup-frame">
          <div className="phone-notch" />
          <div className="phone-mockup-inner">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
