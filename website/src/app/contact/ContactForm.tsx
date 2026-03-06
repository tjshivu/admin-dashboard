'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
        const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || 'Something went wrong.');
                setStatus('error');
                return;
            }

            setStatus('success');
            form.reset();

        } catch {
            setErrorMsg('Network error. Please check your connection.');
            setStatus('error');
        }
    };

    return (
        <div className="relative bg-[#f9f9f9] border border-[#D4AF37]/20 rounded-3xl p-6 sm:p-8 w-full shadow-sm">
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
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
                        <h3 className="font-display text-2xl font-bold text-[#09090b]">Message Sent!</h3>
                        <p className="text-[#09090b]/60 text-sm text-center">
                            We&apos;ll get back to you at {' '}
                            <span className="text-[#D4AF37] font-medium">contact@brikuptech.com</span>
                        </p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-2 text-xs text-[#09090b]/40 hover:text-[#09090b] transition-colors underline underline-offset-2"
                        >
                            Send another message
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#09090b] mb-1">
                            Send a Message
                        </h3>
                        <p className="text-[#09090b]/50 text-xs sm:text-sm mb-5 font-light leading-relaxed">
                            Fill out the form and we&apos;ll be in touch.
                        </p>

                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4"
                            >
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{errorMsg}</span>
                            </motion.div>
                        )}

                        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your name"
                                required
                                disabled={status === 'loading'}
                                className="bg-white border border-[#e4e4e7] rounded-xl px-4 py-3 text-sm text-[#09090b] placeholder:text-[#09090b]/30 outline-none focus:border-[#D4AF37]/50 transition-colors w-full disabled:opacity-50"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                required
                                disabled={status === 'loading'}
                                className="bg-white border border-[#e4e4e7] rounded-xl px-4 py-3 text-sm text-[#09090b] placeholder:text-[#09090b]/30 outline-none focus:border-[#D4AF37]/50 transition-colors w-full disabled:opacity-50"
                            />
                            <textarea
                                name="message"
                                placeholder="Your message"
                                rows={4}
                                required
                                disabled={status === 'loading'}
                                className="bg-white border border-[#e4e4e7] rounded-xl px-4 py-3 text-sm text-[#09090b] placeholder:text-[#09090b]/30 outline-none focus:border-[#D4AF37]/50 transition-colors w-full resize-none disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-[#D4AF37] text-black rounded-xl px-5 py-3 text-sm font-semibold hover:bg-[#c9a227] transition-colors flex items-center justify-center gap-2 w-full mt-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black/20 border-t-black" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={14} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
