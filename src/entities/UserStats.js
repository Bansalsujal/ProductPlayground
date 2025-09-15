import { APIService } from '../services/APIService.js';

export class UserStats {
  static async filter(conditions = {}) {
    try {
      return await APIService.getUserStats(conditions);
    } catch (error) {
      console.error('Error filtering user stats:', error);
      return [];
    }
  }
  
  static async upsert(data) {
    try {
      return await APIService.upsertUserStats(data);
    } catch (error) {
      console.error('Error upserting user stats:', error);
      throw error;
    }
  }

  // Alias for create method (used by some components)
  static async create(data) {
    console.log('UserStats.create called with:', data);
    const result = await this.upsert(data);
    console.log('UserStats.create result:', result);
    return result;
  }

  // Alias for update method (used by some components) 
  static async update(id, data) {
    return this.upsert({ ...data, user_id: data.user_id || id });
  }
}