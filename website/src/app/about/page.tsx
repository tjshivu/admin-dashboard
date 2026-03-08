import type { Metadata } from "next";

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
        <main className="bg-white min-h-screen text-[#09090b] font-sans pt-28 md:pt-32">
            {/* Hero Banner */}
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-12 md:mb-16">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4">
                    About BrikUp
                </h1>
                <p className="text-[#09090b]/60 text-sm sm:text-base max-w-4xl leading-relaxed text-justify">
                    BrikUp is a platform that helps people discover and book trusted local service professionals through verified profiles and transparent information, making it easier for users to choose the right expert while helping professionals build trust.
                </p>
            </section>


        </main>
    );
}
