import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
            <div className="relative w-full max-w-md h-96 mb-8">
                <Image
                    src="/svg/404 error lost in space-cuate.svg"
                    alt="Lost in Space"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-zinc-900 mb-4">
                Oops! You seem to be lost.
            </h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto text-lg">
                We can't find the page you're looking for. It might have been moved or deleted.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                Go Home
            </Link>
        </div>
    );
}
