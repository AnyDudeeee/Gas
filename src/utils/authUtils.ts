import { User } from '../types';

// In a real app, you would use a secure hashing library like bcrypt
// For this example, we'll use a simple check
export const validateCredentials = (username: string, password: string, validUser: User): boolean => {
  return username === validUser.username && password === validUser.password;
};

// Set user session in localStorage with expiry
export const setUserSession = (username: string, timeout: number): void => {
  const now = new Date();
  const expiryTime = now.getTime() + timeout * 1000; // Convert seconds to milliseconds
  
  localStorage.setItem('user', username);
  localStorage.setItem('sessionExpiry', expiryTime.toString());
};

// Check if user session is valid
export const isSessionValid = (): boolean => {
  const username = localStorage.getItem('user');
  const expiryTimeStr = localStorage.getItem('sessionExpiry');
  
  if (!username || !expiryTimeStr) {
    return false;
  }
  
  const expiryTime = parseInt(expiryTimeStr, 10);
  const now = new Date().getTime();
  
  return now < expiryTime;
};

// Refresh session timeout
export const refreshSession = (timeout: number): void => {
  const username = localStorage.getItem('user');
  
  if (username) {
    setUserSession(username, timeout);
  }
};

// Clear user session
export const clearSession = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('sessionExpiry');
};

// Get current user
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('user');
};