'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Image from 'next/image';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
            <div className="relative w-full max-w-md h-96 mb-8">
                <Image
                    src="/svg/Feeling sorry-pana.svg"
                    alt="Error"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-zinc-900 mb-4">
                Something went wrong.
            </h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto text-lg">
                We apologize for the inconvenience. Please try again later.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-8 py-3 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                Try Again
            </button>
        </div>
    );
}
