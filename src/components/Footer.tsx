
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import Link from 'next/link';



/**
 * Footer Component
 *
 * The global footer displaying helpful links, newsletter subscription, and legal info.
 * Includes a large "BRIKUP" watermark for brand presence.
 */
export default function Footer() {
    return (
        <footer className="relative bg-zinc-950 border-t border-zinc-900 pt-12 md:pt-16 pb-0 overflow-hidden text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row justify-between mb-10 sm:mb-12 gap-8 md:gap-8 relative z-10 text-left">
                {/* Brand & Newsletter */}
                <div className="max-w-xs">
                    <h3 className="font-display text-lg md:text-xl font-medium text-white mb-3">Get updates</h3>
                    <p className="text-zinc-500 text-xs md:text-sm mb-4 font-light leading-relaxed">
                        Subscribe for the latest features and offers.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs md:text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/20 transition-colors w-full h-10"
                        />
                        <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-zinc-200 transition-colors shrink-0">
                            <Send size={14} />
                        </button>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
                    <div>
                        <h4 className="font-semibold text-white mb-3 uppercase text-[10px] md:text-xs tracking-wider">Platform</h4>
                        <ul className="space-y-2 text-zinc-500 text-xs md:text-sm">
                            {['Browse Pros', 'How it Works', 'Pricing', 'Safety'].map(item => (
                                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3 uppercase text-[10px] md:text-xs tracking-wider">Company</h4>
                        <ul className="space-y-2 text-zinc-500 text-xs md:text-sm">
                            {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-2 md:hidden flex gap-4 mt-2">
                        {[
                            { icon: Twitter, name: 'Twitter' },
                            { icon: Instagram, name: 'Instagram' },
                            { icon: Linkedin, name: 'LinkedIn' },
                            { icon: Facebook, name: 'Facebook' }
                        ].map(item => (
                            <Link key={item.name} href="#" className="text-zinc-500 hover:text-white transition-colors">
                                <item.icon size={18} />
                            </Link>
                        ))}
                    </div>
                    <div className="hidden md:block">
                        <h4 className="font-semibold text-white mb-3 uppercase text-[10px] md:text-xs tracking-wider">Social</h4>
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
