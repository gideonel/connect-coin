import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types/user';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeProfileSetup: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'dating_app_user';
const USERS_STORAGE_KEY = 'dating_app_users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const saveUser = (userData: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);

    // Also save to users list
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const existingIndex = users.findIndex((u: UserProfile) => u.id === userData.id);
    if (existingIndex >= 0) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const existingUser = users.find((u: UserProfile & { password?: string }) => 
      u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      // Check password (in real app, this would be hashed)
      const storedPasswords = JSON.parse(localStorage.getItem('dating_app_passwords') || '{}');
      if (storedPasswords[existingUser.id] !== password) {
        return false;
      }
      saveUser(existingUser);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const existingUser = users.find((u: UserProfile) => 
      u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return false; // Email already exists
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email,
      name,
      age: 0,
      gender: 'other',
      bio: '',
      photos: [],
      location: { city: '', country: '' },
      interests: [],
      lookingFor: {
        gender: ['all'],
        ageRange: { min: 18, max: 50 },
        relationshipType: 'any',
      },
      premium: { isActive: false },
      tokens: 50, // Starting tokens
      coins: 0,
      verification: { email: true, photo: false },
      stats: { likes: 0, superLikes: 0, matches: 0, profileViews: 0 },
      settings: {
        showOnlineStatus: true,
        showDistance: true,
        showAge: true,
        notifications: { matches: true, messages: true, likes: true },
      },
      blocked: [],
      reported: [],
      isOnline: true,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Store password separately (in real app, this would be hashed on server)
    const passwords = JSON.parse(localStorage.getItem('dating_app_passwords') || '{}');
    passwords[newUser.id] = password;
    localStorage.setItem('dating_app_passwords', JSON.stringify(passwords));

    saveUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      saveUser(updatedUser);
    }
  };

  const completeProfileSetup = (profile: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...profile };
      saveUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        completeProfileSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
