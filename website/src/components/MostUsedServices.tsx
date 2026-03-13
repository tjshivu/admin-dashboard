'use client';

import { motion } from "framer-motion";
import Image from "next/image";

const mostUsedServices = [
    {
        title: "Men's Salon",
        desc: "Haircuts, beard styling & grooming",
        image: "/svg/barber.webp",
    },
    {
        title: "Bridal",
        desc: "Elegant makeup & hair styling",
        image: "/svg/bridal.webp",
    },
    {
        title: "Salon Care",
        desc: "Premium full-service salon experience",
        image: "/svg/eyebrow.webp",
    },
    {
        title: "Tattoo Art",
        desc: "Custom permanent & temporary designs",
        image: "/svg/tattoo.webp",
    }
];

const bgColors: Record<string, string> = {
    "Men's Salon": "bg-[#FEF9EC]",
    "Bridal": "bg-[#FDF2F8]",
    "Salon Care": "bg-[#F0FDF4]",
    "Tattoo Art": "bg-[#EEF2FF]"
};

export default function MostUsedServices() {
    return (
        <section className="w-full relative z-10 bg-[#FFFDF7] px-[40px] py-[48px]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-[32px] gap-4">
                    <h2 className="font-['Syne'] text-[32px] font-[800] text-[#1a1a1a] leading-tight m-0">
                        Explore Our Services in <span className="text-[#F59E0B]">BrikUp</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                    {mostUsedServices.map((service, idx) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[20px] border border-[#FDE68A] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-sm flex flex-col"
                        >
                            {/* Image area */}
                            <div className="relative w-full h-[180px] bg-white flex items-center justify-center">
                                <div className="relative w-full h-[140px]">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]" />
                            </div>

                            {/* Content */}
                            <div className="p-[16px] bg-white flex-1">
                                <h3 className="font-['Syne'] text-[16px] font-[700] text-[#1a1a1a] mb-[4px] leading-tight">
                                    {service.title}
                                </h3>
                                <p className="text-[#6B7280] text-[12px] leading-[1.5] m-0">
                                    {service.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
