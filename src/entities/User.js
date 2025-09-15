import APIService from '../services/APIService.js';
import AuthService from '../services/AuthService.js';

export class User {
  static async me() {
    try {
      return await APIService.getUserProfile();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
  
  // OAuth login (Google)
  static async login() {
    try {
      // Redirect to backend OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (error) {
      console.error('Error during OAuth login:', error);
      throw error;
    }
  }
  
  // Email/password authentication
  static async loginWithCredentials(email, password) {
    try {
      return await AuthService.login(email, password);
    } catch (error) {
      console.error('Error during credential login:', error);
      throw error;
    }
  }
  
  // User signup
  static async signup(email, password, fullName) {
    try {
      return await AuthService.register(email, password);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }
  
  static async logout() {
    try {
      AuthService.logout();
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
  
  static async updateMyUserData(data) {
    try {
      return await APIService.updateUserProfile(data);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }
  
  // Check if user is authenticated
  static isAuthenticated() {
    return AuthService.isAuthenticated();
  }
}