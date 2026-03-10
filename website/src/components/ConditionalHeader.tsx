'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

export default function ConditionalHeader() {
    const pathname = usePathname();
    // Don't show website header on admin routes
    if (pathname.startsWith('/admin')) return null;
    return <Header />;
}
