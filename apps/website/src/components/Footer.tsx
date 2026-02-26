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
    return (
        <footer className="relative bg-zinc-950 border-t border-zinc-900 pt-12 md:pt-16 pb-0 overflow-hidden text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-10 sm:mb-12 relative z-10 text-left">
                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Column 1: Company */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4 uppercase text-[10px] md:text-xs tracking-wider">Company</h4>
                        <ul className="space-y-3 text-zinc-500 text-xs md:text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors relative group w-fit block py-1">About<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full ease-out" /></Link></li>
                            <li><Link href="/services" className="hover:text-white transition-colors relative group w-fit block py-1">Services<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full ease-out" /></Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors relative group w-fit block py-1">Contact<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full ease-out" /></Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Services */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4 uppercase text-[10px] md:text-xs tracking-wider">Services</h4>
                        <ul className="space-y-3 text-zinc-500 text-xs md:text-sm">
                            <li><Link href="/services#salon" className="hover:text-white transition-colors">Salon</Link></li>
                            <li><Link href="/services#makeup" className="hover:text-white transition-colors">Makeup</Link></li>
                            <li><Link href="/services#tattoo" className="hover:text-white transition-colors">Tattoo</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Information */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4 uppercase text-[10px] md:text-xs tracking-wider">Contact Information</h4>
                        <div className="space-y-4">

                            <div className="flex items-start gap-2 text-zinc-500 text-xs md:text-sm leading-relaxed">
                                <MapPin size={16} className="text-zinc-400 mt-0.5 shrink-0" />
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
            </div>

            {/* Large Watermark */}
            <div className="w-full flex justify-center items-end opacity-20 pointer-events-none select-none overflow-hidden pt-8 sm:pt-12 md:pt-0">
                <h1 className="text-[18vw] sm:text-[22vw] md:text-[25vw] font-bold tracking-tighter text-white leading-[0.8]">
                    BRIKUP
                </h1>
            </div>

            {/* Bottom Bar */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row justify-between items-center py-4 sm:py-6 border-t border-zinc-900/50 relative z-10 bg-zinc-950">
                <p className="text-zinc-600 text-xs mb-4 md:mb-0">
                    &copy; 2026 BrikUp Inc. All rights reserved.
                </p>
                <div className="flex gap-6 text-xs text-zinc-600">
                    <Link href="#" className="hover:text-zinc-400 transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-zinc-400 transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-zinc-400 transition-colors">Sitemap</Link>
                </div>
            </div>
        </footer>
    );
}
