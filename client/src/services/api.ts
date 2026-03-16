import axios from 'axios';
import * as Types from '../types';
const { Item, ApiResponse } = Types;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const itemService = {
  // GET all items
  getAll: async (): Promise<Item[]> => {
    const response = await api.get<ApiResponse<Item[]>>('/items');
    return response.data.data;
  },

  // GET single item
  getById: async (id: string): Promise<Item> => {
    const response = await api.get<ApiResponse<Item>>(`/items/${id}`);
    return response.data.data;
  },

  // POST create item
  create: async (item: Omit<Item, '_id' | 'createdAt' | 'updatedAt'>): Promise<Item> => {
    const response = await api.post<ApiResponse<Item>>('/items', item);
    return response.data.data;
  },

  // PUT update item
  update: async (id: string, item: Partial<Item>): Promise<Item> => {
    const response = await api.put<ApiResponse<Item>>(`/items/${id}`, item);
    return response.data.data;
  },

  // DELETE item
  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};