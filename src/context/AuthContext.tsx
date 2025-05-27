import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateCredentials, setUserSession, isSessionValid, clearSession, refreshSession } from '../utils/authUtils';
import { defaultConfig } from '../utils/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Check session validity on mount
  useEffect(() => {
    const checkSession = () => {
      const valid = isSessionValid();
      setIsAuthenticated(valid);
      setIsLoading(false);
    };
    
    checkSession();
    
    // Set up activity listeners to refresh session
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const refreshUserSession = () => {
      if (isAuthenticated) {
        refreshSession(defaultConfig.auth.session_timeout);
      }
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, refreshUserSession);
    });
    
    // Check session every minute
    const intervalId = setInterval(() => {
      checkSession();
    }, 60000);
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, refreshUserSession);
      });
      clearInterval(intervalId);
    };
  }, [isAuthenticated]);
  
  const login = (username: string, password: string): boolean => {
    const validUser = { username: defaultConfig.auth.usuario, password: defaultConfig.auth.password_hash };
    const isValid = validateCredentials(username, password, validUser);
    
    if (isValid) {
      setUserSession(username, defaultConfig.auth.session_timeout);
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
    
    return isValid;
  };
  
  const logout = () => {
    clearSession();
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};