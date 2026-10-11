import { apiRequest, ApiError } from './client.js';

/**
 * Register phone number and request OTP
 * Endpoint: POST /v1/pwa/user/register
 * Body format: application/x-www-form-urlencoded (phone, dial_code)
 */
export async function registerPhone({ phone, dialCode = '+91' }) {
  if (!phone || typeof phone !== 'string') {
    throw new ApiError('Please enter a valid phone number', 400);
  }

  const cleanPhone = phone.trim().replace(/\D/g, '');
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    throw new ApiError('Please enter a valid phone number (10 digits for India)', 400);
  }

  const cleanDialCode = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;

  const body = new URLSearchParams({
    phone: cleanPhone,
    dial_code: cleanDialCode,
  });

  const response = await apiRequest('/v1/pwa/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  // Verify response
  const isSuccess =
    response?.status === 'Success' ||
    response?.status_code === 200 ||
    response?.data === 'otp sent';

  if (!isSuccess && response?.error) {
    throw new ApiError(response.error || 'Failed to send OTP', response?.status_code || 400);
  }

  return {
    success: true,
    message: typeof response?.data === 'string' ? response.data : 'OTP sent successfully',
    phone: cleanPhone,
    dialCode: cleanDialCode,
    rawResponse: response,
  };
}

/**
 * Login with OTP and extract JWT
 * Endpoint: POST /v1/pwa/user/login
 * Body format: application/x-www-form-urlencoded (phone, otp, dial_code)
 */
export async function loginWithOtp({ phone, otp, dialCode = '+91' }) {
  if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
    throw new ApiError('Please enter a valid 6-digit verification code', 400);
  }

  const cleanPhone = phone.trim().replace(/\D/g, '');
  const cleanDialCode = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  const cleanOtp = otp.trim();

  const body = new URLSearchParams({
    phone: cleanPhone,
    otp: cleanOtp,
    dial_code: cleanDialCode,
  });

  const response = await apiRequest('/v1/pwa/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  // Extract JWT token per verified schema: response.data.token
  const token = response?.data?.token || response?.token;

  if (!token) {
    const errorMsg =
      response?.error ||
      response?.message ||
      'Authentication succeeded but no authorization token was returned.';
    throw new ApiError(errorMsg, 401, response);
  }

  // Extract user metadata from response.data if available
  const user = {
    phone: cleanPhone,
    dialCode: cleanDialCode,
    name: response?.data?.user_name || 'Food Explorer',
    email: response?.data?.user_email || null,
    isGuest: response?.data?.is_guest ?? false,
  };

  return {
    token,
    user,
    rawResponse: response,
  };
}
