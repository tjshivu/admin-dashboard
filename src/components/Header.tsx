'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

/**
 * Header Component
 *
 * A fixed, floating pill-shaped header that intelligently hides when scrolling down
 * and reappears when scrolling up, maximizing screen real estate.
 *
 * Features:
 * - Glassmorphism effect with backdrop-blur.
 * - Scroll-aware visibility logic using framer-motion.
 * - Responsive design (collapses menu on mobile).
 */
export default function Header() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8 pointer-events-none flex justify-center"
        >
            {/* 
               Centered Floating Pill Header (Light Mode)
               - Glassmorphism background with white base
               - Rounded full for pill shape
               - Border for definition
            */}
            <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-zinc-200 rounded-full py-2 px-5 shadow-lg shadow-zinc-200/50 flex items-center justify-between gap-8 max-w-4xl w-full">

                {/* Logo (Left) */}
                <Link href="/" className="font-display text-xl font-bold tracking-tight text-zinc-900 hover:opacity-80 transition-opacity">
                    BrikUp
                </Link>

                {/* Navigation (Right) */}
                <nav className="flex items-center gap-6">
                    {/* Links */}
                    <div className="hidden md:flex items-center gap-5">
                        {['Services', 'About', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="relative group text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1"
                            >
                                {item}
                                {/* Hover Underline Effect */}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-zinc-900 transition-all duration-300 group-hover:w-full ease-out" />
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button className="px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 active:scale-95">
                        Get App
                    </button>
                </nav>

            </div>
        </motion.header>
    );
}
