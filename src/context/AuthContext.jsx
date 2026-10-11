import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerPhone, loginWithOtp } from '../api/auth.js';

const STORAGE_TOKEN_KEY = 'foodly_auth_token';
const STORAGE_USER_KEY = 'foodly_auth_user';
const STORAGE_MOCK_KEY = 'foodly_mock_mode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [step, setStep] = useState(() => {
    // If token is already present, go directly to restaurants screen
    const savedToken = sessionStorage.getItem(STORAGE_TOKEN_KEY);
    return savedToken ? 'restaurants' : 'login';
  });

  const [pendingAuth, setPendingAuth] = useState({
    phone: '9999999999',
    dialCode: '+91',
  });

  const [isMockMode, setIsMockMode] = useState(() => {
    return localStorage.getItem(STORAGE_MOCK_KEY) === 'true';
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync token to sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem(STORAGE_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  }, [token]);

  // Sync user to sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  // Sync mock preference
  useEffect(() => {
    localStorage.setItem(STORAGE_MOCK_KEY, String(isMockMode));
  }, [isMockMode]);

  /**
   * Step 1: Submit phone & request OTP
   */
  async function requestOtp({ phone, dialCode = '+91' }) {
    setLoading(true);
    setAuthError(null);
    try {
      if (isMockMode) {
        // Artificial delay for smooth UX
        await new Promise((resolve) => setTimeout(resolve, 600));
      } else {
        await registerPhone({ phone, dialCode });
      }

      setPendingAuth({ phone, dialCode });
      setStep('otp');
      return { success: true };
    } catch (err) {
      setAuthError(err.message || 'Unable to send OTP. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Step 2: Verify OTP & establish session
   */
  async function verifyOtp(otp) {
    setLoading(true);
    setAuthError(null);
    try {
      let authToken = null;
      let authUser = null;

      if (isMockMode) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        authToken = 'mock_jwt_token_' + Date.now();
        authUser = {
          phone: pendingAuth.phone,
          dialCode: pendingAuth.dialCode,
          name: 'Food Explorer (Demo)',
          email: 'demo@foodly.app',
        };
      } else {
        const result = await loginWithOtp({
          phone: pendingAuth.phone,
          otp,
          dialCode: pendingAuth.dialCode,
        });
        authToken = result.token;
        authUser = result.user;
      }

      setToken(authToken);
      setUser(authUser);
      setStep('restaurants');
      return { success: true, token: authToken };
    } catch (err) {
      setAuthError(err.message || 'Verification failed. Please check the code.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Logout user and clear tokens
   */
  function logout() {
    setToken(null);
    setUser(null);
    setStep('login');
    sessionStorage.removeItem(STORAGE_TOKEN_KEY);
    sessionStorage.removeItem(STORAGE_USER_KEY);
  }

  /**
   * Toggle Mock Mode
   */
  function toggleMockMode(val) {
    const nextVal = typeof val === 'boolean' ? val : !isMockMode;
    setIsMockMode(nextVal);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        step,
        setStep,
        pendingAuth,
        setPendingAuth,
        isMockMode,
        toggleMockMode,
        loading,
        authError,
        setAuthError,
        requestOtp,
        verifyOtp,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
