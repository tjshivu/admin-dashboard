'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/admin/utils';

const CACHE_KEY = 'brikup_feed_cache';
const CACHE_TS_KEY = 'brikup_feed_ts';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

interface Provider {
    _id: string;
    name: string;
    profile_image?: string;
    city?: string;
    about?: string;
    averageRating?: number | null;
}

function StarRating({ rating }: { rating: number }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
        <span className="flex items-center gap-0.5 text-[#f5a623]" aria-label={`${rating} stars`}>
            {Array.from({ length: 5 }).map((_, i) => {
                if (i < full) return <span key={i} className="text-xs">★</span>;
                if (i === full && half) return <span key={i} className="text-xs opacity-60">★</span>;
                return <span key={i} className="text-xs opacity-20">★</span>;
            })}
            <span className="ml-1 text-[10px] font-semibold text-[#09090b]/60">{rating.toFixed(1)}</span>
        </span>
    );
}

function Avatar({ name, src }: { name: string; src?: string }) {
    const [imgError, setImgError] = useState(false);
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    if (src && !imgError) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={getImageUrl(src)}
                alt={name}
                onError={() => setImgError(true)}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#f5a623]/20"
            />
        );
    }
    return (
        <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f5a623]/30 to-[#f5a623]/10 flex items-center justify-center border-2 border-[#f5a623]/20"
            aria-label={name}
        >
            <span className="text-[#f5a623] font-bold text-lg font-display">{initials}</span>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="flex flex-col bg-white rounded-3xl border border-[#f5a623]/10 p-6 h-[220px] animate-pulse">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#f5a623]/10 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-[#09090b]/8 rounded-full w-3/4" />
                    <div className="h-3 bg-[#09090b]/5 rounded-full w-1/2" />
                    <div className="h-3 bg-[#09090b]/5 rounded-full w-1/3" />
                </div>
            </div>
            <div className="space-y-2 mt-auto">
                <div className="h-3 bg-[#09090b]/5 rounded-full w-full" />
                <div className="h-3 bg-[#09090b]/5 rounded-full w-4/5" />
            </div>
        </div>
    );
}

export default function TopRatedProfessionals() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadFeed() {
            try {
                // Check cache
                const ts = localStorage.getItem(CACHE_TS_KEY);
                const cached = localStorage.getItem(CACHE_KEY);
                if (ts && cached && Date.now() - parseInt(ts, 10) < CACHE_TTL_MS) {
                    setProviders(JSON.parse(cached));
                    setLoading(false);
                    return;
                }

                // Fetch from API
                const res = await fetch('/api/feed/web', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store',
                });
                if (!res.ok) throw new Error('Feed fetch failed');
                const json = await res.json();
                const data: Provider[] = json?.data?.topProviders ?? [];

                // Store in cache
                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
                setProviders(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        loadFeed();
    }, []);

    // Don't render section on network error
    if (!loading && error) return null;

    return (
        <section className="bg-[#fafafa] py-20 px-6 md:px-12 border-b border-[#f5a623]/10 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <p className="text-[#f5a623] text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                        Verified &amp; Trusted
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#09090b]">
                        Top Rated Professionals
                    </h2>
                    <p className="text-[#09090b]/50 text-base mt-3 max-w-xl">
                        Handpicked professionals with the highest trust scores and customer satisfaction on BrikUp.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : providers.length === 0
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-[#f5a623]/20 p-6 h-[220px] text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-[#f5a623]/10 flex items-center justify-center mb-3 text-[#f5a623] text-xl">✦</div>
                                    <p className="text-[#09090b]/40 text-xs font-medium">Professionals<br />Coming Soon</p>
                                </div>
                            ))
                            : providers.map((p, idx) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.07, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="group relative flex flex-col bg-white rounded-3xl border border-[#f5a623]/15 p-6 h-[220px] transition-all duration-300 hover:border-[#f5a623]/40 hover:shadow-[0_16px_40px_-8px_rgba(245,166,35,0.12)]"
                                >
                                    {/* Gold hover line */}
                                    <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl bg-gradient-to-r from-transparent via-[#f5a623]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Top row: avatar + info */}
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="flex-shrink-0">
                                            <Avatar name={p.name} src={p.profile_image} />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <h3 className="text-[#09090b] font-bold text-sm leading-tight font-display truncate">
                                                {p.name}
                                            </h3>
                                            {p.city && (
                                                <p className="text-[#09090b]/40 text-xs mt-1 flex items-center gap-1">
                                                    <span>📍</span>
                                                    <span className="truncate">{p.city}</span>
                                                </p>
                                            )}
                                            {p.averageRating != null && (
                                                <div className="mt-1.5">
                                                    <StarRating rating={p.averageRating} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Trust badge */}
                                    <div className="mb-3">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20 text-[10px] font-semibold text-[#f5a623] uppercase tracking-wide">
                                            ✓ Verified
                                        </span>
                                    </div>

                                    {/* About */}
                                    {p.about && (
                                        <p className="text-[#09090b]/50 text-xs leading-relaxed line-clamp-2 mt-auto">
                                            {p.about}
                                        </p>
                                    )}
                                </motion.div>
                            ))
                    }
                </div>
            </div>
        </section>
    );
}
