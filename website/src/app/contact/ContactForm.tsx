'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => {
            setSent(false);
        }, 3000);
    };

    return (
        <div className="relative bg-[#f9f9f9] border border-[#D4AF37]/20 rounded-3xl p-6 sm:p-8 w-full shadow-2xl shadow-black/40">
            <AnimatePresence mode="wait">
                {sent ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-10 gap-4 min-h-[300px]"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                        >
                            <CheckCircle size={56} className="text-[#D4AF37]" />
                        </motion.div>
                        <h3 className="font-display text-2xl font-bold text-[#09090b]">Sent!</h3>
                        <p className="text-[#09090b]/50 text-sm text-center">We&apos;ll get back to you shortly.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#09090b] mb-1">Send a Message</h3>
                        <p className="text-[#09090b]/50 text-xs sm:text-sm mb-5 font-light leading-relaxed">
                            Fill out the form and we&apos;ll be in touch.
                        </p>
                        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your name"
                                required
                                className="bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#09090b] placeholder:text-[#09090b]/30 outline-none focus:border-[#D4AF37]/50 transition-colors w-full"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                required
                                className="bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#09090b] placeholder:text-[#09090b]/30 outline-none focus:border-[#D4AF37]/50 transition-colors w-full"
                            />
                            <textarea
                                name="message"
                                placeholder="Your message"
                                rows={4}
                                required
                                className="bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#09090b] placeholder:text-[#09090b]/30 outline-none focus:border-[#D4AF37]/50 transition-colors w-full resize-none"
                            />
                            <button
                                type="submit"
                                className="bg-[#D4AF37] text-black rounded-xl px-5 py-3 text-sm font-semibold hover:bg-[#c9a227] transition-colors flex items-center justify-center gap-2 w-full mt-2 active:scale-[0.98]"
                            >
                                <Send size={14} />
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
