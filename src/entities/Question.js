import { APIService } from '../services/APIService.js';

export class Question {
  static async list() {
    try {
      return await APIService.getQuestions();
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }
  
  static async filter(conditions) {
    try {
      return await APIService.getQuestions(conditions);
    } catch (error) {
      console.error('Error filtering questions:', error);
      return [];
    }
  }
}