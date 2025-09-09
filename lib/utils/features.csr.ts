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

export const calculateTimeDifference = (reviewDate: number) => {
    const currentDate = new Date().getTime();
    const reviewDateTime = new Date(reviewDate).getTime();
    const difference = currentDate - reviewDateTime;

    const minutesDifference = Math.floor(difference / (1000 * 60));
    if (minutesDifference < 1) {
        return `just now`;
    }
    if (minutesDifference < 60) {
        return `${minutesDifference} min ago`;
    }

    const hoursDifference = Math.floor(minutesDifference / 60);
    if (hoursDifference < 24) {
        return `${hoursDifference} hr ago`;
    }

    const daysDifference = Math.floor(hoursDifference / 24);
    if (daysDifference < 7) {
        return `${daysDifference}d ago`;
    }

    const weekDifference = Math.floor(daysDifference / 7);
    if (weekDifference < 4) {
        return `${weekDifference}w ago`;
    }

    const monthDifference = Math.floor(weekDifference / 4);
    return `${monthDifference} month ago`;
}

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