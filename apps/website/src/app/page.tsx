import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';

const HowItWorks = dynamic(() => import('@/components/HowItWorks'), {
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
    </div>
  ),
});

/**
 * HomePage
 *
 * The main entry point for the landing page.
 *
 * Optimization:
 * - `HowItWorks` component is lazy-loaded using `next/dynamic` to reduce the initial JS bundle size.
 * - A skeleton loader is displayed while the component is being fetched.
 */
export default function Home() {
  return (
    <main className="bg-white min-h-screen text-zinc-950 font-sans selection:bg-black selection:text-white">
      <HeroSection />
      <HowItWorks />
      <Footer />
    </main>
  );
}
