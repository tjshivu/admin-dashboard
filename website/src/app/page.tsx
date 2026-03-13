'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import Image from 'next/image';

// Lazy load components
const MostUsedServices = dynamic(() => import('@/components/MostUsedServices'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center text-[#18181b]/20">Loading...</div>,
  ssr: false
});

const TopRatedProfessionals = dynamic(() => import('@/components/TopRatedProfessionals'), {
  loading: () => <div className="min-h-[300px]" />,
  ssr: false
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false
});

const HERO_IMAGES = [
  {
    src: "/images/hero-illustrations/barber_men.webp",
    alt: "BrikUp barber professional in Bengaluru"
  },
  {
    src: "/images/hero-illustrations/make_up_artist.webp",
    alt: "BrikUp makeup artist professional in Bengaluru"
  },
  {
    src: "/images/hero-illustrations/tattoo_artist.webp",
    alt: "BrikUp tattoo artist professional in Bengaluru"
  }
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-white min-h-screen text-[#09090b] font-sans selection:bg-[#D4AF37] selection:text-black flex flex-col relative overflow-hidden">

      {/* Hero Section */}
      <div className="w-full relative z-10 transition-all duration-700 ease-in-out bg-[#FFFDF7] border-b border-[#f5a623]/10">
        <style>{`
          @keyframes pillPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.35; }
          }
          .animate-pill-pulse {
            animation: pillPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
        
        {/* Responsive Grid Wrapper */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-[32px] md:gap-[48px] items-center pt-[80px] px-[20px] pb-[20px] sm:px-[24px] sm:pt-[80px] sm:pb-[48px] md:px-[48px] md:pt-[128px] md:pb-[64px] lg:px-[96px]">
          
          {/* Left Side: Content */}
          <div className="flex flex-col text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-['Syne'] text-[40px] md:text-[56px] font-[800] leading-[1.0] text-[#1a1a1a] m-0">
                Discover,<br />Trust,<br />
                <span className="text-[#F59E0B]">Book.</span>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 48 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-[48px] h-[3px] bg-[#F59E0B] rounded-[2px] my-[20px] overflow-hidden"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[#6B7280] text-[14px] md:text-[15px] leading-[1.7] max-w-[360px] mb-[28px] m-0"
            >
              BrikUp connects you with <strong className="text-[#1a1a1a]">verified local professionals</strong> so you can find the right service and book with confidence.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex max-[480px]:flex-col flex-wrap gap-[12px] mb-[20px] w-full"
            >
              <button className="bg-[#F59E0B] text-white rounded-[40px] px-[26px] py-[13px] text-[14px] font-[600] max-[480px]:w-full justify-center flex items-center transition-opacity hover:opacity-90">
                Book a Service
              </button>
              <button className="bg-transparent border-[1.5px] border-[#D1D5DB] text-[#1a1a1a] rounded-[40px] px-[26px] py-[13px] text-[14px] font-[500] max-[480px]:w-full justify-center flex items-center hover:bg-[#1a1a1a]/5 transition-colors">
                Are you a Professional?
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-[7px] bg-white border border-[#FDE68A] rounded-[20px] px-[14px] py-[6px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#F59E0B] animate-pill-pulse" />
                <span className="text-[11px] text-[#92400E] font-[600]">App launching soon — stay tuned</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Hero Illustration (Unchanged) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full flex justify-center md:justify-end max-w-[500px] mx-auto md:mx-0"
          >
          <div className="relative w-full aspect-square max-h-[460px] flex items-center justify-center rounded-3xl overflow-hidden bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={HERO_IMAGES[currentImageIndex].src}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={HERO_IMAGES[currentImageIndex].src}
                  alt={HERO_IMAGES[currentImageIndex].alt}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Section */}
      <section className="bg-[#fafafa] py-20 px-6 md:px-12 border-b border-[#f5a623]/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#09090b]">
                Why Professionals Trust BrikUp
              </h2>
              <p className="text-[#09090b]/60 text-lg md:text-xl leading-relaxed max-w-xl">
                We verify every professional and surface transparent information, so you can always choose the right expert with confidence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#FFFBF2] border-[1.5px] border-[#F59E0B] rounded-[24px] p-5"
            >
              <div className="grid grid-cols-2 gap-[14px]">
                {[
                  { category: "TRUST", stat: "100%", title: "Verified Professionals", sub: "Profile checks" },
                  { category: "QUALITY", stat: "Real", title: "Authentic Reviews", sub: "Community vetted" },
                  { category: "SPEED", stat: "Simple", title: "Easy Booking", sub: "Confirm in seconds" },
                  { category: "RELIABILITY", stat: "Instant", title: "Instant Service", sub: "Verified experts" }
                ].map((item, index) => {
                  const isGolden = index === 0 || index === 3;
                  return isGolden ? (
                    <div key={item.title} className="relative rounded-[18px] p-5 overflow-hidden bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex flex-col justify-center min-h-[160px]">
                      {/* Decorative Circles */}
                      <div className="absolute -top-6 -right-6 w-[70px] h-[70px] rounded-full bg-white/10 pointer-events-none" />
                      <div className="absolute -bottom-4 -left-4 w-[45px] h-[45px] rounded-full bg-white/10 pointer-events-none" />

                      <div className="relative z-10 flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-white/85 tracking-[0.08em] uppercase mb-1">
                          {item.category}
                        </span>
                        <span className="text-[30px] font-bold text-white leading-none mb-2">
                          {item.stat}
                        </span>
                        <span className="text-[13px] font-semibold text-white leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-white/80 leading-tight">
                          {item.sub}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div key={item.title} className="relative rounded-[18px] p-5 overflow-hidden bg-white border border-[#FDE68A] flex flex-col justify-center min-h-[160px]">
                      {/* Decorative Circle */}
                      <div className="absolute -top-6 -right-6 w-[70px] h-[70px] rounded-full bg-[#FEF9EC] pointer-events-none" />

                      <div className="relative z-10 flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#F59E0B] tracking-[0.08em] uppercase mb-1">
                          {item.category}
                        </span>
                        <span className="text-[30px] font-bold text-[#F59E0B] leading-none mb-2">
                          {item.stat}
                        </span>
                        <span className="text-[13px] font-semibold text-[#1a1a1a] leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-[#6B7280] leading-tight">
                          {item.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Top Rated Professionals (live feed, 2h cache) */}
      <div className="relative z-10">
        <TopRatedProfessionals />
      </div>

      {/* Lazy loaded Most Used Services */}
      <div className="relative z-10 bg-white">
        <MostUsedServices />
      </div>

      {/* Upward Glow (Subtle gold) */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5a623]/5 via-transparent to-transparent blur-3xl opacity-20" />
      </div>

      {/* Lazy loaded Footer */}
      <Footer />
    </main>
  );
}
