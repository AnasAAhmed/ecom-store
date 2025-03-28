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
        <option value="Pakistani rupee">PKR (Rs)</option>
        <option value="Euro">EUR (€)</option>
        <option value="Pound Sterling">GBP (£)</option>
        <option value="Canadian Dollar">CAD (C$)</option>
        <option value="Australian Dollar">AUD (A$)</option>
      </select>
    </div>
  );
};

export default Currency;
