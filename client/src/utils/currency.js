// Hardcoded mock exchange rates based on USD for hackathon demonstration purposes
const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  INR: 83.5,
  GBP: 0.78,
  JPY: 150.0,
  AUD: 1.5,
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
};

/**
 * Converts an amount from one currency to another using static rates.
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (!amount) return 0;
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first (base), then to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
};

/**
 * Formats a currency value with the correct symbol and decimal places.
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Converts AND formats the currency in one step.
 */
export const convertAndFormatCurrency = (amount, fromCurrency, toCurrency) => {
  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
  return formatCurrency(convertedAmount, toCurrency);
};

/**
 * Get the user's preferred currency from localStorage, default to USD.
 */
export const getPreferredCurrency = () => {
  return localStorage.getItem('globetrotter_pref_currency') || 'USD';
};

/**
 * Save the user's preferred currency to localStorage.
 */
export const setPreferredCurrency = (currency) => {
  localStorage.setItem('globetrotter_pref_currency', currency);
};
