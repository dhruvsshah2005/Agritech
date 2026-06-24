export interface User {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    avatar_url?: string | null;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}