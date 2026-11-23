import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { getCurrentUser, setCurrentUser, getStoredUsers, saveUser } from './storage';
import { ironAudio } from './ironAudio';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (profile: Omit<UserProfile, 'id' | 'createdAt'>, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickSwitchRole: (targetRole: UserRole) => void;
  updateCurrentUserProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUser());

  useEffect(() => {
    const active = getCurrentUser();
    setUser(active);
  }, []);

  const login = async (email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setUser(found);
      ironAudio.playSuccess();
      return { success: true };
    }
    ironAudio.playClank();
    return { success: false, error: 'Account not found with this email. Please register.' };
  };

  const register = async (profile: Omit<UserProfile, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());
    if (existing) {
      ironAudio.playClank();
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: UserProfile = {
      ...profile,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    setUser(newUser);
    ironAudio.playSuccess();
    return { success: true };
  };

  const logout = () => {
    ironAudio.playClick(600);
    setCurrentUser(null);
    setUser(null);
  };

  const quickSwitchRole = (targetRole: UserRole) => {
    const users = getStoredUsers();
    const match = users.find(u => u.role === targetRole);
    if (match) {
      ironAudio.playSuccess();
      setCurrentUser(match);
      setUser(match);
    }
  };

  const updateCurrentUserProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const merged: UserProfile = { ...user, ...updated };
    saveUser(merged);
    setUser(merged);
    ironAudio.playClick();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickSwitchRole,
        updateCurrentUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
