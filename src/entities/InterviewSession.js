import { APIService } from '../services/APIService.js';

export class InterviewSession {
  static async filter(conditions = {}, orderBy = '-created_date', limit = 50) {
    try {
      const filters = {
        ...conditions,
        order_by: orderBy,
        limit: limit
      };
      return await APIService.getSessions(filters);
    } catch (error) {
      console.error('Error filtering interview sessions:', error);
      return [];
    }
  }
  
  static async create(data) {
    try {
      console.log('InterviewSession.create called with:', data);
      const result = await APIService.createSession(data);
      console.log('InterviewSession.create result:', result);
      return result;
    } catch (error) {
      console.error('Error creating interview session:', error);
      throw error;
    }
  }
  
  static async update(id, data) {
    try {
      console.log('InterviewSession.update called with id:', id, 'data:', data);
      const result = await APIService.updateSession(id, data);
      console.log('InterviewSession.update result:', result);
      return result;
    } catch (error) {
      console.error('Error updating interview session:', error);
      throw error;
    }
  }
}