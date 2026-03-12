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
    src: "/images/hero-illustrations/barber_men.jpg",
    alt: "BrikUp barber professional in Bengaluru"
  },
  {
    src: "/images/hero-illustrations/make_up_artist.png",
    alt: "BrikUp makeup artist professional in Bengaluru"
  },
  {
    src: "/images/hero-illustrations/tattoo_artist.jpg",
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
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center pt-32 pb-16 px-6 md:px-12 lg:px-24 relative z-10 gap-12 lg:gap-24 transition-all duration-700 ease-in-out bg-white border-b border-[#f5a623]/10">
        {/* Left Side: Content */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center lg:justify-start px-4 py-2">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight text-[#09090b]">
                Discover.<br />
                Trust.<br />
                Book.
              </span>
            </AnimatedShinyText>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[#09090b]/60 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            BrikUp connects you with verified local professionals so you can find the right service and book with confidence.
          </motion.p>
        </div>

        {/* Right Side: Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex-1 w-full max-w-[500px] flex justify-center lg:justify-end"
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
              className="relative p-10 rounded-3xl border border-[#f5a623]/30 bg-[#f9f9f9] backdrop-blur-sm shadow-clean-md"
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Verified Professionals", value: "100%", sub: "Profile checks" },
                  { label: "Authentic Reviews", value: "Real", sub: "Community vetted" },
                  { label: "Easy Booking", value: "Simple", sub: "Confirm in seconds" },
                  { label: "Instant Service", value: "Instant", sub: "Verified experts" }
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1 p-4 rounded-2xl bg-white border border-[#f5a623]/10 shadow-clean-sm">
                    <p className="text-[#f5a623] font-bold text-2xl font-display">{stat.value}</p>
                    <p className="text-[#09090b] text-sm font-semibold">{stat.label}</p>
                    <p className="text-[#09090b]/40 text-xs">{stat.sub}</p>
                  </div>
                ))}
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
