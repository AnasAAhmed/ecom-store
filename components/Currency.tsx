'use client';
import { useRegion } from '@/lib/hooks/useCart';

const Currency = ({ className }: { className: string }) => {
  const { currency, setCurrency } = useRegion();
  const handleCurrencyChange = (e: any) => {
    setCurrency(e.target.value);
  };

  return (
    <div className={className}>
      <select
        name="currency"
        value={currency}
        onChange={handleCurrencyChange}
        className="py-1 cursor-pointer text-[14px] border-gray-300 rounded"
      >
        <option value="USD">USD ($)</option>
        <option value="PKR">PKR (Rs)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
        <option value="CAD">CAD (C$)</option>
        <option value="AUD">AUD (A$)</option>
      </select>
    </div>
  );
};

export default Currency;
