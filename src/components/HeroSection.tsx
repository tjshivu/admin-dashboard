'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { Search, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";


const CAROUSEL_ITEMS = [
    { type: 'qr', src: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://brikuptech.com/' },
    { type: 'image', src: '/svg/location-search-pana.svg', alt: 'Find Pros' },
    { type: 'image', src: '/svg/barbershop-full-of-clients-bro.svg', alt: 'Barbershop' },
    { type: 'image', src: '/svg/tattoo-artist-bro.svg', alt: 'Tattoo Artist' },
    { type: 'image', src: '/svg/Lawyer-cuate.svg', alt: 'Lawyer' },
];

/**
 * HeroSection Component
 *
 * Cinematic Scrollytelling Experience:
 * 1. Intro: Text visible, Phone on right.
 * 2. Scroll 0-20%: Text fades out, Phone moves to center.
 * 3. Scroll 20-80%: Phone pinned in center, slides cycle through as user scrolls.
 * 4. Scroll 80-100%: Phone exits to the right.
 */
export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Add physics smoothing to the scroll progress
    // Reverting to direct scrollYProgress for absolute stability
    // 1. Text Animations (Fade out and move left)
    const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const textX = useTransform(scrollYProgress, [0, 0.15], [0, -100]);
    const textDisplay = useTransform(scrollYProgress, (v) => v > 0.15 ? "none" : "flex");

    // 2. Phone Animations
    // New Strategy: Absolute Positioning for precise control.
    // Start: 80% left (Approx center of the right layout column)
    // End: 50% left (Exact center of screen)
    const phoneLeft = useTransform(scrollYProgress,
        [0, 0.2, 0.8, 1],
        ["80%", "50%", "50%", "50%"]
    );

    // Always center the element on its 'left' anchor
    const phoneX = "-50%";

    const phoneRotateY = useTransform(scrollYProgress, [0, 0.2], [0, 0]); // Keep flat
    const phoneScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]); // Slight zoom

    // 3. Background Watermark Text (Fades in when phone centers)
    const bgTextOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]); // Fade in as main text fades out
    const bgTextY = useTransform(scrollYProgress, [0, 1], [100, -100]); // Parallax movement

    // Mobile detection for conditional animations
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 3. Carousel Logic (Driven by Scroll)
    const [currentIndex, setCurrentIndex] = useState(0);

    // Map scroll range 0.25 -> 0.75 to the slide indices
    const slideProgress = useTransform(scrollYProgress, [0.25, 0.75], [0, CAROUSEL_ITEMS.length - 1]);

    useMotionValueEvent(slideProgress, "change", (latest) => {
        const index = Math.round(latest);
        if (index !== currentIndex && index >= 0 && index < CAROUSEL_ITEMS.length) {
            setCurrentIndex(index);
        }
    });

    return (
        <div ref={containerRef} className="relative h-auto pt-24 pb-4 lg:py-0 lg:h-[300vh] bg-white">
            <div className="relative lg:sticky top-0 h-auto lg:h-screen w-full overflow-visible lg:overflow-hidden flex items-center justify-center">

                {/* Backgrounds */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/90 to-white/50 pointer-events-none" />

                <div className="container max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full h-full flex flex-col justify-center pointer-events-none">

                    {/* Background Watermark Text (Fills empty space) */}
                    <div className="absolute inset-0 flex items-center justify-between px-4 md:px-20 pointer-events-none overflow-hidden">
                        <motion.div
                            style={{ opacity: bgTextOpacity, y: bgTextY }}
                            className="hidden lg:block max-w-[300px]"
                        >
                            <h2 className="text-8xl font-black text-zinc-200 leading-none tracking-tighter">
                                FIND<br /><span className="text-zinc-300">PROS</span>
                            </h2>
                            <p className="mt-4 text-zinc-500 font-medium text-lg max-w-[200px]">
                                Connect with top-rated talent in minutes.
                            </p>
                        </motion.div>

                        <motion.div
                            style={{ opacity: bgTextOpacity, y: bgTextY }}
                            className="hidden lg:block max-w-[300px] text-right"
                        >
                            <h2 className="text-8xl font-black text-zinc-200 leading-none tracking-tighter">
                                GET<br /><span className="text-zinc-300">DONE</span>
                            </h2>
                            <p className="mt-4 text-zinc-500 font-medium text-lg max-w-[200px] ml-auto">
                                Verified reviews, secure payments.
                            </p>
                        </motion.div>
                    </div>

                    {/* Phone positioned absolutely within container context */}
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                        <motion.div
                            style={{
                                left: phoneLeft,
                                x: phoneX,
                                rotateY: phoneRotateY,
                                scale: phoneScale
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-zinc-900 rounded-[50px] border-[8px] border-zinc-800 shadow-2xl shadow-zinc-900/20 overflow-hidden z-20 group pointer-events-auto hidden lg:block"
                        >
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

                            {/* Screen Content */}
                            <div className="w-full h-full bg-zinc-50 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/5 to-transparent pointer-events-none" />

                                <AnimatePresence mode="wait">
                                    {CAROUSEL_ITEMS[currentIndex].type === 'qr' ? (
                                        <motion.div
                                            key="qr-view"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            transition={{ duration: 0.4 }}
                                            className="relative z-10 flex flex-col items-center gap-6 w-full h-full justify-center"
                                        >
                                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/20 mb-2">
                                                <span className="font-display text-white text-2xl font-bold">B</span>
                                            </div>
                                            <h3 className="font-display text-2xl font-bold text-zinc-900 leading-tight">Get the App</h3>
                                            <div className="bg-white p-4 rounded-3xl shadow-xl shadow-zinc-200 border border-zinc-100">
                                                <Image src={CAROUSEL_ITEMS[0].src} alt="QR" width={180} height={180} className="object-contain" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={`image-${currentIndex}`}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.4 }}
                                            className="relative z-10 flex flex-col items-center justify-center w-full h-full"
                                        >
                                            <div className="relative w-full h-64 mb-6">
                                                <Image src={CAROUSEL_ITEMS[currentIndex].src} alt={CAROUSEL_ITEMS[currentIndex].alt || 'Service'} fill className="object-contain" />
                                            </div>
                                            <h3 className="font-display text-xl font-bold text-zinc-900 leading-tight mb-2">
                                                {CAROUSEL_ITEMS[currentIndex].alt}
                                            </h3>
                                            <p className="text-zinc-500 text-sm">Find the best local pros.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-center h-full pointer-events-none">

                        {/* LEFT SIDE: Text Content */}
                        <motion.div
                            style={{
                                opacity: isMobile ? 1 : textOpacity,
                                x: isMobile ? 0 : textX,
                                display: isMobile ? "flex" : textDisplay
                            }}
                            className="flex flex-col items-start text-left order-2 lg:order-1 pointer-events-auto"
                        >
                            {/* ... text content ... */}
                            {/* Review/Trust Badge */}
                            <div className="order-5 lg:order-1 w-full max-w-md mt-4 lg:mt-0 hidden lg:block">
                                <BlurFade delay={0.1} inView>
                                    <div className="bg-white rounded-full shadow-lg border border-zinc-100 p-2 pl-3 flex items-center gap-4 hover:shadow-xl transition-shadow cursor-default group">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white relative overflow-hidden bg-zinc-200">
                                                    <Image
                                                        src={`https://randomuser.me/api/portraits/women/${i + 10}.jpg`}
                                                        alt="User"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-1">
                                                <div className="flex text-yellow-400">
                                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                                </div>
                                                <span className="text-zinc-900 font-bold text-sm">4.9/5</span>
                                            </div>
                                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Trusted by 10k+ in Bangalore</p>
                                        </div>
                                    </div>
                                </BlurFade>
                            </div>

                            {/* Headline */}
                            <div className="order-1 lg:order-2 mb-3 lg:mb-6">
                                <BlurFade delay={0.2} inView>
                                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1] text-left">
                                        Find trusted local professionals.
                                    </h1>
                                </BlurFade>
                            </div>

                            {/* Subheadline */}
                            <div className="order-2 lg:order-3 mb-4 lg:mb-10">
                                <BlurFade delay={0.3} inView>
                                    <p className="text-zinc-500 text-base md:text-xl font-normal leading-relaxed max-w-lg text-left">
                                        Expert help for every job, right in your neighborhood.
                                    </p>
                                </BlurFade>
                            </div>

                            {/* Search Bar - Hidden during scroll interaction for cleanliness */}
                            <div className="order-3 lg:order-4 w-full max-w-lg mb-6 lg:mb-10 -ml-1">
                                <BlurFade delay={0.35} inView>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex-1 flex items-center px-4 h-12 w-full">
                                            <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                            <input type="text" placeholder="Search near you" className="bg-transparent outline-none text-zinc-900 placeholder:text-zinc-500 w-full text-sm bg-white" />
                                        </div>
                                        <div className="hidden sm:block w-px h-8 bg-zinc-200 mx-2"></div>
                                        <div className="flex-1 flex items-center px-4 h-12 w-full border-t sm:border-t-0 border-zinc-100 sm:border-none">
                                            <MapPin className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                            <input type="text" placeholder="Zip code or city" className="bg-transparent outline-none text-zinc-900 placeholder:text-zinc-500 w-full text-sm bg-white" />
                                        </div>
                                        <button className="w-full sm:w-auto h-12 px-8 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors shrink-0">Search</button>
                                    </div>
                                </BlurFade>
                            </div>

                            {/* Buttons */}
                            <div className="order-4 lg:order-5 mb-2 lg:mb-12">
                                <BlurFade delay={0.4} inView>
                                    <div className="flex flex-row gap-3 w-full sm:w-auto">
                                        <a href="#" className="flex-1 sm:flex-none group flex items-center justify-center gap-3 px-4 py-3 sm:px-6 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1">
                                            <div className="text-left leading-none"><span className="text-sm sm:text-lg font-bold font-sans">App Store</span></div>
                                        </a>
                                        <a href="#" className="flex-1 sm:flex-none group flex items-center justify-center gap-3 px-4 py-3 sm:px-6 bg-white text-zinc-900 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-lg hover:-translate-y-1">
                                            <div className="text-left leading-none"><span className="text-sm sm:text-lg font-bold font-sans">Google Play</span></div>
                                        </a>
                                    </div>
                                </BlurFade>
                            </div>
                        </motion.div>

                        {/* RIGHT SIDE: Spacer to keep grid shape (Phone is now absolute) */}
                        <div className="hidden lg:block order-1 lg:order-2 h-full min-h-[500px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
