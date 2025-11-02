'use client';

import { useProgressStore } from '@/lib/hooks/useProgressBar';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import toast from 'react-hot-toast';

type SmartLinkProps = LinkProps & {
    children: ReactNode;
    title?: string;
    disabled?: boolean;
    className?: string;
    target?: string;
};

export default function SmartLink({ disabled = false, target, title = '', children, ...props }: SmartLinkProps) {
    const start = useProgressStore((state) => state.start);
    const pathname = usePathname()

    const [isPrefetch, setIsPrefetch] = useState(() => {
        if (props.prefetch === undefined) return false;
        return Boolean(props.prefetch);
    });

    const handleClick = () => {
        const href = props.href as string;

        if (href.startsWith('#') || href.startsWith('?')) {
            return;
        }

        const [basePath] = href.split(/[?#]/);
toast.error(basePath+pathname)
        if (basePath !== pathname) {
            start();
        }
    };

    return (
        <Link
            style={{ pointerEvents: disabled ? "none":undefined,cursor:disabled?'not-allowed':undefined }}
            {...props}
            onNavigate={() => {
                handleClick();
            }}
            prefetch={isPrefetch}
            onMouseEnter={() => setIsPrefetch(true)}
            title={title}
            target={target}
        >
            {children}
        </Link>
    );
}
