import { api } from '@/lib/api-client';
import { User } from '@/types';

export const authService = {
  login: async (credentials: any) => {
    return api.post<{ user: User }>('/auth/login', credentials);
  },

  signup: async (data: any) => {
    return api.post<{ user: User }>('/auth/signup', data);
  },

  getCurrentUser: async () => {
    return api.get<{ user: User }>('/auth/me');
  },

  logout: async () => {
    return api.post<void>('/auth/logout');
  }
};