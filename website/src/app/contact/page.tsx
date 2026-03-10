import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { MapPin, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Have a question? Reach us by email or visit our office.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-[#09090b] font-sans selection:bg-[#D4AF37] selection:text-black pb-0 flex flex-col pt-32 md:pt-40">
            <div className="flex-1 container max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center mb-16 md:mb-24">
                <div className="text-center mb-12 w-full">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[#09090b] mb-4 leading-tight">
                        Contact Us
                    </h1>
                    <p className="text-[#09090b]/60 text-lg md:text-xl leading-relaxed">
                        We&apos;d love to hear from you. Reach us at any of the details below.
                    </p>
                </div>

                <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-8 justify-center">
                    <div className="flex items-start gap-4 p-6 bg-white border border-[#D4AF37]/10 rounded-2xl shadow-sm flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 shadow-sm">
                            <MapPin size={24} className="text-black" />
                        </div>
                        <div>
                            <p className="font-display font-bold text-lg text-black mb-1">Our Office</p>
                            <p className="text-[#09090b]/60 leading-relaxed text-sm">
                                #13, 7th A Cross Road,<br />
                                Gurudarshan Layout, Vidyaranyapura,<br />
                                Bengaluru - 560097
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-white border border-[#D4AF37]/10 rounded-2xl shadow-sm flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 shadow-sm">
                            <Mail size={24} className="text-black" />
                        </div>
                        <div>
                            <p className="font-display font-bold text-lg text-black mb-1">Email Us</p>
                            <a
                                href="mailto:contact@brikuptech.com"
                                className="text-[#09090b]/60 hover:text-[#D4AF37] transition-colors font-medium underline underline-offset-4 decoration-[#D4AF37]/30 break-all text-sm"
                            >
                                contact@brikuptech.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
