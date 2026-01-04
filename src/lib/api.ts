import { http } from './http';

// --- Types ---

export interface User {
  id: number;
  email: string;
  name?: string;
  avatar: string;
  description: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
}

export interface Category {
  id: number;
  name: string;
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER';
  icon?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER';
  date: string;
  description?: string;
  accountId: number;
  categoryId?: number;
  toAccountId?: number;
  account?: Account;
  category?: Category;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  hasCard: boolean;
  cardType?: string;
  cardData?: string; // JSON string
  createdAt: string;
}

// --- DTOs ---

export interface SignupDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateAccountDto {
  name: string;
  type: string;
  balance?: number;
}

export interface CreateCategoryDto {
  name: string;
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER';
  icon?: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER';
  accountId: number;
  categoryId?: number;
  description?: string;
  date?: string;
  toAccountId?: number;
}

// --- API Functions ---

export const api = {
  auth: {
    signup: (data: SignupDto) => http.post<AuthResponse>('/auth/signup', data),
    login: (data: LoginDto) => http.post<AuthResponse>('/auth/login', data),
    getProfile: () => http.get<User>('/auth/profile'),
  },
  accounts: {
    list: () => http.get<Account[]>('/accounts'),
    create: (data: CreateAccountDto) => http.post<Account>('/accounts', data),
    update: (id: number, data: Partial<CreateAccountDto>) => http.patch<Account>(`/accounts/${id}`, data),
    delete: (id: number) => http.delete(`/accounts/${id}`),
  },
  categories: {
    list: () => http.get<Category[]>('/categories'),
    create: (data: CreateCategoryDto) => http.post<Category>('/categories', data),
    update: (id: number, data: Partial<CreateCategoryDto>) => http.patch<Category>(`/categories/${id}`, data),
    delete: (id: number) => http.delete(`/categories/${id}`),
  },
  transactions: {
    list: (params?: { startDate?: string; endDate?: string; accountId?: number; categoryId?: number }) => 
      http.get<Transaction[]>('/transactions', { params }),
    create: (data: CreateTransactionDto) => http.post<Transaction>('/transactions', data),
    update: (id: number, data: Partial<CreateTransactionDto>) => http.patch<Transaction>(`/transactions/${id}`, data),
    delete: (id: number) => http.delete(`/transactions/${id}`),
  },
  ai: {
    chat: (text: string) => http.post<{ message: string; data?: any }>('/ai/chat', { text }),
    getHistory: () => http.get<ChatMessage[]>('/ai/history'),
  },
  stats: {
    assets: () => http.get<{ totalAssets: number; accounts: Account[] }>('/stats/assets'),
    trend: (params: { startDate: string; endDate: string }) => 
      http.get<{ date: string; income: number; expense: number }[]>('/stats/trend', { params }),
    category: (params: { startDate: string; endDate: string; type: 'EXPENSE' | 'INCOME' }) => 
      http.get<{ categoryId: number; categoryName: string; amount: number }[]>('/stats/category', { params }),
  },
};
