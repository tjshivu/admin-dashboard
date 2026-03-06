'use client';

import { motion } from "framer-motion";
import Image from "next/image";

const mostUsedServices = [
    {
        title: "Men's Salon",
        desc: "Expert Haircut & Beard Styling",
        image: "/svg/Barber-bro.svg",
    },
    {
        title: "Bridal",
        desc: "Elegant Makeup & Styling",
        image: "/svg/Makeup artist-bro.svg",
    },
    {
        title: "Tattoo Art",
        desc: "Unique Permanent Designs",
        image: "/svg/tattoo-artist-bro.svg",
    },
    {
        title: "Salon Care",
        desc: "Premium Local Favorites",
        image: "/svg/barbershop-full-of-clients-bro.svg",
    }
];

export default function MostUsedServices() {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-20 relative z-10">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[#18181b] text-3xl md:text-5xl font-bold tracking-tighter mb-16 text-center"
            >
                Most Used Services
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                {mostUsedServices.map((service, idx) => (
                    <motion.div
                        key={service.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                        className="group relative flex flex-col bg-white rounded-[2.5rem] border border-[#D4AF37]/20 overflow-hidden h-[380px] transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/50"
                    >
                        {/* Image Container with White Background */}
                        <div className="flex-1 relative bg-white flex items-center justify-center p-8 pb-4">
                            <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Content Container (White Background + Black Text) */}
                        <div className="bg-white p-8 pt-0 text-center">
                            <h3 className="text-xl font-bold text-[#18181b] mb-2">{service.title}</h3>
                            <p className="text-[#18181b]/60 text-sm font-medium tracking-wide">{service.desc}</p>
                        </div>

                        {/* Subtle interactive focus ring */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-[#D4AF37]/20 rounded-[2.5rem] pointer-events-none transition-all duration-300" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
