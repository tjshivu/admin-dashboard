'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const services = [
    {
        id: "salon",
        name: "Salon",
        tag: "Popular",
        description: "Transform your look with our top-rated hair stylists. From classic cuts to modern coloring and treatments, find the perfect professional to bring your vision to life.",
        icon: "/svg/barbershop-full-of-clients-bro.svg",
        color: "bg-blue-50/50",
        btnColor: "bg-blue-600 hover:bg-blue-700",
        reverse: false
    },
    {
        id: "makeup",
        name: "Makeup",
        tag: "Trending",
        description: "Look your absolute best for any occasion. Our verified makeup artists specialize in everything from subtle everyday enhancements to full glamorous bridal looks.",
        icon: "/svg/location-search-pana.svg",
        color: "bg-pink-50/50",
        btnColor: "bg-pink-600 hover:bg-pink-700",
        reverse: true
    },
    {
        id: "tattoo",
        name: "Tattoo",
        tag: "Creative",
        description: "Express yourself with original, custom ink. Connect with talented, hygienic, and verified tattoo artists who can turn your ideas into beautiful, lasting body art.",
        icon: "/svg/tattoo-artist-bro.svg",
        color: "bg-zinc-50",
        btnColor: "bg-zinc-900 hover:bg-zinc-800",
        reverse: false
    }
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-black selection:text-white pb-0">
            {/* Hero Header Space */}
            <div className="pt-24 pb-8 md:pt-32 md:pb-12 px-6 text-center max-w-2xl mx-auto">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-4 leading-tight">
                    Our Services
                </h1>
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed">
                    Discover our primary service categories. We focus strictly on what we do best, connecting you with elite local professionals in these specialties.
                </p>
            </div>

            {/* Alternating Sections */}
            <div className="flex flex-col overflow-hidden">
                {services.map((service) => (
                    <section key={service.id} className={`py-8 md:py-12 ${service.color}`}>
                        <div className="container max-w-5xl mx-auto px-6 md:px-8">
                            <div className={`flex flex-col ${service.reverse ? 'sm:flex-row-reverse' : 'sm:flex-row'} items-center gap-8 md:gap-16`}>

                                {/* Text Content */}
                                <div className="flex-1 text-center sm:text-left flex flex-col items-center sm:items-start group">
                                    <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 tracking-tight">
                                        {service.name}
                                    </h2>
                                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-md mx-auto sm:mx-0">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Image Content */}
                                <div className="flex-1 w-full max-w-[300px] sm:max-w-xs">
                                    <div className="relative aspect-square w-full rounded-3xl bg-white border border-zinc-100 shadow-md overflow-hidden flex items-center justify-center group hover:shadow-lg transition-shadow duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white z-0"></div>
                                        <div className="relative z-10 w-2/3 h-2/3 transform group-hover:scale-105 transition-transform duration-300">
                                            <Image
                                                src={service.icon}
                                                alt={service.name}
                                                fill
                                                className="object-contain filter drop-shadow-md"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <Footer />
        </main>
    );
}
