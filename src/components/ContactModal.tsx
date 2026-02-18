'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, CheckCircle } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => {
            setSent(false);
            onClose();
        }, 2000);
    };

    const handleClose = () => {
        setSent(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl shadow-black/40"
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <AnimatePresence mode="wait">
                            {sent ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center justify-center py-10 gap-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                                    >
                                        <CheckCircle size={56} className="text-emerald-400" />
                                    </motion.div>
                                    <h3 className="font-display text-2xl font-bold text-white">Sent!</h3>
                                    <p className="text-zinc-400 text-sm text-center">We&apos;ll get back to you shortly.</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">Contact Us</h3>
                                    <p className="text-zinc-500 text-xs sm:text-sm mb-5 font-light leading-relaxed">
                                        Have a question? Drop us a message.
                                    </p>
                                    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            required
                                            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/30 transition-colors w-full"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            required
                                            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/30 transition-colors w-full"
                                        />
                                        <textarea
                                            placeholder="Your message"
                                            rows={3}
                                            required
                                            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/30 transition-colors w-full resize-none"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-white text-black rounded-xl px-5 py-3 text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 w-full mt-1 active:scale-[0.98]"
                                        >
                                            <Send size={14} />
                                            Send Message
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
