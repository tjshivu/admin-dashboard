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


            {/* Contact / Office */}
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-16 md:mb-24">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#09090b] mb-8">
                    Get In Touch
                </h2>
                <div className="bg-[#f9f9f9] rounded-3xl border border-[#D4AF37]/20 p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden group flex flex-col sm:flex-row gap-6 sm:gap-10">
                    <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-[#D4AF37] mt-0.5 shrink-0" />
                        <div className="text-[#09090b]/60 text-sm sm:text-base leading-relaxed">
                            <p className="font-semibold text-white mb-1">Our Office</p>
                            #13, 7th A Cross Road,
                            <br />
                            Gurudarshan Layout, Vidyaranyapura,
                            <br />
                            Bengaluru - 560097
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail size={18} className="text-[#D4AF37] mt-0.5 shrink-0" />
                        <div className="text-white/50 text-sm sm:text-base">
                            <p className="font-semibold text-white mb-1">Email</p>
                            <a
                                href="mailto:contact@brikuptech.com"
                                className="hover:text-[#D4AF37] transition-colors"
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
