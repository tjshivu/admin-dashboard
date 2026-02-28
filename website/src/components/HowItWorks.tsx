'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

const SERVICES_COL1 = [
    { name: "Salon", icon: "/svg/barbershop-full-of-clients-bro.svg", tag: "Popular", color: "bg-blue-50", gradient: "bg-gradient-to-br from-blue-100/50 to-transparent" },
    { name: "Makeup", icon: "/svg/location-search-pana.svg", tag: "Trending", color: "bg-pink-50", gradient: "bg-gradient-to-br from-pink-100/50 to-transparent" },
    { name: "Tattoo", icon: "/svg/tattoo-artist-bro.svg", tag: "Creative", color: "bg-zinc-50", gradient: "bg-gradient-to-br from-zinc-100/50 to-transparent" },
];



const TOP_PROS = [
    { name: "Salon", image: "/svg/barbershop-full-of-clients-bro.svg", color: "bg-orange-50" },
    { name: "Makeup", image: "/svg/location-search-pana.svg", color: "bg-pink-50" },
    { name: "Tattoo", image: "/svg/tattoo-artist-bro.svg", color: "bg-zinc-50" },
];






/**
 * HowItWorks Component
 *
 * A comprehensive section explaining the value proposition of BrikUp.
 *
 * Sections:
 * 1. Trust Psychology: Visual proof of verification and safety.
 * 2. Most Used Services: Interactive marquee of services (Desktop) / Static Grid (Mobile).
 * 3. Top Professionals: Showcase of top-rated providers.
 * 4. Reviews: Scrolling marquee of user testimonials.
 */
export default function HowItWorks() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-white border-t border-zinc-100 overflow-hidden">
            <div className="w-full">
                {/* Most Used Services (Split Layout with Vertical Scroll) */}
                <div className="mb-16 md:mb-24 px-4 sm:px-6 md:px-12">
                    <div className="flex flex-col gap-10">
                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                            <div className="text-left max-w-2xl">
                                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-4 leading-tight tracking-tight">
                                    Most Used Services
                                </h2>
                                <p className="text-zinc-500 text-base sm:text-lg md:text-xl leading-relaxed">
                                    Explore the most requested Salon, Makeup, and Tattoo services offered by verified professionals.
                                </p>
                            </div>
                            <button className="bg-zinc-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 group whitespace-nowrap active:scale-95 shadow-lg shadow-zinc-900/10">
                                Explore All Services
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </button>
                        </div>

                        {/* 3 Simple Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {SERVICES_COL1.map((service, i) => (
                                <div key={i} className={cn("relative w-full aspect-square sm:aspect-auto sm:h-[22rem] rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 cursor-pointer border border-zinc-100 bg-white shadow-sm hover:shadow-xl", service.color)}>
                                    <div className={cn("absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-60", service.gradient)}></div>

                                    <div className="relative z-10 flex justify-between items-start w-full">
                                        {service.tag && (
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-zinc-800 tracking-wide shadow-sm border border-black/5">
                                                {service.tag}
                                            </span>
                                        )}
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300 border border-black/5">
                                            <ArrowUpRight size={18} />
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center text-center mt-auto w-full">
                                        <div className="relative w-36 h-36 mb-6 filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-500 ease-out">
                                            <Image src={service.icon} alt={service.name} fill className="object-contain" priority />
                                        </div>
                                        <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 leading-tight mb-2">{service.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Rated Professionals (Marquee Reverse / Right to Left) */}
                <div className="mb-16 md:mb-24">
                    <div className="px-6 md:px-12 mb-8">
                        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">Top Rated Professionals</h2>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                        <Marquee reverse pauseOnHover className="[--duration:30s]">
                            {TOP_PROS.map((pro, i) => (
                                <div key={i} className={cn("mx-4 md:mx-6 relative w-64 h-80 md:w-80 md:h-96 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-sm transition-all group p-4 md:p-6 flex flex-col items-center justify-end bg-white", pro.color)}>
                                    <div className="absolute inset-x-0 top-0 bottom-20 md:bottom-24 flex items-center justify-center p-4">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={pro.image}
                                                alt={pro.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 320px"
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-white p-4 md:p-6 h-20 md:h-24 flex items-center justify-between border-t border-zinc-50">
                                        <div>
                                            <h3 className="font-bold text-base md:text-lg text-zinc-900">{pro.name}</h3>
                                        </div>
                                        <button className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </div>

            </div>
        </section>
    );
}
