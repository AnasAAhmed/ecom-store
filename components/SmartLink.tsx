'use client';

import { useProgressStore } from '@/lib/hooks/useProgressBar';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { ReactNode } from 'react';

type SmartLinkProps = LinkProps & {
    children: ReactNode;
    title?: string;
    className?: string;
    target?:string;
};

export default function SmartLink({ target, title = '', children, ...props }: SmartLinkProps) {
    const start = useProgressStore((state) => state.start);

    return (
        <Link
            {...props}
            onClick={(e) => {
                start();
                props.onClick?.(e);
            }}
            title={title}
            target={target}
        >
            {children}
        </Link>
    );
}
