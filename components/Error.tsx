'use client';

import SmartLink from "@/components/SmartLink";
import { useSearchParams } from 'next/navigation';

export default function ErrorUi() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || '';
    const error = searchParams.get('error') || '';
    const provider = searchParams.get('provider') || '';
    let errorMessage = 'Something went wrong during sign in.';

    if (error === 'AccessDenied') {
        errorMessage = 'You do not have permission to sign in.';
    } else if (error === 'Configuration') {
        errorMessage = 'Internet Error Please Check your connection.';

    } else {
        errorMessage = decodeURIComponent(error);
    }

    return (
        <div className="flex flex-col items-center pt-24 min-h-screen">
            <h1 className="text3xl sm:text-5xl font-bold mb-4 dark:text-gray-200">{provider} OAuth Sign In Error.</h1>
            <p className="text-2xl sm:text-3xl mb-4  dark:text-gray-200">{errorMessage}</p>
            <p className="text-2xl sm:text-3xl mb-4  dark:text-gray-200">{message}</p>
            <div className='flex items-center gap-3'>
                <SmartLink title='Go back to home page' href={'/'} className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Go back to the homepage</SmartLink>
                <SmartLink title='Login' href={'/login'} className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Login</SmartLink>
                <SmartLink title='Sign-up' href={'/sign-up'} className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Sign-up</SmartLink>
            </div>
        </div>
    );
}
