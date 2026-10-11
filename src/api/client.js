/**
 * Foodly API Client
 * Configures base URL, request headers, error parsing, and timeout handling.
 */

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://staging.fastor.ai';

// Clean trailing slash
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Universal request helper with timeout and safe error formatting.
 */
export async function apiRequest(endpoint, {
  method = 'GET',
  headers = {},
  body = null,
  token = null,
  timeoutMs = 12000,
} = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const reqHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: reqHeaders,
      body,
      signal: controller.signal,
    });

    clearTimeout(timer);

    let parsedData = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      parsedData = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      try {
        parsedData = JSON.parse(text);
      } catch {
        parsedData = { rawText: text };
      }
    }

    if (!response.ok) {
      const errorMsg =
        parsedData?.error ||
        parsedData?.message ||
        parsedData?.data?.error ||
        parsedData?.data?.message ||
        (typeof parsedData?.data === 'string' ? parsedData.data : null) ||
        `Server returned ${response.status} ${response.statusText}`;
      
      throw new ApiError(errorMsg, response.status, parsedData);
    }

    return parsedData;
  } catch (error) {
    clearTimeout(timer);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection and try again.', 408);
    }

    // Network / CORS / offline errors
    const isNetworkError =
      error instanceof TypeError ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError');

    if (isNetworkError) {
      throw new ApiError(
        'Unable to connect to Fastor staging API. Check internet connectivity or try Mock Mode.',
        0,
        { originalError: error.message }
      );
    }

    throw new ApiError(error.message || 'An unexpected error occurred.', 500);
  }
}
