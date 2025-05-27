// Format a date string to a localized format (DD/MM/YYYY)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Calculate days remaining until a given date
export const getDaysRemaining = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const currentDate = new Date();
  
  // Reset time part for accurate day calculation
  targetDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
};

// Calculate expiry date based on emission date and validity period in years
export const calculateExpiryDate = (emissionDate: Date, validityYears: number): Date => {
  const expiryDate = new Date(emissionDate);
  expiryDate.setFullYear(emissionDate.getFullYear() + validityYears);
  return expiryDate;
};

// Check if a certificate is about to expire based on alert days
export const isAboutToExpire = (expiryDateString: string, alertDays: number[]): boolean => {
  const daysRemaining = getDaysRemaining(expiryDateString);
  return daysRemaining > 0 && alertDays.some(days => daysRemaining <= days);
};

// Get month name from date
export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('es-ES', { month: 'long' });
};

// Get year from date
export const getYear = (date: Date): number => {
  return date.getFullYear();
};

// Group dates by month for charts
export const groupByMonth = (dates: string[]): Record<string, number> => {
  const monthCounts: Record<string, number> = {};
  
  dates.forEach(dateString => {
    const date = new Date(dateString);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!monthCounts[monthYear]) {
      monthCounts[monthYear] = 0;
    }
    
    monthCounts[monthYear]++;
  });
  
  return monthCounts;
};