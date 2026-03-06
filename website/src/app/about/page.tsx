import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail } from "lucide-react";

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
        <main className="bg-background min-h-screen text-foreground font-sans pt-28 md:pt-32">
            {/* Hero Banner */}
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-12 md:mb-16">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4">
                    About BrikUp
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base max-w-4xl leading-relaxed text-justify">
                    BrikUp is a platform that helps people discover and book trusted local service professionals through verified profiles and transparent information, making it easier for users to choose the right expert while helping professionals build trust.
                </p>
            </section>

            {/* Our Story - uncomment when ready
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-16 md:mb-24">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                    Our Story
                </h2>
                <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 md:p-10">
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mb-4">
                        We started with a simple belief — finding a reliable
                        salon stylist, makeup artist, or tattoo creative shouldn&apos;t
                        involve endless scrolling and hoping for the best. You deserve
                        a seamless, trusted booking journey from discovery to the final result.
                    </p>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mb-4">
                        We set out to build a platform where every service professional is
                        verified, every portfolio is authentic, and every interaction is backed
                        by community trust. No runarounds, no guesswork — just expert artists
                        ready to bring your vision to life.
                    </p>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                        Today, we connect individuals with top-rated local professionals
                        across key creative services, empowering people to book with absolute confidence.
                    </p>
                </div>
            </section>
            */}

            {/* Values */}
            {/* Contact / Office */}
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-16 md:mb-24">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8">
                    Get In Touch
                </h2>
                <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row gap-6 sm:gap-10">
                    <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            <p className="font-semibold text-foreground mb-1">Our Office</p>
                            #13, 7th A Cross Road,
                            <br />
                            Gurudarshan Layout, Vidyaranyapura,
                            <br />
                            Bengaluru - 560097
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div className="text-muted-foreground text-sm sm:text-base">
                            <p className="font-semibold text-foreground mb-1">Email</p>
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
        </main>
    );
}
