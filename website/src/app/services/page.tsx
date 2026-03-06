'use client';

import Footer from '@/components/Footer';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';

const serviceCategories = [
    {
        title: "Men's Salon",
        services: [
            "Haircut",
            "Beard Trim / Beard Styling",
            "Hair Coloring",
            "Hair Treatment",
            "Facial / Cleanup",
            "Head Massage"
        ]
    },
    {
        title: "Women's Salon",
        services: [
            "Haircut & Styling",
            "Hair Coloring",
            "Hair Spa / Treatments",
            "Facial / Cleanup",
            "Waxing",
            "Threading",
            "Bleach / Detan"
        ]
    },
    {
        title: "Bridal & Makeup",
        services: [
            "Bridal Makeup",
            "Engagement Makeup",
            "Party Makeup",
            "Hairstyling",
            "Saree Draping",
            "Groom Makeup"
        ]
    },
    {
        title: "Tattoo",
        services: [
            "Permanent Tattoo",
            "Temporary Tattoo",
            "Tattoo Cover-up",
            "Tattoo Removal (laser)",
            "Tattoo Design Consultation"
        ]
    }
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-white text-[#09090b] font-sans selection:bg-[#D4AF37] selection:text-black pb-0">
            {/* Hero Header Space */}
            <div className="pt-24 pb-12 md:pt-32 md:pb-16 px-6 text-center max-w-4xl mx-auto">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-[#09090b]">
                    Our Services
                </h1>
            </div>

            {/* Services Grid */}
            <div className="container max-w-6xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {serviceCategories.map((category, idx) => (
                        <div key={idx} className="flex flex-col">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b border-[#D4AF37]/30 pb-2 text-[#D4AF37]">
                                {category.title}
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {category.services.map((service, sIdx) => (
                                    <div
                                        key={sIdx}
                                        className="px-4 py-2 rounded-full border border-[#D4AF37]/60 text-sm md:text-base font-medium whitespace-nowrap bg-[#f9f9f9] backdrop-blur-sm shadow-sm"
                                    >
                                        <AnimatedShinyText className="text-[#09090b]/60">
                                            {service}
                                        </AnimatedShinyText>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
