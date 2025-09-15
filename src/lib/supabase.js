// API client for secure backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class APIClient {
  constructor() {
    this.AUTH_TOKEN_KEY = 'supabase_auth_token';
  }

  // Token management methods
  getAuthToken() {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }
  }

  clearAuthToken() {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      // If unauthorized, clear the token
      if (response.status === 401) {
        this.clearAuthToken();
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication methods
  async signup(email, password, full_name) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: { email, password, full_name }
    });
    
    if (response.session?.access_token) {
      this.setAuthToken(response.session.access_token);
    }
    
    return response;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    
    if (response.session?.access_token) {
      this.setAuthToken(response.session.access_token);
    }
    
    return response;
  }

  async loginWithGoogle() {
    return this.request('/auth/google', { method: 'POST' });
  }

  async logout() {
    try {
      await this.request('/user/logout', { method: 'POST' });
    } finally {
      // Always clear token, even if request fails
      this.clearAuthToken();
    }
  }

  // User methods
  async getUser() {
    return this.request('/user/me');
  }

  async updateUser(userData) {
    return this.request('/user/update', { 
      method: 'PUT', 
      body: userData 
    });
  }

  // Check if user is logged in
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Questions methods
  async getQuestions(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/questions${params ? '?' + params : ''}`);
  }

  // Sessions methods
  async getSessions(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/sessions${params ? '?' + params : ''}`);
  }

  async createSession(sessionData) {
    return this.request('/sessions', {
      method: 'POST',
      body: sessionData
    });
  }

  async updateSession(id, updates) {
    return this.request(`/sessions/${id}`, {
      method: 'PUT',
      body: updates
    });
  }

  // User Stats methods
  async getUserStats(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/user-stats${params ? '?' + params : ''}`);
  }

  async upsertUserStats(statsData) {
    return this.request('/user-stats', {
      method: 'POST',
      body: statsData
    });
  }

  // LLM methods
  async invokeLLM(prompt, options = {}) {
    return this.request('/llm/invoke', {
      method: 'POST',
      body: { prompt, ...options }
    });
  }
}

export const apiClient = new APIClient();
export default apiClient;