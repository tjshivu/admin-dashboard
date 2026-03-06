'use client';

import { motion } from "framer-motion";
import Image from "next/image";

const mostUsedServices = [
    {
        title: "Men's Salon",
        desc: "Haircuts, beard styling & grooming",
        image: "/svg/Barber-bro.svg",
    },
    {
        title: "Bridal",
        desc: "Elegant makeup & hair styling",
        image: "/svg/Makeup artist-bro.svg",
    },
    {
        title: "Tattoo Art",
        desc: "Custom permanent & temporary designs",
        image: "/svg/tattoo-artist-bro.svg",
    },
    {
        title: "Salon Care",
        desc: "Premium full-service salon experience",
        image: "/svg/barbershop-full-of-clients-bro.svg",
    }
];

export default function MostUsedServices() {
    return (
        <section className="w-full px-6 md:px-12 py-20 relative z-10 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <p className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-semibold mb-3">What We Offer</p>
                    <h2 className="text-[#09090b] text-3xl md:text-5xl font-bold tracking-tighter">
                        Most Used Services
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {mostUsedServices.map((service, idx) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -6 }}
                            className="group relative flex flex-col bg-white rounded-3xl border border-[#D4AF37]/15 overflow-hidden h-[360px] transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-[0_16px_40px_-8px_rgba(212,175,55,0.12)]"
                        >
                            {/* Gold top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Image area */}
                            <div className="flex-1 relative flex items-center justify-center p-6 pb-2 bg-white">
                                <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-3 border-t border-[#09090b]/5 bg-white">
                                <h3 className="text-[#09090b] text-lg font-bold mb-1 font-display">{service.title}</h3>
                                <p className="text-[#09090b]/50 text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
