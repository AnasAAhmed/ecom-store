'use client';

import { useProgressStore } from '@/lib/hooks/useProgressBar';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type SmartLinkProps = LinkProps & {
    children: ReactNode;
    title?: string;
    className?: string;
    target?: string;
};

export default function SmartLink({ target, title = '', children, ...props }: SmartLinkProps) {
    const start = useProgressStore((state) => state.start);
    const pathname = usePathname()
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        props.onClick?.(e);
        const href = (props.href as string).split('?')[0]
        if (href !== pathname) {
            start();
        }
    };
    return (
        <Link
            {...props}
            onClick={(e) => {
                handleClick(e);
                props.onClick?.(e);
            }}
            title={title}
            target={target}
        >
            {children}
        </Link>
    );
}
