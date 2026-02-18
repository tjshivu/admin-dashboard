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
 *
 * Spring physics applied for butter-smooth transitions across all devices.
 */
export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Spring config for buttery smooth scroll-linked animations
    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const smoothProgress = useSpring(scrollYProgress, springConfig);

    // 1. Text Animations (Spring-smoothed fade out and slide left)
    const textOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
    const textX = useTransform(smoothProgress, [0, 0.12], [0, -80]);
    const textDisplay = useTransform(smoothProgress, (v) => v > 0.15 ? "none" : "flex");

    // 2. Phone Animations (Spring-smoothed for fluid motion)
    const phoneLeft = useTransform(smoothProgress,
        [0, 0.2, 0.8, 1],
        ["80%", "50%", "50%", "120%"]
    );
    const phoneX = "-50%";
    const phoneScale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [1, 1.15, 1.15, 0.9]);
    const phoneRotateY = useTransform(smoothProgress, [0, 0.2], [5, 0]);

    // 3. Background Watermark Text (Smoothed fade in, synced with phone centering)
    const bgTextOpacity = useTransform(smoothProgress, [0.12, 0.25], [0, 1]);
    const bgTextFadeOut = useTransform(smoothProgress, [0.75, 0.9], [1, 0]);
    const bgTextCombinedOpacity = useTransform(
        [bgTextOpacity, bgTextFadeOut],
        ([fadeIn, fadeOut]: number[]) => Math.min(fadeIn, fadeOut)
    );
    const bgTextYLeft = useTransform(smoothProgress, [0, 1], [60, -60]);
    const bgTextYRight = useTransform(smoothProgress, [0, 1], [80, -80]);

    // Mobile detection for conditional animations
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // 4. Carousel Logic (Driven by smoothed scroll for perfect sync)
    const [currentIndex, setCurrentIndex] = useState(0);

    // Wider scroll range for more breathing room between slides
    const slideProgress = useTransform(smoothProgress, [0.2, 0.78], [0, CAROUSEL_ITEMS.length - 1]);

    useMotionValueEvent(slideProgress, "change", (latest) => {
        const index = Math.round(latest);
        const clamped = Math.max(0, Math.min(index, CAROUSEL_ITEMS.length - 1));
        if (clamped !== currentIndex) {
            setCurrentIndex(clamped);
        }
    });

    return (
        <div ref={containerRef} className="relative h-auto pt-20 pb-0 md:pt-24 lg:py-0 lg:h-[300vh] bg-white">
            <div className="relative lg:sticky top-0 h-auto lg:h-screen w-full overflow-visible lg:overflow-hidden flex items-center justify-center">

                {/* Backgrounds */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/90 to-white/50 pointer-events-none" />

                <div className="container max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10 w-full h-full flex flex-col justify-center pointer-events-none">

                    {/* Background Watermark Text — Darker colors for better visibility */}
                    <div className="absolute inset-0 flex items-center justify-between px-4 md:px-20 pointer-events-none overflow-hidden">
                        <motion.div
                            style={{ opacity: bgTextCombinedOpacity, y: bgTextYLeft }}
                            className="hidden lg:block max-w-[300px]"
                        >
                            <h2 className="text-8xl font-black text-zinc-400 leading-none tracking-tighter">
                                FIND<br /><span className="text-zinc-500">PROS</span>
                            </h2>
                            <p className="mt-4 text-zinc-600 font-medium text-lg max-w-[200px]">
                                Connect with top-rated talent in minutes.
                            </p>
                        </motion.div>

                        <motion.div
                            style={{ opacity: bgTextCombinedOpacity, y: bgTextYRight }}
                            className="hidden lg:block max-w-[300px] text-right"
                        >
                            <h2 className="text-8xl font-black text-zinc-400 leading-none tracking-tighter">
                                GET<br /><span className="text-zinc-500">DONE</span>
                            </h2>
                            <p className="mt-4 text-zinc-600 font-medium text-lg max-w-[200px] ml-auto">
                                Verified reviews, secure payments.
                            </p>
                        </motion.div>
                    </div>

                    {/* Phone — Absolutely positioned, spring-smoothed animations */}
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                        <motion.div
                            style={{
                                left: phoneLeft,
                                x: phoneX,
                                rotateY: phoneRotateY,
                                scale: phoneScale,
                                willChange: 'transform, left',
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-[280px] h-[560px] md:w-[300px] md:h-[600px] bg-zinc-900 rounded-[45px] md:rounded-[50px] border-[7px] md:border-[8px] border-zinc-800 shadow-2xl shadow-zinc-900/30 overflow-hidden z-20 group pointer-events-auto hidden lg:block"
                        >
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 md:w-32 h-6 md:h-7 bg-black rounded-b-2xl z-20" />

                            {/* Screen Content */}
                            <div className="w-full h-full bg-zinc-50 relative overflow-hidden flex flex-col items-center justify-center p-5 md:p-6 text-center">
                                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/5 to-transparent pointer-events-none" />

                                <AnimatePresence mode="wait">
                                    {CAROUSEL_ITEMS[currentIndex].type === 'qr' ? (
                                        <motion.div
                                            key="qr-view"
                                            initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
                                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                                            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            className="relative z-10 flex flex-col items-center gap-5 w-full h-full justify-center"
                                        >
                                            <div className="w-14 h-14 md:w-16 md:h-16 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/20 mb-1">
                                                <span className="font-display text-white text-xl md:text-2xl font-bold">B</span>
                                            </div>
                                            <h3 className="font-display text-xl md:text-2xl font-bold text-zinc-900 leading-tight">Get the App</h3>
                                            <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl shadow-zinc-200 border border-zinc-100">
                                                <Image src={CAROUSEL_ITEMS[0].src} alt="QR" width={160} height={160} className="object-contain md:w-[180px] md:h-[180px]" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={`image-${currentIndex}`}
                                            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                                            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            className="relative z-10 flex flex-col items-center justify-center w-full h-full"
                                        >
                                            <div className="relative w-full h-56 md:h-64 mb-4 md:mb-6">
                                                <Image src={CAROUSEL_ITEMS[currentIndex].src} alt={CAROUSEL_ITEMS[currentIndex].alt || 'Service'} fill className="object-contain" />
                                            </div>
                                            <h3 className="font-display text-lg md:text-xl font-bold text-zinc-900 leading-tight mb-1 md:mb-2">
                                                {CAROUSEL_ITEMS[currentIndex].alt}
                                            </h3>
                                            <p className="text-zinc-500 text-xs md:text-sm">Find the best local pros.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 md:gap-12 lg:gap-20 items-center h-full pointer-events-none">

                        {/* LEFT SIDE: Text Content */}
                        <motion.div
                            style={{
                                opacity: isMobile || isTablet ? 1 : textOpacity,
                                x: isMobile || isTablet ? 0 : textX,
                                display: isMobile || isTablet ? "flex" : textDisplay
                            }}
                            className="flex flex-col items-start text-left order-2 lg:order-1 pointer-events-auto"
                        >
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
                                    <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1] text-left">
                                        Find trusted local professionals.
                                    </h1>
                                </BlurFade>
                            </div>

                            {/* Subheadline */}
                            <div className="order-2 lg:order-3 mb-5 lg:mb-10">
                                <BlurFade delay={0.3} inView>
                                    <p className="text-zinc-500 text-base md:text-lg lg:text-xl font-normal leading-relaxed max-w-lg text-left">
                                        Expert help for every job, right in your neighborhood.
                                    </p>
                                </BlurFade>
                            </div>

                            {/* Search Bar */}
                            <div className="order-3 lg:order-4 w-full max-w-lg mb-5 lg:mb-10">
                                <BlurFade delay={0.35} inView>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex-1 flex items-center px-4 h-11 sm:h-12 w-full">
                                            <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                            <input type="text" placeholder="Search near you" className="bg-transparent outline-none text-zinc-900 placeholder:text-zinc-500 w-full text-sm bg-white" />
                                        </div>
                                        <div className="hidden sm:block w-px h-8 bg-zinc-200 mx-2"></div>
                                        <div className="flex-1 flex items-center px-4 h-11 sm:h-12 w-full border-t sm:border-t-0 border-zinc-100 sm:border-none">
                                            <MapPin className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                            <input type="text" placeholder="Zip code or city" className="bg-transparent outline-none text-zinc-900 placeholder:text-zinc-500 w-full text-sm bg-white" />
                                        </div>
                                        <button className="w-full sm:w-auto h-11 sm:h-12 px-8 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors shrink-0">Search</button>
                                    </div>
                                </BlurFade>
                            </div>

                            {/* Buttons */}
                            <div className="order-4 lg:order-5 mb-2 lg:mb-12">
                                <BlurFade delay={0.4} inView>
                                    <div className="flex flex-row gap-3 w-full sm:w-auto">
                                        <a href="#" className="flex-1 sm:flex-none group flex items-center justify-center gap-3 px-5 py-3 sm:px-6 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1">
                                            <div className="text-left leading-none"><span className="text-sm sm:text-lg font-bold font-sans">App Store</span></div>
                                        </a>
                                        <a href="#" className="flex-1 sm:flex-none group flex items-center justify-center gap-3 px-5 py-3 sm:px-6 bg-white text-zinc-900 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-lg hover:-translate-y-1">
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
