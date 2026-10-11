import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, AlertCircle, PhoneCall } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'USA / Canada (+1)' },
  { code: '+44', country: 'UK', label: 'UK (+44)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
];

export default function LoginPage() {
  const { requestOtp, loading, authError, setAuthError } = useAuth();
  const [phone, setPhone] = useState('9999999999');
  const [dialCode, setDialCode] = useState('+91');
  const [localError, setLocalError] = useState('');

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setPhone(raw);
    if (localError) setLocalError('');
    if (authError) setAuthError(null);
  };

  const handleQuickTest = () => {
    setPhone('9999999999');
    setDialCode('+91');
    setLocalError('');
    if (authError) setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      setLocalError('Please enter your phone number.');
      return;
    }
    if (dialCode === '+91' && phone.length !== 10) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      await requestOtp({ phone, dialCode });
    } catch {
      // Error is set in AuthContext
    }
  };

  const isFormValid = phone.length >= 7;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: 'var(--color-surface)',
          borderRadius: 24,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: 'var(--color-primary)',
              color: '#FFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              fontWeight: 800,
              boxShadow: '0 6px 16px rgba(18, 60, 50, 0.25)',
              marginBottom: 16,
            }}
          >
            F
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.85rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              lineHeight: 1.2,
            }}
          >
            Welcome to Foodly
          </h1>
          <p className="text-sm text-muted" style={{ marginTop: 6 }}>
            Curated gastronomy & fine dining discovery by Fastor7
          </p>
        </div>


        {/* Error notification */}
        {(authError || localError) && (
          <div className="alert-banner error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{authError || localError}</span>
          </div>
        )}

        {/* Phone form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <FormField
            label="Mobile Phone Number"
            id="phone-input"
            helper="We will send a 6-digit one-time verification passcode."
          >
            <div className="form-control-row">
              <select
                className="dial-code-select"
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                aria-label="Select Country Dial Code"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.country})
                  </option>
                ))}
              </select>

              <input
                id="phone-input"
                type="tel"
                className="input-field"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={14}
                autoFocus
                required
              />
            </div>
          </FormField>

          {/* Quick tester helper button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleQuickTest}
              className="badge badge-accent"
              style={{ cursor: 'pointer', border: 'none', padding: '6px 10px', fontSize: '0.75rem' }}
              title="Click to fill test phone number"
            >
              <Sparkles size={12} />
              Fill Fastor Test Number (9999999999)
            </button>
            <span className="text-xs text-muted">
              {phone.length}/10 digits
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !isFormValid}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? (
              <span>Sending Passcode...</span>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Trust footer */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--color-muted)',
            fontSize: '0.75rem',
          }}
        >
          <ShieldCheck size={16} color="var(--color-success)" />
          <span>Encrypted Gateway • Fastor7 PWA Auth Engine</span>
        </div>
      </div>
    </div>
  );
}
