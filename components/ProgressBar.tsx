'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useProgressStore } from '@/lib/hooks/useProgressBar';

export default function ProgressBar() {
  const pathname = usePathname();
  const progress = useProgressStore((s) => s.progress);
  const complete = useProgressStore((s) => s.complete);
  const loading = useProgressStore((s) => s.loading);

  useEffect(() => {
    if (loading) complete();
  }, [pathname]);

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
