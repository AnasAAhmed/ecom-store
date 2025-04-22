'use client'
import React, { useEffect, useState } from 'react'

const IsOnline = () => {
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [showMessage, setShowMessage] = useState<boolean>(!navigator.onLine);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setMessage("You're back online!");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000); // hide after 3 sec
        };

        const handleOffline = () => {
            setIsOnline(false);
            setMessage("You're offline. Check your connection.");
            setShowMessage(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showMessage ) return null;
    if (message === '') return null;

    return (
        <div
            className='fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-white shadow-md transition-all duration-300 z-50'
            style={{ backgroundColor: isOnline ? 'green' : 'gray' }}
        >
            {message}
        </div>
    )
}

export default IsOnline;
