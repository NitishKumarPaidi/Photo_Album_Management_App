import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/User';

// Mock authentication service
class AuthService {
  private users: Array<{ email: string; password: string; name: string; id: string; createdAt: Date }> = [];
  private currentUser: User | null = null;

  constructor() {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('photoAlbumUsers');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers).map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt)
      }));
    }

    // Load current user from localStorage
    const savedUser = localStorage.getItem('photoAlbumCurrentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.currentUser!.createdAt = new Date(this.currentUser!.createdAt);
    }
  }

  private saveUsers() {
    localStorage.setItem('photoAlbumUsers', JSON.stringify(this.users));
  }

  private saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem('photoAlbumCurrentUser', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('photoAlbumCurrentUser');
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (this.users.find(user => user.email === email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      createdAt: new Date()
    };

    this.users.push(newUser);
    this.saveUsers();

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    };

    this.currentUser = user;
    this.saveCurrentUser();

    return user;
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const authUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };

    this.currentUser = authUser;
    this.saveCurrentUser();

    return authUser;
  }

  logout(): void {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

const authService = new AuthService();

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: authService.getCurrentUser(),
    isLoading: false,
    error: null
  });

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await authService.login(email, password);
      setAuthState({ user, isLoading: false, error: null });
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }));
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await authService.register(email, password, name);
      setAuthState({ user, isLoading: false, error: null });
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }));
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({ user: null, isLoading: false, error: null });
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    register,
    logout,
    clearError
  };
};