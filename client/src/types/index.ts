export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'clothing' | 'books' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}