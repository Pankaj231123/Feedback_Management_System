import axios from 'axios';
import { Feedback, CreateFeedbackRequest, ApiResponse } from '../types/feedback';

const API_BASE_URL = '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const feedbackApi = {
  // Create new feedback
  createFeedback: async (feedbackData: CreateFeedbackRequest) => {
    const response = await client.post<ApiResponse<Feedback>>(
      '/feedback',
      feedbackData
    );
    return response.data;
  },

  // Get all feedbacks with optional filters
  getFeedbacks: async (filters?: {
    name?: string;
    category?: string;
    priority?: string;
  }) => {
    const response = await client.get<ApiResponse<Feedback[]>>('/feedback', {
      params: filters,
    });
    return response.data;
  },

  // Get feedback by ID
  getFeedbackById: async (id: string) => {
    const response = await client.get<ApiResponse<Feedback>>(
      `/feedback/${id}`
    );
    return response.data;
  },

  // Delete feedback
  deleteFeedback: async (id: string) => {
    const response = await client.delete<ApiResponse<Feedback>>(
      `/feedback/${id}`
    );
    return response.data;
  },
};
