/**
 * Utility functions for the application
 */

/**
 * Generates a unique SKU (Stock Keeping Unit) for products
 * Format: QG-{CATEGORY_PREFIX}-{RANDOM_NUMBER}
 * 
 * @param categoryName - The name of the product category
 * @param existingSkus - Array of existing SKUs to avoid duplicates
 * @returns A unique SKU string
 */
export function generateSKU(categoryName: string, existingSkus: string[] = []): string {
  // Category prefixes mapping
  const categoryPrefixes: { [key: string]: string } = {
    'maquillage': 'MG',
    'soins': 'SC',
    'parfums': 'PF',
    'accessoires': 'AC',
    'cheveux': 'CH',
    'corps': 'CP',
    'visage': 'VS',
    'yeux': 'YE',
    'levres': 'LV',
    'ongles': 'ON',
    'makeup': 'MG',
    'skincare': 'SC',
    'perfumes': 'PF',
    'accessories': 'AC',
    'hair': 'CH',
    'body': 'CP',
    'face': 'VS',
    'eyes': 'YE',
    'lips': 'LV',
    'nails': 'ON'
  };

  // Get category prefix or use default
  const categoryPrefix = categoryPrefixes[categoryName.toLowerCase()] || 'PR';
  
  // Generate a random 3-digit number
  const generateNumber = (): string => {
    return Math.floor(Math.random() * 900 + 100).toString();
  };

  // Generate SKU and ensure uniqueness
  let sku: string;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    const randomNumber = generateNumber();
    sku = `QG-${categoryPrefix}-${randomNumber}`;
    attempts++;
    
    if (attempts >= maxAttempts) {
      // If we can't find a unique SKU after many attempts, add timestamp
      const timestamp = Date.now().toString().slice(-4);
      sku = `QG-${categoryPrefix}-${timestamp}`;
      break;
    }
  } while (existingSkus.includes(sku));

  return sku;
}

/**
 * Formats a price value to display with proper currency formatting
 * 
 * @param price - The price value to format
 * @param currency - The currency code (default: 'EUR')
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Truncates text to a specified length and adds ellipsis
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Validates if a string is a valid email address
 * 
 * @param email - The email string to validate
 * @returns True if valid email, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats a date to a readable string
 * 
 * @param date - The date to format
 * @param locale - The locale for formatting (default: 'fr-FR')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'fr-FR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
} 

// Monthly metrics utilities
export function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function getPreviousMonthRange(date: Date) {
  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return getMonthRange(prevMonth);
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function formatPercentageChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(0)}%`;
}

// Monthly metrics calculation functions
export function calculateMonthlyMetrics<T extends { created_at: string }>(
  data: T[],
  dateField: keyof T = 'created_at' as keyof T
) {
  const now = new Date();
  const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(now);
  const { start: lastMonthStart, end: lastMonthEnd } = getPreviousMonthRange(now);

  const thisMonth = data.filter(item => {
    const date = new Date(item[dateField] as string);
    return date >= thisMonthStart && date <= thisMonthEnd;
  });

  const lastMonth = data.filter(item => {
    const date = new Date(item[dateField] as string);
    return date >= lastMonthStart && date <= lastMonthEnd;
  });

  const change = calculatePercentageChange(thisMonth.length, lastMonth.length);

  return {
    thisMonth: thisMonth.length,
    lastMonth: lastMonth.length,
    change,
    formattedChange: formatPercentageChange(change)
  };
}

export function calculateAppointmentMetrics(appointments: Array<{ appointment_date: string }>) {
  const now = new Date();
  const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(now);
  const { start: lastMonthStart, end: lastMonthEnd } = getPreviousMonthRange(now);

  const thisMonth = appointments.filter(apt => {
    const date = new Date(apt.appointment_date);
    return date >= thisMonthStart && date <= thisMonthEnd;
  });

  const lastMonth = appointments.filter(apt => {
    const date = new Date(apt.appointment_date);
    return date >= lastMonthStart && date <= lastMonthEnd;
  });

  const change = calculatePercentageChange(thisMonth.length, lastMonth.length);

  return {
    thisMonth: thisMonth.length,
    lastMonth: lastMonth.length,
    change,
    formattedChange: formatPercentageChange(change)
  };
}

export function calculateServiceMetrics(services: Array<{ created_at?: string }>) {
  const now = new Date();
  const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(now);
  const { start: lastMonthStart, end: lastMonthEnd } = getPreviousMonthRange(now);

  // Check if services have created_at field
  const hasCreatedAt = services.some(service => service.created_at);

  if (!hasCreatedAt) {
    // If no created_at, show total count and 0% change
    return {
      thisMonth: services.length,
      lastMonth: 0,
      change: 0,
      formattedChange: '+0%'
    };
  }

  const thisMonth = services.filter(service => {
    if (!service.created_at) return false;
    const date = new Date(service.created_at);
    return date >= thisMonthStart && date <= thisMonthEnd;
  });

  const lastMonth = services.filter(service => {
    if (!service.created_at) return false;
    const date = new Date(service.created_at);
    return date >= lastMonthStart && date <= lastMonthEnd;
  });

  const change = calculatePercentageChange(thisMonth.length, lastMonth.length);

  return {
    thisMonth: thisMonth.length,
    lastMonth: lastMonth.length,
    change,
    formattedChange: formatPercentageChange(change)
  };
}

export function calculateReviewMetrics(reviews: Array<{ created_at: string; is_approved: boolean; rating: number }>) {
  const approvedReviews = reviews.filter(review => review.is_approved);
  const now = new Date();
  const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(now);
  const { start: lastMonthStart, end: lastMonthEnd } = getPreviousMonthRange(now);

  const thisMonth = approvedReviews.filter(review => {
    const date = new Date(review.created_at);
    return date >= thisMonthStart && date <= thisMonthEnd;
  });

  const lastMonth = approvedReviews.filter(review => {
    const date = new Date(review.created_at);
    return date >= lastMonthStart && date <= lastMonthEnd;
  });

  const change = calculatePercentageChange(thisMonth.length, lastMonth.length);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return {
    thisMonth: thisMonth.length,
    totalApproved: approvedReviews.length,
    totalReviews: reviews.length,
    lastMonth: lastMonth.length,
    change,
    formattedChange: formatPercentageChange(change),
    averageRating
  };
} 