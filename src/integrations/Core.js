import { APIService } from '../services/APIService.js';

export const InvokeLLM = async (promptData) => {
  try {
    return await APIService.invokeLLM(promptData.prompt, {
      response_json_schema: promptData.response_json_schema
    });
  } catch (error) {
    console.error('Error invoking LLM:', error);
    throw error;
  }
};