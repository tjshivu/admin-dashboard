import type { Metadata } from 'next';
import { MapPin, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Have a question? Reach us by email or visit our office.',
};

export default function ContactPage() {
    return (
        <main className="bg-white min-h-screen text-[#09090b] font-sans pt-28 md:pt-32">
            <section className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 mb-12 md:mb-16">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4">
                    Contact Us
                </h1>
                <p className="text-[#09090b]/60 text-sm sm:text-base max-w-4xl leading-relaxed text-justify mb-8">
                    We'd love to hear from you. Reach us at any of the details below.
                </p>

                <div className="w-full max-w-xl p-6 bg-white border border-[#D4AF37]/10 rounded-2xl shadow-clean-md space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 shadow-clean-sm">
                            <MapPin size={18} className="text-[#09090b]" />
                        </div>
                        <div>
                            <p className="font-display font-semibold text-sm sm:text-base text-[#09090b] mb-1">Our Office</p>
                            <p className="text-[#09090b]/60 leading-relaxed text-xs sm:text-sm">
                                #13, 7th A Cross Road,<br />
                                Gurudarshan Layout, Vidyaranyapura,<br />
                                Bengaluru - 560097
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 shadow-clean-sm">
                            <Mail size={18} className="text-[#09090b]" />
                        </div>
                        <div>
                            <p className="font-display font-semibold text-sm sm:text-base text-[#09090b] mb-1">Email Us</p>
                            <a
                                href="mailto:contact@brikuptech.com"
                                className="text-[#09090b]/60 hover:text-[#D4AF37] transition-colors font-medium underline underline-offset-4 decoration-[#D4AF37]/30 break-all text-xs sm:text-sm"
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
