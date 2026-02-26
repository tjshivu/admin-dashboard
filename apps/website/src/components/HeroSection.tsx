'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { Search, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";


const SERVICES = [
    { src: '/svg/barbershop team-pana.svg', alt: 'Salon', title: 'Top-Rated Hair Stylists', desc: 'Find the best barbers and stylists in your area.' },
    { src: '/svg/Makeup artist-bro.svg', alt: 'Makeup', title: 'Professional Makeup Artists', desc: 'Look your absolute best for any occasion.' },
    { src: '/svg/tattoo artist-bro.svg', alt: 'Tattoo', title: 'Creative Tattoo Artists', desc: 'Connect with talented artists for custom ink.' },
];

/**
 * HeroSection Component
 *
 * Cinematic Scrollytelling Experience:
 * 1. Intro: Text visible, Phone on right.
 * 2. Scroll 0-20%: Text fades out, Phone moves to center.
 * 3. Scroll 20-80%: Phone pinned in center, slides cycle through as user scrolls.
 * 4. Scroll 80-100%: Phone exits to the right.
 *
 * Spring physics applied for butter-smooth transitions across all devices.
 */
export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SERVICES.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-blue-600 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            <div className="container max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">

                    {/* LEFT SIDE: Text Content */}
                    <div className="flex flex-col items-start text-left order-2 lg:order-1">
                        {/* Headline */}
                        <div className="mb-4 lg:mb-6">
                            <BlurFade delay={0.2} inView>
                                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1] text-left">
                                    Find Trusted Professionals
                                </h1>
                            </BlurFade>
                        </div>

                        {/* Subheadline */}
                        <div className="mb-8 lg:mb-10">
                            <BlurFade delay={0.3} inView>
                                <p className="text-blue-100 text-base md:text-lg lg:text-xl font-normal leading-relaxed max-w-lg text-left">
                                    Salon, Makeup, and Tattoo services made simple.
                                </p>
                            </BlurFade>
                        </div>

                        {/* Download Buttons */}
                        <div className="w-full max-w-lg mb-8 lg:mb-12">
                            <BlurFade delay={0.35} inView>
                                <div className="flex flex-row gap-4 w-full sm:w-auto">
                                    <a href="#" className="flex-1 sm:flex-none group flex items-center justify-center gap-3 px-6 py-3.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1 border border-zinc-800">
                                        <div className="text-left leading-none"><span className="text-sm sm:text-base font-bold font-sans">App Store</span></div>
                                    </a>
                                    <a href="#" className="flex-1 sm:flex-none group flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-zinc-900 rounded-xl hover:bg-zinc-50 transition-all shadow-xl hover:-translate-y-1 border border-transparent">
                                        <div className="text-left leading-none"><span className="text-sm sm:text-base font-bold font-sans">Google Play</span></div>
                                    </a>
                                </div>
                            </BlurFade>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Services Display (Animated Carousel) */}
                    <div className="order-1 lg:order-2 flex justify-center items-center w-full h-full min-h-[400px]">
                        <BlurFade delay={0.4} inView className="w-full max-w-md relative">
                            {/* White Background Box with Blue Shade Inside */}
                            <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center w-full aspect-[4/5] sm:aspect-square group">
                                {/* Blue Shade Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white/80 z-0"></div>

                                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
                                    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentIndex}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="absolute inset-0 flex flex-col items-center justify-center pt-4"
                                            >
                                                <div className="relative w-full h-40 sm:h-52 mb-6">
                                                    <Image
                                                        src={SERVICES[currentIndex].src}
                                                        alt={SERVICES[currentIndex].alt}
                                                        fill
                                                        className="object-contain"
                                                        priority
                                                    />
                                                </div>
                                                <h3 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
                                                    {SERVICES[currentIndex].title}
                                                </h3>
                                                <p className="text-zinc-500 text-sm sm:text-base leading-relaxed px-4">
                                                    {SERVICES[currentIndex].desc}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Carousel Indicators / Toggles */}
                                    <div className="flex gap-2 z-20 mt-6 md:mt-8 pb-2">
                                        {SERVICES.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-blue-600' : 'w-2.5 bg-blue-200 hover:bg-blue-400'
                                                    }`}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                    </div>

                </div>
            </div>
        </div>
    );
}
