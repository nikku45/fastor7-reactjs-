import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import OtpInput from '../components/OtpInput.jsx';

export default function OtpPage() {
  const {
    pendingAuth,
    setStep,
    verifyOtp,
    requestOtp,
    loading,
    authError,
    setAuthError,
  } = useAuth();

  const [otp, setOtp] = useState('123456');
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resending, setResending] = useState(false);

  // Mask phone for privacy: e.g. +91 99999 •••• 99
  const maskedPhone = (() => {
    const p = pendingAuth.phone || '';
    if (p.length <= 4) return p;
    return `${pendingAuth.dialCode} ${p.slice(0, 3)}••••${p.slice(-3)}`;
  })();

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) return;

    try {
      await verifyOtp(otp);
    } catch {
      // Handled in context
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setAuthError(null);
    try {
      await requestOtp(pendingAuth);
      setResendCooldown(30);
    } catch {
      // Handled in context
    } finally {
      setResending(false);
    }
  };

  const handleAutoFillTest = () => {
    setOtp('123456');
    setAuthError(null);
  };

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
          gap: 20,
        }}
      >
        {/* Navigation & step header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => setStep('login')}
            className="btn-icon btn-secondary"
            style={{ width: 38, height: 38 }}
            aria-label="Back to mobile entry"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="badge badge-sage">
            Step 2 of 2
          </span>
        </div>

        {/* Title */}
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.85rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              lineHeight: 1.2,
            }}
          >
            Enter Verification Code
          </h1>
          <p className="text-sm text-muted" style={{ marginTop: 6, lineHeight: 1.4 }}>
            We sent a 6-digit passcode to{' '}
            <strong style={{ color: 'var(--color-text)' }}>{maskedPhone}</strong>
          </p>
          <button
            type="button"
            onClick={() => setStep('login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginTop: 4,
              padding: 0,
            }}
          >
            Edit phone number
          </button>
        </div>

        {/* Error notification */}
        {authError && (
          <div className="alert-banner error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* Form with 6-digit individual boxes */}
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <OtpInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (authError) setAuthError(null);
            }}
            length={6}
            disabled={loading}
            autoFocus
          />

          {/* Quick test autofill */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleAutoFillTest}
              className="badge badge-accent"
              style={{ cursor: 'pointer', border: 'none', padding: '6px 12px', fontSize: '0.75rem' }}
              title="Click to fill default staging OTP"
            >
              <Sparkles size={12} />
              Use Staging Default OTP (123456)
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || otp.length !== 6}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? (
              <span>Verifying Passcode...</span>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Verify & Explore Foodly</span>
              </>
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          {resendCooldown > 0 ? (
            <p className="text-xs text-muted">
              Resend code in <strong style={{ color: 'var(--color-primary)' }}>{resendCooldown}s</strong>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="btn-subtle text-xs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                color: 'var(--color-accent)',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} />
              <span>{resending ? 'Sending...' : 'Resend Verification Code'}</span>
            </button>
          )}
        </div>

        {/* Trust badge */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--color-muted)',
            fontSize: '0.75rem',
          }}
        >
          <ShieldCheck size={16} color="var(--color-success)" />
          <span>Instant Session & JWT Token Auth</span>
        </div>
      </div>
    </div>
  );
}
