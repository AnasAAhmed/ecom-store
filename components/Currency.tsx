'use client';
import { useEffect, useState } from 'react';
import { useRegion } from '@/lib/hooks/useCart';
import Modal from './ui/Modal';
import { countryToCurrencyMap, countryToFlagMap, currencyToSymbolMap } from '@/lib/utils/features';


const allCountries = Object.keys(countryToCurrencyMap);
const Currency = ({ className, geoCountry, geoCountryCode }: { className: string; geoCountry?: string, geoCountryCode?: string }) => {
  const { currency, setCurrency, country, setCountry, clearcon } = useRegion();
  const [modalOpen, setModalOpen] = useState(currency !== '' && country !== '');

  useEffect(() => {
    if (!country && geoCountry) {
      setCountry(geoCountry);
      const mappedCurrency = countryToCurrencyMap[geoCountry];
      if (mappedCurrency) setCurrency(mappedCurrency);
    }
  }, [geoCountry, setCountry, setCurrency, country]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    const mappedCurrency = countryToCurrencyMap[selectedCountry];
    if (mappedCurrency) setCurrency(mappedCurrency);

  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const isCustomCountry = geoCountry && !allCountries.includes(geoCountry);
  return (
    <>
      <button title='Change Currency & Region' onClick={openModal} className='flex items-center text-small-medium gap-2'>
        <img title={countryToFlagMap[country] + " flg"} src={`https://flagcdn.com/96x72/${countryToFlagMap[country] || geoCountryCode?.toLowerCase() || 'ps'}.png` || 'https://flagcdn.com/96x72/pk.png'} alt={countryToFlagMap[country] + " Flag"} width={24} height={18} />
        {currency} {currencyToSymbolMap[currency]}
      </button>
      <Modal isOpen={modalOpen} onClose={closeModal} overLay={true}>
        <div className={`${className} bg-white p-8 sm:p-12 flex flex-col gap-6 ring-2 rounded-xl border border-gray-200 max-w-md mx-auto`}>
          <h2 className="text-lg font-semibold text-gray-800">🛠️ Region Settings</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor='currency' className="text-sm text-gray-600">Select your currency</label>
            <select
              id="currency"
              aria-label="Currency"
              title="Select Currency"
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
          <div className="flex flex-col gap-2">
            <label htmlFor='country' className="text-sm text-gray-600">Select your country</label>
            <select
              id="country"
              aria-label="Country"
              title="Select Country"
              name="country"
              value={country}
              onChange={handleCountryChange}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allCountries.map((c) => (
                <option title={c} key={c} value={c}>{c}</option>
              ))}
              {isCustomCountry && (
                <option title={geoCountry} value={geoCountry}>{geoCountry}</option>
              )}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full">
            <button
              className="mt-4 self-end w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
              onClick={closeModal}
            >
              Done
            </button>
            <button
              className="mt-4 self-end px-4 w-full py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
              onClick={() =>{ clearcon();closeModal()}}
            >
              Reset
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Currency;
