import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Users, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about BrikUp — the platform connecting you with trusted local service professionals in Bengaluru.",
};

/**
 * About Us Page
 *
 * A clean, basic page with company story, mission, values, and contact info.
 * Designed to be updated later with more details.
 */
export default function AboutPage() {
    return (
        <main className="bg-white min-h-screen text-zinc-950 font-sans pt-28 md:pt-32">
            {/* Hero Banner */}
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-16 md:mb-24">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4 md:mb-6">
                    About BrikUp
                </h1>
                <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
                    We&apos;re building the easiest way for people to find, compare, and
                    hire trusted local professionals — starting right here in Bengaluru.
                </p>
            </section>

            {/* Our Story - uncomment when ready
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-16 md:mb-24">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
                    Our Story
                </h2>
                <div className="bg-zinc-50 rounded-3xl border border-zinc-100 p-6 sm:p-8 md:p-10">
                    <p className="text-zinc-600 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
                        BrikUp was born from a simple frustration — finding a reliable
                        plumber, electrician, or home cleaner in Bengaluru shouldn&apos;t
                        require calling ten people and hoping for the best.
                    </p>
                    <p className="text-zinc-600 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
                        We set out to build a platform where every service professional is
                        verified, every review is authentic, and every interaction is backed
                        by community trust. No runarounds, no guesswork — just expert help
                        when you need it.
                    </p>
                    <p className="text-zinc-600 text-sm sm:text-base md:text-lg leading-relaxed">
                        Today, BrikUp connects thousands of homeowners with top-rated pros
                        across dozens of service categories, and we&apos;re just getting started.
                    </p>
                </div>
            </section>
            */}

            {/* Values */}
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-16 md:mb-24">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-8">
                    What We Stand For
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    {[
                        {
                            icon: Shield,
                            title: "Trust & Safety",
                            desc: "Every professional on our platform is background-checked and trade-verified.",
                        },
                        {
                            icon: Users,
                            title: "Community First",
                            desc: "We believe the best recommendations come from your neighbors and community.",
                        },
                        {
                            icon: Heart,
                            title: "Quality Service",
                            desc: "We hold every interaction to the highest standard so you get the job done right.",
                        },
                    ].map((value) => (
                        <div
                            key={value.title}
                            className="bg-zinc-50 rounded-2xl border border-zinc-100 p-5 sm:p-6 md:p-8 flex flex-col items-start"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-4">
                                <value.icon size={20} className="text-white" />
                            </div>
                            <h3 className="font-display font-bold text-base sm:text-lg md:text-xl mb-2">
                                {value.title}
                            </h3>
                            <p className="text-zinc-500 text-xs sm:text-sm md:text-base leading-relaxed">
                                {value.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact / Office */}
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-16 md:mb-24">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-8">
                    Get In Touch
                </h2>
                <div className="bg-zinc-50 rounded-3xl border border-zinc-100 p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row gap-6 sm:gap-10">
                    <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-zinc-400 mt-0.5 shrink-0" />
                        <div className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                            <p className="font-semibold text-zinc-900 mb-1">Our Office</p>
                            #13, 7th A Cross Road,
                            <br />
                            Gurudarshan Layout, Vidyaranyapura,
                            <br />
                            Bengaluru - 560097
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail size={18} className="text-zinc-400 mt-0.5 shrink-0" />
                        <div className="text-zinc-600 text-sm sm:text-base">
                            <p className="font-semibold text-zinc-900 mb-1">Email</p>
                            <a
                                href="mailto:contact@brikuptech.com"
                                className="hover:text-zinc-900 transition-colors"
                            >
                                contact@brikuptech.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-16 md:mb-24 text-center">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
                    Ready to find your pro?
                </h2>
                <p className="text-zinc-500 text-sm sm:text-base md:text-lg mb-6 max-w-lg mx-auto">
                    Join thousands of happy homeowners who trust BrikUp to get the job done.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors shadow-lg"
                >
                    Explore Services
                </Link>
            </section>
        </main>
    );
}
