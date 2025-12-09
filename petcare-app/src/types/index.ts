export interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  description: string;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}