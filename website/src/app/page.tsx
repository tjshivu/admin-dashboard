'use client';

import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import Image from 'next/image';

// Lazy load components
const MostUsedServices = dynamic(() => import('@/components/MostUsedServices'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center text-[#18181b]/20">Loading...</div>,
  ssr: false
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="bg-white min-h-screen text-[#18181b] font-sans selection:bg-[#D4AF37] selection:text-white flex flex-col relative overflow-hidden">

      {/* Hero Section */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center pt-32 pb-16 px-6 md:px-12 lg:px-24 relative z-10 gap-12 lg:gap-24 transition-all duration-700 ease-in-out bg-white border-b border-[#D4AF37]/10">
        {/* Left Side: Content */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center lg:justify-start px-4 py-2">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight text-[#18181b]">
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
            className="text-[#18181b]/60 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            BrikUp connects you with verified local professionals so you can find the right service and book with confidence.
          </motion.p>
        </div>

        {/* Right Side: Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex-1 w-full max-w-[550px] flex justify-center lg:justify-end"
        >
          <div className="relative w-full aspect-square max-h-[450px] flex items-center justify-center">
            <Image
              src="/images/hero-illustrations/barber_men.jpg"
              alt="Professional Service"
              width={600}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Trust Section */}
      <section className="bg-white py-20 px-6 md:px-12 border-b border-[#D4AF37]/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#18181b]">
                How BrikUp Handles Trust
              </h2>
              <p className="text-[#18181b]/60 text-lg md:text-xl leading-relaxed max-w-xl">
                We verify professionals and provide transparent information so users can confidently choose the right service provider.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 backdrop-blur-sm"
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Verified Profiles", value: "100%" },
                  { label: "Real Reviews", value: "Trusted" }
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-[#18181b] font-bold text-2xl">{stat.value}</p>
                    <p className="text-[#18181b]/40 text-xs uppercase tracking-widest font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lazy loaded Most Used Services */}
      <div className="relative z-10 bg-white">
        <MostUsedServices />
      </div>

      {/* Upward Glow (Subtle gold) */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 via-transparent to-transparent blur-3xl opacity-20" />
      </div>

      {/* Lazy loaded Footer */}
      <Footer />
    </main>
  );
}
