'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';

type FadeInOnViewProps = {
    children: ReactNode;
    delay?: number;
    threshold?: number;
    animation?: 'animate-fadeIn' | 'animate-fadeInUp';
    className?: string;
};

const FadeInOnView = ({ animation, children, delay = 0, threshold = 0.2, className = '' }: FadeInOnViewProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold }
        );

        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`transition-opacity duration-700 ${isVisible ? `opacity-100 ${animation} delay-[${delay}ms]` : 'opacity-0'} ${className}`}
        >
            {children}
        </div>
    );
};

export default FadeInOnView;
