'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProgressStore } from '@/lib/hooks/useProgressBar';
import Image from 'next/image';

export default function ProgressBar() {
  const searchParams = useSearchParams();
  // const progress = useProgressStore((s) => s.progress);
  const complete = useProgressStore((s) => s.complete);
  const progress = useProgressStore((s) => s.progress);
  const loading = useProgressStore((s) => s.loading);
  useEffect(() => {
    const timer = setTimeout(() => {
      complete();
    }, 10);
    return () => clearTimeout(timer);
  }, [searchParams]);


  return (
    <div className="fixed top-0 left-0 z-[9999] h-[3px] w-full bg-transparent">
      <div
        className="h-full bg-blue-500 transition-all duration-200 ease-linear"
        style={{
          width: `${progress}%`,
          opacity: loading ? 1 : 0,
        }}
      >
        <div className="absolute top-0 left-[-50%] h-full w-[50%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine" />


      </div>
    </div>
    // <div
    //   style={{
    //     opacity: loading ? 1 : 0,
    //     pointerEvents: loading ? "auto" : "none",
    //   }}
    //   className="fixed inset-0 z-[9999] flex flex-col items-center duration-500 bg-white/70  transition-opacity justify-center"
    // >
    //   {/* <Loader /> */}
    //   <div className="loader"></div>
    //   <Image
    //     src="/logo.png"
    //     alt=" borcelle logo"
    //     priority
    //     width={240}
    //     height={174}
    //     className="size-auto brightness-0 invert-0"
    //   />
    // </div>
  );
}
