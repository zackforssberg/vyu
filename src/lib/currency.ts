/**
 * Global currency formatting utility
 */
export function formatCurrency(amount: number, currency = 'SEK', locale = 'en-US') {
  // Map our app's language codes to BCP 47 locales if needed
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'sv': 'sv-SE'
  }

  const targetLocale = localeMap[locale] || locale

  return new Intl.NumberFormat(targetLocale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
