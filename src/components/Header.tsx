'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ContactModal from './ContactModal';

/**
 * Header Component
 *
 * A fixed, floating pill-shaped header with:
 * - Scroll-aware show/hide (hidden during hero phone zone)
 * - Glassmorphism backdrop-blur
 * - Mobile hamburger menu with slide-down animation
 * - Contact modal trigger
 */
export default function Header() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        // Hero section is 400vh; phone fades out by ~93% of that
        const heroPhoneEnd = typeof window !== 'undefined' ? window.innerHeight * 3.7 : 2000;

        if (latest < heroPhoneEnd && latest > 80) {
            // Within the hero phone zone — always hide header
            setHidden(true);
            if (menuOpen) setMenuOpen(false);
        } else if (latest > previous && latest > 150) {
            // Past hero, scrolling down — hide
            setHidden(true);
            if (menuOpen) setMenuOpen(false);
        } else {
            // At very top or scrolling up past hero — show
            setHidden(false);
        }
    });

    const navLinks = [
        { label: 'Services', href: '/#services' },
        { label: 'About', href: '/about' },
    ];

    const handleContactClick = () => {
        setMenuOpen(false);
        setContactOpen(true);
    };

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8 pointer-events-none flex justify-center"
            >
                <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-zinc-200 rounded-full py-2 px-5 shadow-lg shadow-zinc-200/50 flex items-center justify-between gap-4 md:gap-8 max-w-4xl w-full relative">

                    {/* Logo (Left) */}
                    <Link href="/" className="font-display text-xl font-bold tracking-tight text-zinc-900 hover:opacity-80 transition-opacity">
                        BrikUp
                    </Link>

                    {/* Desktop Navigation (Right) */}
                    <nav className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-5">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="relative group text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-zinc-900 transition-all duration-300 group-hover:w-full ease-out" />
                                </Link>
                            ))}
                            <button
                                onClick={handleContactClick}
                                className="relative group text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1"
                            >
                                Contact
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-zinc-900 transition-all duration-300 group-hover:w-full ease-out" />
                            </button>
                        </div>

                        <button className="px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 active:scale-95">
                            Get App
                        </button>
                    </nav>

                    {/* Mobile: Get App + Hamburger */}
                    <div className="flex md:hidden items-center gap-3">
                        <button className="px-3 py-1.5 rounded-full bg-zinc-900 text-white text-[11px] font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 active:scale-95">
                            Get App
                        </button>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={20} className="text-zinc-700" /> : <Menu size={20} className="text-zinc-700" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="pointer-events-auto absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-200/60 overflow-hidden md:hidden"
                        >
                            <div className="flex flex-col py-2">
                                {navLinks.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="px-5 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <button
                                    onClick={handleContactClick}
                                    className="px-5 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-left"
                                >
                                    Contact
                                </button>
                                <div className="mx-4 my-1 h-px bg-zinc-100" />
                                <div className="px-5 py-3">
                                    <button className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors active:scale-[0.98]">
                                        Get App
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
        </>
    );
}
