import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  phone: string;
  timezone: string;
  language: string;
  avatar: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, company: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock user profile
const INITIAL_MOCK_USER: UserProfile = {
  name: "Pavith Nimantha",
  email: "pavith@taskbeacons.com",
  company: "TaskBeacons Inc.",
  phone: "+1 (555) 019-2834",
  timezone: "Asia/Colombo",
  language: "en-US",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('tb_user');
    const savedAuth = localStorage.getItem('tb_auth');
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API network request
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple mock logic
    const mockUser = {
      ...INITIAL_MOCK_USER,
      email: email.trim(),
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('tb_user', JSON.stringify(mockUser));
    localStorage.setItem('tb_auth', 'true');
    setIsLoading(false);
  };

  const register = async (name: string, email: string, company: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = {
      ...INITIAL_MOCK_USER,
      name,
      email: email.trim(),
      company,
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('tb_user', JSON.stringify(mockUser));
    localStorage.setItem('tb_auth', 'true');
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tb_user');
    localStorage.removeItem('tb_auth');
    setIsLoading(false);
  };

  const updateProfile = async (profileUpdate: Partial<UserProfile>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    if (user) {
      const updated = { ...user, ...profileUpdate };
      setUser(updated);
      localStorage.setItem('tb_user', JSON.stringify(updated));
    }
    setIsLoading(false);
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Mock reset password email sent to: ${email}`);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
