export const countryToFlagMap: Record<string, string> = {
  'United States': 'us',
  'Pakistan': 'pk',
  'Germany': 'de',
  'United Kingdom': 'gb',
  'Canada': 'ca',
  'Australia': 'au',
  'France': 'fr',
  'India': 'in',
  'Brazil': 'br',
  'Italy': 'it',
  'Spain': 'es',
  'Mexico': 'mx',
  'China': 'cn',
  'Japan': 'jp',
  'South Korea': 'kr',
  'Netherlands': 'nl',
  'Russia': 'ru',
  'Turkey': 'tr',
  'South Africa': 'za',
  'Saudi Arabia': 'sa',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'United Arab Emirates': 'ae',
};

export const countryToCurrencyMap: Record<string, string> = {
  'United States': 'USD',
  'Pakistan': 'PKR',
  'Germany': 'EUR',
  'United Kingdom': 'GBP',
  'Canada': 'CAD',
  'Australia': 'AUD'
};
export const currencyToSymbolMap: Record<string, string> = {
  'USD': '$',
  'PKR': 'Rs',
  'EUR': '€',
  'GBP': '£',
  'CAD': 'C$',
  'AUD': 'A$'
};
export const slugifyCsr = (title: string) => {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};


export const unSlugifyCsr = (slug: string) => {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};