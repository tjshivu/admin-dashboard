/**
 * Loading UI
 *
 * Next.js file convention: `loading.tsx` creates a React Suspense boundary
 * that shows a skeleton/loader while the page content is being rendered.
 */
export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-200 border-t-zinc-900" />
                <p className="text-sm text-zinc-400 font-medium">Loading...</p>
            </div>
        </div>
    );
}
