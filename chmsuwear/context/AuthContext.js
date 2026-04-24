import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const SESSION_KEY = '@app_session_token';
const USER_KEY    = '@app_user_data';

export const AuthProvider = ({ children }) => {
  const [user, setUser]                       = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]             = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const token    = await AsyncStorage.getItem(SESSION_KEY);
        const userData = await AsyncStorage.getItem(USER_KEY);
        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn('Session restore failed:', e);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (supabaseUser) => {
    const meta = supabaseUser.user_metadata ?? {};
    const userData = {
      id:    supabaseUser.id,
      email: supabaseUser.email,
      name:  meta.full_name || supabaseUser.email,
      role:  meta.role      || 'student',
    };
    const token = `session_${Date.now()}`;
    try {
      await AsyncStorage.setItem(SESSION_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn('Failed to persist session:', e);
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Logout storage clear failed:', e);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};