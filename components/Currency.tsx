'use client';
import { useEffect } from 'react';
import { useRegion } from '@/lib/hooks/useRegion';
import Modal from './ui/Modal';
import { countryToCurrencyMap, countryToFlagMap, currencyToSymbolMap } from '@/lib/utils/features.csr';
import { useModalStore } from '@/lib/hooks/useModal';

const allCountries = Object.keys(countryToFlagMap);

const Currency = () => {
  const {
    currency,
    country,
    setCurrency,
    setCountry,
    setCountryCode,
    setSource,
    resetToGeo,
    fetchGeo,
    isHydrated,
    source,
  } = useRegion();
  const { close } = useModalStore();

  useEffect(() => {
    if (isHydrated && !country && source !== 'manual') {
      fetchGeo();
    }
  }, [isHydrated, country, source, fetchGeo]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setSource('manual');
    const mappedCurrency = countryToCurrencyMap[selectedCountry];
    const mappedCode = countryToFlagMap[selectedCountry];
    if (mappedCurrency) setCurrency(mappedCurrency);
    if (mappedCode) setCountryCode(mappedCode);
  };

  return (
    <Modal modalKey="region-currency" overlay={true}>
      <div className="bg-white p-8 sm:p-12 flex flex-col gap-6 ring-2 rounded-xl border border-gray-200 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-800">🛠️ Region Settings</h2>

        {/* Currency */}
        <div className="flex flex-col gap-2">
          <label htmlFor="currency" className="text-sm text-gray-600">Select your currency</label>
          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={handleCurrencyChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="PKR">PKR (Rs)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>

        {/* Country */}
        <div className="flex flex-col gap-2">
          <label htmlFor="country" className="text-sm text-gray-600">Select your country</label>
          <select
            id="country"
            name="country"
            value={country}
            onChange={handleCountryChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {allCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full">
          <button
            className="mt-4 self-end w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            onClick={() => close('region-currency')}
          >
            Done
          </button>

          <button
            className="mt-4 self-end px-4 w-full py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            onClick={async () => {
              await resetToGeo();
              close('region-currency');
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </Modal>
  );
};


export const CurrencyBtn = ({ className = '' }: { className?: string; }) => {
  const { currency, country, countryCode, isHydrated } = useRegion();
  const { open } = useModalStore();
  if (!isHydrated) return null;

  return (
    <button
      onClick={() => open('region-currency')}
      title='Change Currency & Region'
      className={`${className} flex items-center text-small-medium gap-2`}>
      <img
        title={countryToFlagMap[country].toUpperCase() + " flg"}
        src={`https://flagsapi.com/${countryCode?.toUpperCase() || countryToFlagMap[country]?.toUpperCase() || 'PS'}/flat/64.png`}
         alt={countryToFlagMap[country] + " Flag"} width={24} height={18} />
      {currency} {currencyToSymbolMap[currency]}
    </button>
  )
}


export default Currency;
