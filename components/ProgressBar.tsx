'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProgressStore } from '@/lib/hooks/useProgressBar';
import { Loader2 } from 'lucide-react';
import Loader from './ui/Loader';

export default function ProgressBar() {
  const searchParams = useSearchParams();
  const progress = useProgressStore((s) => s.progress);
  const complete = useProgressStore((s) => s.complete);
  const loading = useProgressStore((s) => s.loading);
  useEffect(() => {
    if (loading) return complete();
  }, [searchParams]);

  return (
    // <div className="fixed top-0 left-0 z-[9999] h-[3px] w-full bg-transparent">
    //   <div
    //     className="h-full bg-blue-500 transition-all duration-200 ease-linear"
    //     style={{
    //       width: `${progress}%`,
    //       opacity: loading ? 1 : 0,
    //     }}
    //   />
    // </div>
    <div
      style={{
        opacity: loading ? 1 : 0,
        display: loading ? 'flex' : 'none',
        backgroundColor: "rgba(0, 0, 0, 0.116)"
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-whiste text-black rounsded-full"
    >
      <Loader />
    </div>


  );
}
