'use client';
import { useRegion } from '@/lib/hooks/useCart';

const Currency = ({ className }: { className: string }) => {
  const { currency, setCurrency } = useRegion();
  const handleCurrencyChange = (e: any) => {
    setCurrency(e.target.value);
  };

  return (
    <div className={className}>
      <label htmlFor="currency" className='hidden'>Currency:</label>
      <select
        id='currency'
        aria-label="Currency"
        title='Select Currency'
        name="currency"
        value={currency}
        onChange={handleCurrencyChange}
        className="py-1 cursor-pointer text-[14px] border-gray-300 rounded"
      >
        <option title='US Dollar' value="USD">USD ($)</option>
        <option title='Pakistani rupee' value="PKR">PKR (Rs)</option>
        <option title='Euro' value="EUR">EUR (€)</option>
        <option title='Pound Sterling' value="GBP">GBP (£)</option>
        <option title='Canadian Dollar' value="CAD">CAD (C$)</option>
        <option title='ustralian Dollar' value="AUD">AUD (A$)</option>
      </select>
    </div>
  );
};

export default Currency;
