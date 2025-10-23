'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { countryToCurrencyMap } from '@/lib/utils/features.csr';

type RegionStore = {
  country: string;
  countryCode: string;
  currency: string;
  exchangeRate: number;
  lastFetched: number | null;
  isHydrated: boolean;
  source?: 'ip' | 'manual' | null;

  setCountry: (country: string) => void;
  setCountryCode: (countryCode: string) => void;
  setCurrency: (currency: string) => Promise<void>;
  setSource: (source: 'ip' | 'manual') => void;
  clearcur: () => void;
  clearcon: () => void;

  fetchGeo: () => Promise<void>;
  resetToGeo: () => Promise<void>;
};

export const useRegion = create<RegionStore>()(
  persist(
    (set, get) => ({
      country: '',
      currency: 'USD',
      countryCode: 'PS', // default to Palestine
      exchangeRate: 1, 
      lastFetched: null,
      isHydrated: false,
      source: null,

      setCountry: (country) => set({ country }),
      setCountryCode: (countryCode) => set({ countryCode }),
      setSource: (source) => set({ source }),

      setCurrency: async (currency) => {
        if (currency === 'USD') {
          set({ currency, exchangeRate: 1 });
          return;
        }

        if (currency === 'PKR') {
          set({ currency, exchangeRate: 200 });
          return;
        }

        const currentTime = Date.now();
        const threeDays = 3 * 24 * 3600 * 1000;
        const shouldFetch =
          currency !== get().currency ||
          !get().lastFetched ||
          currentTime - get().lastFetched! > threeDays;

        if (!shouldFetch) {
          set({ currency });
          return;
        }

        try {
          const response = await fetch(
            `https://api.currencyapi.com/v3/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API}&base_currency=USD&currencies=${currency}`
          );
          const data = await response.json();
          console.log('currency-api:success');

          const rate = data.data?.[currency.toUpperCase()]?.value || 1;
          set({ currency, exchangeRate: rate, lastFetched: currentTime });
        } catch (error) {
          console.error('currency-api:Failed:', (error as Error).message);
        }
      },

      clearcur: () => set({ currency: 'USD', exchangeRate: 1 }),

      clearcon: () =>
        set({
          country: '',
          currency: 'USD',
          exchangeRate: 1,
          countryCode: '',
          source: null,
        }),

      // 🌍 Fetch from IP API
      fetchGeo: async () => {
        try {
          const res = await fetch('/api/ip');
          const data = await res.json();
          const mappedCurrency = countryToCurrencyMap[data.country] || 'USD';
          set({
            country: data.country,
            countryCode: data.countryCode || 'PS',
            currency: mappedCurrency,
            source: 'ip',
          });
          // update exchange rate if needed
          await get().setCurrency(mappedCurrency);
        } catch (err) {
          console.error('geo-fetch:Failed', err);
        }
      },

      // 🔄 Reset + re-fetch
      resetToGeo: async () => {
        get().clearcon();
        await get().fetchGeo();
      },
    }),
    {
      name: 'region-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (state && state.isHydrated === false) {
            setTimeout(() => {
              useRegion.setState({ isHydrated: true });
            }, 0);
          }
        };
      },
    }
  )
);
