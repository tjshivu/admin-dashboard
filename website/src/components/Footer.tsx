'use client';

import { MapPin } from 'lucide-react';
import Link from 'next/link';



/**
 * Footer Component
 *
 * The global footer displaying helpful links, contact form, company address, and legal info.
 * Includes a large "BRIKUP" watermark for brand presence.
 */
export default function Footer() {
    const serviceCategories = ["Men's Salon", "Women's Salon", "Bridal & Makeup", "Tattoo"];

    return (
        <footer className="relative bg-black border-t border-white/10 pt-12 md:pt-16 pb-0 overflow-hidden text-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 relative z-10 text-left">
                {/* Main Grid */}
                <div className="flex gap-12 sm:gap-20 justify-start">

                    {/* Column 1: Company */}
                    <div>
                        <h4 className="font-display font-bold text-white mb-6 uppercase text-[12px] tracking-[0.2em]">Company</h4>
                        <ul className="space-y-3 text-white text-base">
                            <li><Link href="/about" className="hover:text-gray-300 transition-colors">About</Link></li>
                            <li><Link href="/about#contact" className="hover:text-gray-300 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Services */}
                    <div>
                        <h4 className="font-display font-bold text-white mb-6 uppercase text-[12px] tracking-[0.2em]">Services</h4>
                        <ul className="space-y-3 text-white text-base">
                            {serviceCategories.map((category) => (
                                <li key={category}>
                                    <Link href="/services" className="hover:text-gray-300 transition-colors">
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center items-end opacity-20 pointer-events-none select-none overflow-hidden pt-8 sm:pt-12 md:pt-0">
                <h1 className="text-[18vw] sm:text-[22vw] md:text-[25vw] font-bold tracking-tighter text-white leading-[0.8]">
                    BRIKUP
                </h1>
            </div>

            {/* Bottom Bar */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-center items-center py-4 sm:py-6 border-t border-white/10 relative z-10 bg-black">
                <p className="text-white text-sm">
                    &copy; 2026 BrikUp Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
