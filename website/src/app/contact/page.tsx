import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Have a question? Drop us a message.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground pb-0 flex flex-col pt-32 md:pt-40">
            <div className="flex-1 container max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center mb-16 md:mb-24">
                <div className="text-center mb-10 w-full">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                        Contact Us
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                        Have a question? We&apos;d love to hear from you. Drop us a message below.
                    </p>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <ContactForm />
                </div>
            </div>
            <Footer />
        </main>
    );
}
