// Secure API Service - All backend communication
import AuthService from './AuthService.js';

class APIService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
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

    if (AuthService.getToken()) {
      config.headers.Authorization = `Bearer ${AuthService.getToken()}`;
    }

    const response = await fetch(url, config);

    // If token expired, try to refresh (even with expired token)
    if (response.status === 401 && AuthService.getToken()) {
      try {
        console.log('Token expired, attempting refresh...');
        await AuthService.refreshToken();
        
        // Retry the original request with new token
        if (AuthService.getToken()) {
          config.headers.Authorization = `Bearer ${AuthService.getToken()}`;
          const retryResponse = await fetch(url, config);
          const retryData = await retryResponse.json();
          
          if (!retryResponse.ok) {
            throw new Error(retryData.error || 'Request failed after token refresh');
          }
          
          return retryData;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Only logout if refresh completely fails
        if (refreshError.message.includes('User not found') || refreshError.message.includes('Invalid token')) {
          AuthService.logout();
        }
        throw new Error('Authentication failed');
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // AI Services
  async evaluateInterview(conversation, questionType, sessionDuration) {
    return this.request('/ai/evaluate', {
      method: 'POST',
      body: JSON.stringify({ conversation, questionType, sessionDuration }),
    });
  }

  async chatWithAI(message, conversation, questionContext) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversation, questionContext }),
    });
  }

  // User Services
  async getUserProfile() {
    return this.request('/user/me');
  }

  async updateUserProfile(userData) {
    return this.request('/user/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Session Services
  async createSession(sessionData) {
    console.log('APIService: Creating session with data:', sessionData);
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(sessionId, sessionData) {
    console.log('APIService: Updating session', sessionId, 'with data:', sessionData);
    return this.request(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async getUserSessions() {
    return this.request('/sessions');
  }

  async getSessions() {
    return this.request('/sessions');
  }

  // Question Services
  async getQuestions(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/questions?${params}`);
  }

  // Stats Services
  async getUserStats(conditions = {}) {
    console.log('APIService.getUserStats called with conditions:', conditions);
    const result = await this.request('/stats');
    console.log('APIService.getUserStats result:', result);
    return result;
  }

  async updateUserStats(statsData) {
    return this.request('/stats', {
      method: 'PUT',
      body: JSON.stringify(statsData),
    });
  }

  async upsertUserStats(statsData) {
    console.log('APIService.upsertUserStats called with:', statsData);
    const result = await this.request('/stats', {
      method: 'PUT',
      body: JSON.stringify(statsData),
    });
    console.log('APIService.upsertUserStats result:', result);
    return result;
  }

  // AI Services
  async invokeLLM({ message, conversation, questionContext }) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation,
        questionContext
      }),
    });
  }

  async evaluateInterview({ conversation, questionType, sessionDuration }) {
    return this.request('/ai/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        conversation,
        questionType,
        sessionDuration
      }),
    });
  }
}

const apiService = new APIService();
export { apiService as APIService };
export default apiService;
