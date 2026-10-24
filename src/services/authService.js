/**
 * BombayBooze Authentication API Service
 * Handles communication with the FastAPI backend (/api/auth)
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Format and extract clean error messages from backend responses
 */
export function parseApiError(errorData, fallbackMessage = 'Invalid credentials') {
  if (!errorData) return fallbackMessage;

  // FastAPI HTTPException detail: string
  if (typeof errorData.detail === 'string') {
    return errorData.detail;
  }

  // FastAPI validation error: array of { loc, msg, type }
  if (Array.isArray(errorData.detail)) {
    return errorData.detail
      .map(err => {
        const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : '';
        const cleanField = field ? field.replace('_', ' ') : '';
        return cleanField ? `${cleanField}: ${err.msg}` : err.msg;
      })
      .join('. ');
  }

  if (errorData.message) {
    return errorData.message;
  }

  return fallbackMessage;
}

/**
 * Register a new user
 * @param {Object} data - { firstName, lastName, email, password, dateOfBirth, phone }
 */
export async function signup({ firstName, lastName, email, password, dateOfBirth, phone }) {
  const payload = {
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    date_of_birth: dateOfBirth,
    phone: phone ? phone.trim() : null,
  };

  let response;
  let data;

  try {
    response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    data = await response.json().catch(() => null);
  } catch (netErr) {
    if (!API_BASE) {
      try {
        response = await fetch('http://localhost:8000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
        data = await response.json().catch(() => null);
      } catch (fallbackErr) {
        throw new Error('Unable to connect to authentication server. Please verify the backend is running.');
      }
    } else {
      throw new Error('Unable to connect to authentication server. Please check your network connection.');
    }
  }

  if (!response.ok) {
    const message = parseApiError(data, 'Sign up failed. Please check your details.');
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Log in an existing user and obtain JWT token
 * @param {Object} credentials - { email, password }
 */
export async function login({ email, password }) {
  const payload = {
    email: email.trim().toLowerCase(),
    password: password,
  };

  let response;
  let data;

  try {
    response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    data = await response.json().catch(() => null);
  } catch (netErr) {
    if (!API_BASE) {
      try {
        response = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
        data = await response.json().catch(() => null);
      } catch (fallbackErr) {
        throw new Error('Unable to connect to server. Please verify the backend API is running.');
      }
    } else {
      throw new Error('Unable to connect to server. Please check your network connection.');
    }
  }

  if (!response.ok) {
    const message = parseApiError(data, 'Invalid credentials');
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data; // { access_token, token_type }
}

/**
 * Get profile for currently authenticated user
 * @param {string} token - JWT access token
 */
export async function getMe(token) {
  if (!token) {
    throw new Error('No authentication token provided');
  }

  let response;
  let data;

  try {
    response = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    data = await response.json().catch(() => null);
  } catch (netErr) {
    if (!API_BASE) {
      try {
        response = await fetch('http://localhost:8000/api/auth/me', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        data = await response.json().catch(() => null);
      } catch (fallbackErr) {
        throw new Error('Unable to connect to server to fetch profile.');
      }
    } else {
      throw new Error('Unable to connect to server to fetch profile.');
    }
  }

  if (!response.ok) {
    const message = parseApiError(data, 'Failed to fetch user profile.');
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data; // { user_id, first_name, last_name, email, is_verified }
}

export default {
  signup,
  login,
  getMe,
  parseApiError,
};
