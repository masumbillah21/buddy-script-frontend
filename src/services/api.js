const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');

  const headers = {
    'Accept': 'application/json',
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If the token is invalid or expired, clear local storage and force redirect to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return response;
}
