import axios from 'axios';
import * as Types from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const itemService = {
  getAll: async (): Promise<Types.Item[]> => {
    const response = await api.get<Types.ApiResponse<Types.Item[]>>('/items');
    return response.data.data;
  },
  getById: async (id: string): Promise<Types.Item> => {
    const response = await api.get<Types.ApiResponse<Types.Item>>(`/items/${id}`);
    return response.data.data;
  },
  create: async (item: Omit<Types.Item, '_id' | 'createdAt' | 'updatedAt'>): Promise<Types.Item> => {
    const response = await api.post<Types.ApiResponse<Types.Item>>('/items', item);
    return response.data.data;
  },
  update: async (id: string, item: Partial<Types.Item>): Promise<Types.Item> => {
    const response = await api.put<Types.ApiResponse<Types.Item>>(`/items/${id}`, item);
    return response.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};