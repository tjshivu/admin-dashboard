'use client';

const serviceCategories = [
    {
        title: "Men's Salon",
        services: [
            "Haircut",
            "Beard Styling",
            "Hair Coloring",
            "Hair Treatment",
            "Facial",
            "Head Massage"
        ]
    },
    {
        title: "Women's Salon",
        services: [
            "Haircut & Styling",
            "Hair Coloring",
            "Hair Spa",
            "Facial",
            "Waxing",
            "Threading",
            "Detan"
        ]
    },
    {
        title: "Bridal & Makeup",
        services: [
            "Bridal Makeup",
            "Engagement Makeup",
            "Party Makeup",
            "Hairstyling",
            "Saree Draping",
            "Groom Makeup"
        ]
    },
    {
        title: "Tattoo",
        services: [
            "Permanent Tattoo",
            "Temporary Tattoo",
            "Tattoo Cover-up",
            "Tattoo Removal",
            "Tattoo Design Consultation"
        ]
    }
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-[#FFFDF7] text-[#09090b] font-sans pb-12 flex justify-center pt-28 md:pt-32">
            
            <div className="w-full max-w-5xl flex flex-col gap-[32px] px-[40px] py-[48px] max-[480px]:p-[20px]">
                
                {/* Page header */}
                <section>
                    <p className="text-[#F59E0B] text-[11px] font-[600] tracking-[0.12em] uppercase mb-[8px] m-0">
                        What we offer
                    </p>
                    <h1 className="font-['Syne'] text-[36px] font-[800] text-[#1a1a1a] m-0 leading-none">
                        Our <span className="text-[#F59E0B]">Services</span>
                    </h1>
                    <p className="text-[#9CA3AF] text-[14px] leading-[1.6] mt-[6px] mb-0 max-w-2xl">
                        Browse all services available on BrikUp, connect with verified professionals near you.
                    </p>
                    <div className="w-[40px] h-[3px] bg-[#F59E0B] rounded-[2px] mt-[12px] mb-0" />
                </section>

                {/* Services grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                    {serviceCategories.map((category, idx) => (
                        <div key={idx} className="bg-white rounded-[20px] border border-[#FDE68A] py-[20px] px-[22px] flex flex-col">
                            {/* Card header */}
                            <div className="flex items-center gap-[10px] pb-[14px] border-b border-[#FEF3C7] mb-[14px]">
                                <div className="flex flex-col">
                                    <h2 className="font-['Syne'] text-[17px] font-[800] text-[#1a1a1a] m-0 leading-tight">
                                        {category.title}
                                    </h2>
                                    <p className="text-[#9CA3AF] text-[11px] m-0 mt-[2px] leading-none">
                                        {category.services.length} Services
                                    </p>
                                </div>
                            </div>
                            
                            {/* Service pills */}
                            <div className="flex flex-wrap gap-[8px]">
                                {category.services.map((service, sIdx) => (
                                    <div
                                        key={sIdx}
                                        className="bg-[#FFFBF2] border border-[#FDE68A] text-[#1a1a1a] text-[12px] font-[500] px-[14px] py-[6px] rounded-[40px] hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B] transition-all duration-150 cursor-pointer"
                                    >
                                        {service}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}
