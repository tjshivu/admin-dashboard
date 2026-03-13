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
        <main className="min-h-screen bg-[#FFFDF7] text-[#09090b] font-sans pt-28 pb-12 sm:pt-32 sm:pb-16 flex justify-center">
            
            <div className="w-full max-w-5xl flex flex-col gap-[32px] px-[40px] py-[48px] max-[480px]:p-[20px]">
                {/* About Section */}
                <section className="bg-white rounded-[20px] border border-[#FDE68A] p-[28px] sm:px-[32px]">
                    <p className="text-[#F59E0B] text-[11px] font-[600] tracking-[0.12em] uppercase mb-[8px]">
                        Who we are
                    </p>
                    <h1 className="font-['Syne'] text-[26px] font-[800] text-[#1a1a1a] m-0 mb-[16px] leading-none">
                        About <span className="text-[#F59E0B]">BrikUp</span>
                    </h1>
                    <div className="w-[40px] h-[3px] bg-[#F59E0B] rounded-[2px] mb-[16px]" />
                    
                    <p className="text-[#6B7280] text-[14px] leading-[1.8] max-w-[680px] m-0">
                        BrikUp is a platform that helps people <strong className="text-[#1a1a1a]">discover and book trusted local service professionals</strong> through verified profiles and transparent information, making it easier for users to choose the right expert while helping professionals build trust.
                    </p>
                </section>

                {/* Contact Section */}
                <section id="contact" className="bg-white rounded-[20px] border border-[#FDE68A] p-[28px] sm:px-[32px] scroll-mt-32">
                    <p className="text-[#F59E0B] text-[11px] font-[600] tracking-[0.12em] uppercase mb-[8px]">
                        Get in touch
                    </p>
                    <h2 className="font-['Syne'] text-[26px] font-[800] text-[#1a1a1a] m-0 mb-[16px] leading-none">
                        Contact <span className="text-[#F59E0B]">Us</span>
                    </h2>
                    <div className="w-[40px] h-[3px] bg-[#F59E0B] rounded-[2px] mb-[16px]" />
                    
                    <p className="text-[#9CA3AF] text-[14px] m-0">
                        We'd love to hear from you. Reach us at any of the details below.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mt-[20px]">
                        {/* Office Address */}
                        <div className="bg-[#FFFBF2] rounded-[14px] border border-[#FEF3C7] p-[18px] sm:px-[20px] flex items-start gap-[14px]">
                            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                                <MapPin size={18} className="text-[#F59E0B]" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#F59E0B] text-[11px] font-[600] tracking-[0.06em] uppercase mt-0 mb-[6px]">
                                    Our Office
                                </p>
                                <p className="text-[#1a1a1a] text-[13px] font-[500] leading-[1.6] m-0">
                                    #13, 7th A Cross Road,
                                </p>
                                <p className="text-[#6B7280] text-[12px] font-[400] m-0">
                                    Gurudarshan Layout, Vidyaranyapura,
                                </p>
                                <p className="text-[#6B7280] text-[12px] font-[400] m-0">
                                    Bengaluru - 560097
                                </p>
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="bg-[#FFFBF2] rounded-[14px] border border-[#FEF3C7] p-[18px] sm:px-[20px] flex items-start gap-[14px]">
                            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                                <Mail size={18} className="text-[#F59E0B]" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#F59E0B] text-[11px] font-[600] tracking-[0.06em] uppercase mt-0 mb-[6px]">
                                    Email Us
                                </p>
                                <a
                                    href="mailto:contact@brikuptech.com"
                                    className="text-[#1a1a1a] text-[13px] font-[500] leading-[1.6] m-0 hover:text-[#F59E0B] transition-colors decoration-[#F59E0B]/30"
                                >
                                    contact@brikuptech.com
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
