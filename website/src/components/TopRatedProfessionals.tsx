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
    tags?: string[];
    services?: string[];
}

function StarRating({ rating }: { rating: number }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
        <span className="flex items-center gap-0.5 text-[#F59E0B]" aria-label={`${rating} stars`}>
            {Array.from({ length: 5 }).map((_, i) => {
                if (i < full) return <span key={i} className="text-sm">★</span>;
                if (i === full && half) return <span key={i} className="text-sm opacity-60">★</span>;
                return <span key={i} className="text-sm opacity-20">★</span>;
            })}
            <span className="ml-1.5 text-[11px] font-semibold text-[#9CA3AF] mt-0.5">{rating.toFixed(1)}</span>
        </span>
    );
}

function Avatar({ name, src }: { name: string; src?: string }) {
    const [imgError, setImgError] = useState(false);
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const Content = (src && !imgError) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={getImageUrl(src)}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full aspect-[4/3] rounded-[10px] object-cover border-[2.5px] border-[#F59E0B]"
        />
    ) : (
        <div
            className="w-full aspect-[4/3] rounded-[10px] bg-gray-100 flex items-center justify-center border-[2.5px] border-[#F59E0B]"
            aria-label={name}
        >
            <span className="text-gray-400 font-bold text-4xl font-display">{initials}</span>
        </div>
    );

    return Content;
}

function SkeletonCard() {
    return (
        <div className="flex flex-col bg-white rounded-[16px] border border-gray-100 p-4 h-auto animate-pulse">
            <div className="w-full aspect-[4/3] rounded-[12px] bg-gray-200 mb-4" />
            <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded-full w-2/3" />
                <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                <div className="h-4 bg-gray-200 rounded-full w-1/3" />
                <div className="h-3 bg-gray-200 rounded-full w-full mt-4" />
                <div className="h-3 bg-gray-200 rounded-full w-4/5" />
            </div>
            <div className="flex gap-2 mt-4 pt-2">
                <div className="h-6 w-16 bg-gray-200 rounded-[20px]" />
                <div className="h-6 w-20 bg-gray-200 rounded-[20px]" />
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

    // We now always render the section to avoid layout shifts or missing sections on transient errors
    // if (!loading && error) return null;

    return (
        <section className="bg-[#FFFDF7] px-[40px] py-[48px] relative z-10 w-full">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-[32px]">
                    <p className="text-[#F59E0B] text-[11px] font-[600] uppercase tracking-[0.12em] mb-[8px]">
                        Verified &amp; Trusted
                    </p>
                    <h2 className="font-['Syne'] text-[28px] font-[800] text-[#1a1a1a] m-0 leading-tight">
                        Top Rated Professionals
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                        : providers.length > 0 && providers.map((p, idx) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.07, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="group relative flex flex-col bg-white rounded-[16px] border border-[#FDE68A] overflow-hidden"
                                >
                                    {/* Photo section */}
                                    <div className="pt-[10px] px-[10px]">
                                        <Avatar name={p.name} src={p.profile_image} />
                                    </div>
                                    
                                    {/* Card Body */}
                                    <div className="pt-[10px] px-[12px] pb-[14px] flex-1 flex flex-col">
                                        {/* Name Row */}
                                        <div className="flex items-center gap-[6px] mb-[6px]">
                                            <h3 className="font-['Syne'] text-[#1a1a1a] font-[700] text-[15px] leading-tight truncate">
                                                {p.name}
                                            </h3>
                                            <div className="flex items-center justify-center w-[15px] h-[15px] rounded-full bg-[#22c55e] flex-shrink-0">
                                                <svg className="w-[9px] h-[9px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                        </div>

                                        {/* Info Rows */}
                                        <div className="flex flex-col gap-[4px] mb-[8px]">
                                            {p.city && (
                                                <div className="flex items-center gap-[4px] text-[11px] text-[#9CA3AF]">
                                                    <svg className="w-[12px] h-[12px] text-pink-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                    <span className="truncate leading-tight mt-0.5">{p.city}</span>
                                                </div>
                                            )}
                                            {p.averageRating != null && (
                                                <div className="flex items-center gap-1">
                                                    <StarRating rating={p.averageRating} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Bio */}
                                        {p.about && (
                                            <p className="text-[#6B7280] text-[11px] leading-[1.5] line-clamp-2 m-0 mt-auto">
                                                {p.about}
                                            </p>
                                        )}

                                        {/* Tags */}
                                        {(() => {
                                            const tags = p.tags || p.services || [];
                                            if (tags.length === 0) return null;
                                            return (
                                                <div className="flex flex-wrap gap-[6px] mt-[10px] pt-[8px] border-t border-gray-50">
                                                    {tags.map((tag: string, i: number) => (
                                                        <span key={i} className="bg-[#FEF3C7] text-[#92400E] text-[11px] px-[10px] py-[4px] rounded-[20px]">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </motion.div>
                            ))
                    }
                </div>
            </div>
        </section>
    );
}
