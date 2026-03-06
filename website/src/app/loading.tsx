export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#e4e4e7] border-t-[#D4AF37]" />
                <p className="text-sm text-[#09090b]/50 font-medium">Loading...</p>
            </div>
        </div>
    );
}
