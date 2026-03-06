'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
            if (menuOpen) setMenuOpen(false);
        } else {
            setHidden(false);
        }
    });

    const baseNavLinks = [
        { label: 'Services', href: '/services' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    const navLinks = pathname === '/'
        ? baseNavLinks
        : [{ label: 'Home', href: '/' }, ...baseNavLinks];

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="font-display text-2xl font-bold tracking-tight text-[#09090b] hover:text-[#D4AF37] transition-all">
                        BrikUp
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center h-full">
                        <div className="flex items-center h-full">
                            {navLinks.map((item, index) => (
                                <div key={item.label} className="flex items-center h-full">
                                    {index > 0 && <div className="h-4 w-[1px] bg-[#D4AF37]/20 mx-4" />}
                                    <Link
                                        href={item.href}
                                        className="text-sm font-medium text-[#09090b]/60 hover:text-[#D4AF37] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="ml-8 h-4 w-[1px] bg-[#D4AF37]/20 mr-8" />

                        <button className="text-sm font-bold bg-[#D4AF37] text-black px-4 py-1.5 rounded-full hover:bg-[#c9a227] transition-all flex items-center gap-1">
                            Get App
                        </button>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center text-[#09090b]"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pointer-events-auto bg-white border-b border-[#D4AF37]/20 overflow-hidden md:hidden shadow-lg"
                        >
                            <div className="flex flex-col py-4 px-6 space-y-4">
                                {navLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-lg font-medium text-[#09090b]/60 hover:text-[#D4AF37] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <button className="text-lg font-bold text-[#D4AF37] pt-2 border-t border-[#D4AF37]/20">
                                    Get App
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
}
