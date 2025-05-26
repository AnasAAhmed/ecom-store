'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProgressStore } from '@/lib/hooks/useProgressBar';

export default function ProgressBar() {
  const searchParams = useSearchParams();
  const progress = useProgressStore((s) => s.progress);
  const complete = useProgressStore((s) => s.complete);
  const loading = useProgressStore((s) => s.loading);
  const reset = useProgressStore((s) => s.reset)
  useEffect(() => {
    if (loading) complete();
    // return reset();
  }, [searchParams]);

  return (
    <div className="fixed top-0 left-0 z-[9999] h-[3px] w-full bg-transparent">
      <div
        className="h-full bg-blue-500 transition-all duration-200 ease-linear"
        style={{
          width: `${progress}%`,
          opacity: loading ? 1 : 0,
        }}
      />
    </div>
  );
}
