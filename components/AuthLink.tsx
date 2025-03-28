'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { ReactNode } from 'react'

const AuthLink = ({ children, url, title }: { children: ReactNode; url: 'login' | 'sign-up'; title: string }) => {
    // const pathname = usePathname();
      const searchParams = useSearchParams();
    
      const redirectUrl = searchParams.get("redirect_url") || "/";
    return (
        <Link title={title} href={`/${url}?redirect_url=${encodeURIComponent(redirectUrl)}`}>
            {children}
        </Link>
    )
}

export default AuthLink
