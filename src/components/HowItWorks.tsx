'use client';

import { Star, Shield, CheckCircle, Users, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
    {
        id: 1,
        title: "Fantastic Experience",
        text: "BrikUp transformed how I find local pros. The process was incredibly smooth and the professional I hired was top-notch.",
        name: "Sarah Jenkins",
        date: "2024-01-15",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        title: "Super Reliable",
        text: "I was skeptical at first, but the verified reviews really helped. Found a great plumber in under 10 minutes.",
        name: "Mike Thompson",
        date: "2023-12-10",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 3,
        title: "Highly Recommend",
        text: "The interface is so easy to use. I love being able to compare quotes instantly without calling around.",
        name: "Priya Krishna",
        date: "2023-11-28",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
        id: 4,
        title: "Great Service",
        text: "Customer support was amazing when I had a question. The pro arrived on time and did a perfect job.",
        name: "David Lee",
        date: "2023-10-05",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
        id: 5,
        title: "Best App for Pros",
        text: "As a service provider, BrikUp gives me steady work. The clients are verified and payments are secure.",
        name: "Emma Watson",
        date: "2023-09-20",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
        id: 6,
        title: "Life Saver",
        text: "Had an emergency repair needed on a Sunday. BrikUp connected me with someone willing to come out immediately.",
        name: "James Rodriguez",
        date: "2023-08-14",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    }
];

const SERVICES_COL1 = [
    { name: "Home Cleaning", icon: "🧹", count: "2k+ Pros", rating: "4.9", tag: "Popular", color: "bg-blue-50", gradient: "bg-gradient-to-br from-blue-100/50 to-transparent" },
    { name: "AC Repair", icon: "❄️", count: "1.2k+ Pros", rating: "4.8", tag: "Seasonal", color: "bg-cyan-50", gradient: "bg-gradient-to-br from-cyan-100/50 to-transparent" },
    { name: "Pest Control", icon: "🚫", count: "800+ Pros", rating: "4.7", tag: "Essential", color: "bg-rose-50", gradient: "bg-gradient-to-br from-rose-100/50 to-transparent" },
    { name: "Painting", icon: "🎨", count: "1k+ Pros", rating: "4.9", tag: "Trending", color: "bg-violet-50", gradient: "bg-gradient-to-br from-violet-100/50 to-transparent" },
    { name: "Laundry", icon: "🧺", count: "500+ Pros", rating: "4.6", tag: "Fast", color: "bg-indigo-50", gradient: "bg-gradient-to-br from-indigo-100/50 to-transparent" },
];

const SERVICES_COL2 = [
    { name: "Plumbing", icon: "🚰", count: "1.5k+ Pros", rating: "4.8", tag: "Urgent", color: "bg-emerald-50", gradient: "bg-gradient-to-br from-emerald-100/50 to-transparent" },
    { name: "Electrician", icon: "⚡", count: "1.2k+ Pros", rating: "4.9", tag: "High Demand", color: "bg-amber-50", gradient: "bg-gradient-to-br from-amber-100/50 to-transparent" },
    { name: "Carpentry", icon: "🪚", count: "900+ Pros", rating: "4.7", tag: "Custom", color: "bg-orange-50", gradient: "bg-gradient-to-br from-orange-100/50 to-transparent" },
    { name: "Appliance Repair", icon: "🔧", count: "1.1k+ Pros", rating: "4.8", tag: "Expert", color: "bg-slate-50", gradient: "bg-gradient-to-br from-slate-100/50 to-transparent" },
    { name: "Moving", icon: "📦", count: "800+ Pros", rating: "4.9", tag: "Reliable", color: "bg-lime-50", gradient: "bg-gradient-to-br from-lime-100/50 to-transparent" },
];

const TOP_PROS = [
    { name: "Elite Barbers", type: "Grooming", rating: "4.9", image: "/svg/barbershop-full-of-clients-bro.svg", color: "bg-orange-50" },
    { name: "Luxe Salon", type: "Beauty", rating: "5.0", image: "/svg/location-search-pana.svg", color: "bg-pink-50" },
    { name: "Pro Ink", type: "Art", rating: "4.8", image: "/svg/tattoo-artist-bro.svg", color: "bg-zinc-50" },
    { name: "City Law", type: "Legal", rating: "4.9", image: "/svg/Lawyer-cuate.svg", color: "bg-slate-50" },
];

const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
        </g>
    </svg>
);
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

/**
 * ReviewCard Component
 *
 * Compact, single-line review card — avatar, name, stars, and a short quote.
 */
const ReviewCard = ({
    title,
    text,
    name,
    avatar,
}: {
    title: string;
    text: string;
    name: string;
    date: string;
    avatar: string;
}) => {
    return (
        <div className="mx-2 sm:mx-3 bg-white px-4 py-3 rounded-xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-zinc-100 hover:shadow-[0_4px_16px_rgb(0,0,0,0.07)] transition-all duration-200 flex items-center gap-3 cursor-pointer w-[320px] sm:w-[360px]">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-zinc-100 relative overflow-hidden shrink-0">
                <Image
                    src={avatar}
                    alt={name}
                    fill
                    sizes="32px"
                    className="object-cover"
                />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-xs text-zinc-900 truncate">{name}</span>
                    <div className="flex gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={10} className="text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>
                </div>
                <p className="text-zinc-500 text-[11px] leading-snug truncate">&ldquo;{text}&rdquo;</p>
            </div>
        </div>
    );
};

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
                {/* Trust Psychology Section */}
                <div className="mb-16 md:mb-24 px-4 sm:px-6 md:px-12">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 sm:mb-4 tracking-tight">
                            Built on Trust, Powered by Community.
                        </h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                            We use advanced verification and community-driven social proof to ensure you always hire with confidence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-8 max-w-5xl mx-auto">
                        <div className="bg-zinc-50 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-zinc-100 flex flex-col items-center text-center">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 mb-3 sm:mb-4 md:mb-6">
                                <Image
                                    src="/svg/Life in a city-amico.svg"
                                    alt="Verified Professionals"
                                    fill
                                    sizes="(max-width: 768px) 128px, 192px"
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="font-display font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">Verified Professionals</h3>
                            <p className="text-zinc-500 text-xs sm:text-sm md:text-base">Every pro undergoes a strict background check and trade verification process.</p>
                        </div>
                        <div className="bg-zinc-50 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-zinc-100 flex flex-col items-center text-center">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 mb-3 sm:mb-4 md:mb-6">
                                <Image
                                    src="/svg/Conversation-pana.svg"
                                    alt="Authentic Reviews"
                                    fill
                                    sizes="(max-width: 768px) 128px, 192px"
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="font-display font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">Authentic Reviews</h3>
                            <p className="text-zinc-500 text-xs sm:text-sm md:text-base">Reviews are from real neighbors who have actually used the service.</p>
                        </div>
                        <div className="bg-zinc-50 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-zinc-100 flex flex-col items-center text-center">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 mb-3 sm:mb-4 md:mb-6">
                                <Image
                                    src="/svg/Group Chat-cuate.svg"
                                    alt="Community Vetted"
                                    fill
                                    sizes="(max-width: 768px) 128px, 192px"
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="font-display font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">Community Vetted</h3>
                            <p className="text-zinc-500 text-xs sm:text-sm md:text-base">Services are constantly rated by your local community to maintain high standards.</p>
                        </div>
                    </div>
                </div>

                {/* Most Used Services (Split Layout with Vertical Scroll) */}
                <div className="mb-16 md:mb-24 px-4 sm:px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Left: Content */}
                        <div className="text-left">
                            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-6 leading-tight tracking-tight">
                                Most Used Services
                            </h2>
                            <p className="text-zinc-500 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8">
                                From quick repairs to major renovations, find the most trusted professionals for every home need in your area.
                            </p>
                            <button className="bg-zinc-900 text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 group">
                                Explore All Services
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </button>
                        </div>

                        {/* Right: Vertical Marquees Box (Desktop Animated) */}
                        <div className="hidden md:flex relative h-[600px] w-full overflow-hidden rounded-[2.5rem] bg-zinc-50 border border-zinc-100 p-4 gap-4">
                            {/* Column 1: Scroll Up (SERVICES_COL1) */}
                            <Marquee vertical pauseOnHover className="[--duration:40s] flex-1 justify-center overflow-hidden">
                                {SERVICES_COL1.map((service, i) => (
                                    <div key={i} className={cn("mb-4 relative w-full aspect-[4/3] rounded-3xl p-5 flex flex-col justify-between overflow-hidden group transition-all hover:scale-95 cursor-pointer border border-zinc-100 bg-white shadow-sm hover:shadow-md", service.color)}>
                                        <div className={cn("absolute inset-0 opacity-40", service.gradient)}></div>

                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-[10px] font-bold text-zinc-900">{service.rating}</span>
                                            </div>
                                            {service.tag && (
                                                <span className="bg-zinc-900/5 px-2 py-1 rounded-full text-[10px] font-bold text-zinc-700 uppercase tracking-wide">
                                                    {service.tag}
                                                </span>
                                            )}
                                        </div>

                                        <div className="relative z-10 flex flex-col items-center text-center mt-1">
                                            <span className="text-4xl mb-2 filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                                            <h3 className="font-bold text-zinc-900 leading-tight">{service.name}</h3>
                                        </div>

                                        <div className="relative z-10 flex items-center justify-between mt-1">
                                            <span className="text-xs text-zinc-500 font-medium">{service.count}</span>
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                                <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Marquee>
                            {/* Column 2: Scroll Down (SERVICES_COL2) */}
                            <Marquee vertical reverse pauseOnHover className="[--duration:45s] flex-1 justify-center overflow-hidden">
                                {SERVICES_COL2.map((service, i) => (
                                    <div key={i} className={cn("mb-4 relative w-full aspect-[4/3] rounded-3xl p-5 flex flex-col justify-between overflow-hidden group transition-all hover:scale-95 cursor-pointer border border-zinc-100 bg-white shadow-sm hover:shadow-md", service.color)}>
                                        <div className={cn("absolute inset-0 opacity-40", service.gradient)}></div>

                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-[10px] font-bold text-zinc-900">{service.rating}</span>
                                            </div>
                                            {service.tag && (
                                                <span className="bg-zinc-900/5 px-2 py-1 rounded-full text-[10px] font-bold text-zinc-700 uppercase tracking-wide">
                                                    {service.tag}
                                                </span>
                                            )}
                                        </div>

                                        <div className="relative z-10 flex flex-col items-center text-center mt-1">
                                            <span className="text-4xl mb-2 filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                                            <h3 className="font-bold text-zinc-900 leading-tight">{service.name}</h3>
                                        </div>

                                        <div className="relative z-10 flex items-center justify-between mt-1">
                                            <span className="text-xs text-zinc-500 font-medium">{service.count}</span>
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                                <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Marquee>
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-zinc-50 to-transparent z-10"></div>
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-zinc-50 to-transparent z-10"></div>
                        </div>

                        {/* Mobile Static View (Uber Style Grid) */}
                        <div className="md:hidden grid grid-cols-2 xs:grid-cols-3 gap-2 sm:gap-3 w-full">
                            {[...SERVICES_COL1, ...SERVICES_COL2].slice(0, 6).map((service, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-2 sm:p-3 bg-zinc-50 rounded-xl sm:rounded-2xl border border-zinc-100 aspect-square shadow-sm active:scale-95 transition-transform cursor-pointer">
                                    <span className="text-2xl sm:text-3xl mb-1 sm:mb-2 filter drop-shadow-sm">{service.icon}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 text-center leading-tight tracking-tight">{service.name}</span>
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
                                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 bg-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400 md:w-3.5 md:h-3.5" />
                                        <span className="text-[10px] md:text-xs font-bold text-zinc-900">{pro.rating}</span>
                                    </div>
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
                                            <p className="text-xs md:text-sm text-zinc-600">{pro.type}</p>
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

                {/* Header */}
                <div className="mb-8 sm:mb-12 flex flex-col items-start text-left px-4 sm:px-6">
                    <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 sm:mb-4 tracking-tight">
                        Loved by locals
                    </h2>
                    <p className="text-sm md:text-base text-zinc-500 max-w-lg font-normal">
                        See what our community has to say.
                    </p>
                </div>

                {/* Desktop Reviews Marquee */}
                <div className="hidden md:flex relative w-full flex-col items-center justify-center overflow-hidden bg-white">
                    <Marquee pauseOnHover className="[--duration:40s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.id} {...review} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:40s] mt-3">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.id} {...review} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
                </div>

                {/* Mobile Reviews */}
                <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory flex gap-2 px-4 pb-6 no-scrollbar">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="min-w-[280px] snap-center bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2.5 flex items-center gap-2.5"
                        >
                            <div className="w-7 h-7 rounded-full bg-zinc-200 relative overflow-hidden shrink-0">
                                <Image
                                    src={review.avatar}
                                    alt={review.name}
                                    fill
                                    sizes="28px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="font-semibold text-[11px] text-zinc-900 truncate">{review.name}</span>
                                    <div className="flex gap-0.5 shrink-0">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={8} className="text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-zinc-500 text-[10px] leading-snug truncate">&ldquo;{review.text}&rdquo;</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
