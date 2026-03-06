'use client';

import { Facebook, Twitter, Instagram, Linkedin, Send, MapPin, Mail } from 'lucide-react';
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Column 1: Company */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-6 uppercase text-[11px] tracking-[0.2em]">Company</h4>
                        <ul className="space-y-3 text-white/50 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Services */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-6 uppercase text-[11px] tracking-[0.2em]">Services</h4>
                        <ul className="space-y-3 text-white/50 text-sm">
                            {serviceCategories.map((category) => (
                                <li key={category}>
                                    <Link href="/services" className="hover:text-white transition-colors">
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Address */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h4 className="font-display font-semibold text-white mb-6 uppercase text-[11px] tracking-[0.2em]">Address</h4>
                        <div className="flex items-start gap-3 text-white/50 text-sm leading-relaxed">
                            <MapPin size={18} className="text-white/30 mt-0.5 shrink-0" />
                            <p>
                                #13, 7th A Cross Road,<br />
                                Gurudarshan Layout,<br />
                                Vidyaranyapura,<br />
                                Bengaluru - 560097
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Large Watermark */}
            <div className="w-full flex justify-center items-end opacity-20 pointer-events-none select-none overflow-hidden pt-8 sm:pt-12 md:pt-0">
                <h1 className="text-[18vw] sm:text-[22vw] md:text-[25vw] font-bold tracking-tighter text-white leading-[0.8]">
                    BRIKUP
                </h1>
            </div>

            {/* Bottom Bar */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row justify-between items-center py-4 sm:py-6 border-t border-white/10 relative z-10 bg-black">
                <p className="text-muted-foreground text-xs mb-4 md:mb-0">
                    &copy; 2026 BrikUp Inc. All rights reserved.
                </p>
                <div className="flex gap-6 text-xs text-muted-foreground">
                    <Link href="#" className="hover:text-zinc-400 transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-zinc-400 transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-zinc-400 transition-colors">Sitemap</Link>
                </div>
            </div>
        </footer>
    );
}
