// Secure Authentication Service - Backend API only
class AuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.token = localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data.user;
  }

  async register(email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data.user;
  }

  async getCurrentUser() {
    if (!this.token) return null;

    try {
      const data = await this.request('/auth/me');
      return data.user;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return this.token;
  }

  async refreshToken() {
    if (!this.token) {
      throw new Error('No token to refresh');
    }

    try {
      const data = await this.request('/auth/refresh', {
        method: 'POST',
      });

      this.token = data.token;
      localStorage.setItem('auth_token', data.token);
      return data.token;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const authService = new AuthService();
export { authService as AuthService };
export default authService;
