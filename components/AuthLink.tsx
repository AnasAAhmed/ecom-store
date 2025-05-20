'use client'
import { useSearchParams } from 'next/navigation'
import React, { ReactNode } from 'react'
import SmartLink from './SmartLink'

const AuthLink = ({ children, url, title }: { children: ReactNode; url: 'login' | 'sign-up'; title: string }) => {
    // const pathname = usePathname();
    const searchParams = useSearchParams();

    const redirectUrl = searchParams.get("redirect_url") || "/";
    return (
        <SmartLink className='mt-8 text-base-medium' title={title} prefetch={false} href={`/${url}?redirect_url=${encodeURIComponent(redirectUrl)}`}>
            {children}
        </SmartLink>
    )
}

export default AuthLink
