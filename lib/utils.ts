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