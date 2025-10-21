'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';

type FadeInOnViewProps = {
    children: ReactNode;
    delay?: number;
    threshold?: number;
    animation?: 'animate-fadeIn' | 'animate-fadeInUp';
    className?: string;
};

const FadeInOnView = ({ animation = 'animate-fadeInUp', children, delay = 0, threshold = 0.2, className = '' }: FadeInOnViewProps) => {
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
            className={`inline-block ${isVisible ? `opacity-100 ${animation} duration-700` : 'opacity-0'} ${className}`}
            style={{
                transitionDelay: `${delay}ms`,
                animationDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

export default FadeInOnView;
