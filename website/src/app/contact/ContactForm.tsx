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
        <div className="relative bg-primary border border-border rounded-3xl p-6 sm:p-8 w-full shadow-2xl shadow-zinc-950/20">
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
                            <CheckCircle size={56} className="text-emerald-400" />
                        </motion.div>
                        <h3 className="font-display text-2xl font-bold text-primary-foreground">Sent!</h3>
                        <p className="text-muted-foreground text-sm text-center">We&apos;ll get back to you shortly.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Send a Message</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-5 font-light leading-relaxed">
                            Fill out the form and we&apos;ll be in touch.
                        </p>
                        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Your name"
                                required
                                className="bg-primary border border-border rounded-xl px-4 py-3 text-sm text-primary-foreground placeholder:text-zinc-600 outline-none focus:border-white/30 transition-colors w-full"
                            />
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                className="bg-primary border border-border rounded-xl px-4 py-3 text-sm text-primary-foreground placeholder:text-zinc-600 outline-none focus:border-white/30 transition-colors w-full"
                            />
                            <textarea
                                placeholder="Your message"
                                rows={4}
                                required
                                className="bg-primary border border-border rounded-xl px-4 py-3 text-sm text-primary-foreground placeholder:text-zinc-600 outline-none focus:border-white/30 transition-colors w-full resize-none"
                            />
                            <button
                                type="submit"
                                className="bg-background text-foreground rounded-xl px-5 py-3 text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 w-full mt-2 active:scale-[0.98]"
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
