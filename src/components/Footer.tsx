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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row justify-between mb-10 sm:mb-12 gap-8 md:gap-8 relative z-10 text-left">
                {/* Contact Form */}
                <div id="contact-us" className="w-full md:max-w-xs">
                    <h3 className="font-display text-lg md:text-xl font-medium text-white mb-3">Contact Us</h3>
                    <p className="text-zinc-500 text-[11px] md:text-xs mb-3 font-light leading-relaxed">
                        Have a question? Drop us a message.
                    </p>
                    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="text"
                            placeholder="Your name"
                            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] md:text-xs text-white placeholder:text-zinc-600 outline-none focus:border-white/20 transition-colors w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] md:text-xs text-white placeholder:text-zinc-600 outline-none focus:border-white/20 transition-colors w-full"
                        />
                        <textarea
                            placeholder="Your message"
                            rows={2}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] md:text-xs text-white placeholder:text-zinc-600 outline-none focus:border-white/20 transition-colors w-full resize-none"
                        />
                        <button className="bg-white text-black rounded-lg px-4 py-2 text-[11px] md:text-xs font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto">
                            <Send size={12} />
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                    <div>
                        <h4 className="font-display font-semibold text-white mb-3 uppercase text-[10px] md:text-xs tracking-wider">Platform</h4>
                        <ul className="space-y-2 text-zinc-500 text-xs md:text-sm">
                            {['Browse Pros', 'How it Works', 'Pricing', 'Safety'].map(item => (
                                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-display font-semibold text-white mb-3 uppercase text-[10px] md:text-xs tracking-wider">Company</h4>
                        <ul className="space-y-2 text-zinc-500 text-xs md:text-sm">
                            {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="font-display font-semibold text-white mb-3 uppercase text-[10px] md:text-xs tracking-wider">Address</h4>
                        <div className="flex items-start gap-2 text-zinc-500 text-xs md:text-sm leading-relaxed">
                            <MapPin size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                            <p>
                                #13, 7th A Cross Road,<br />
                                Gurudarshan Layout,<br />
                                Vidyaranyapura,<br />
                                Bengaluru - 560097
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-xs md:text-sm mt-3">
                            <Mail size={14} className="text-zinc-500 shrink-0" />
                            <a href="mailto:contact@brikuptech.com" className="hover:text-white transition-colors">contact@brikuptech.com</a>
                        </div>
                        {/* Mobile Social Icons */}
                        <div className="flex md:hidden gap-4 mt-4">
                            {[
                                { icon: Twitter, name: 'Twitter' },
                                { icon: Instagram, name: 'Instagram' },
                                { icon: Linkedin, name: 'LinkedIn' },
                                { icon: Facebook, name: 'Facebook' }
                            ].map(item => (
                                <Link key={item.name} href="#" className="text-zinc-500 hover:text-white transition-colors">
                                    <item.icon size={16} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Social (separate column) */}
                <div className="hidden md:block">
                    <h4 className="font-display font-semibold text-white mb-3 uppercase text-[10px] md:text-xs tracking-wider">Social</h4>
                    <ul className="space-y-2 text-zinc-500 text-xs md:text-sm">
                        {[
                            { name: 'Twitter', icon: Twitter },
                            { name: 'Instagram', icon: Instagram },
                            { name: 'LinkedIn', icon: Linkedin }
                        ].map(item => (
                            <li key={item.name}>
                                <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <item.icon size={14} /> {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
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
