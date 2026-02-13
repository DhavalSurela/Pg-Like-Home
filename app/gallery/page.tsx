import { CallButton } from "@/components/CTAButtons";
import Image from "next/image";

export const metadata = {
    title: "Photo Gallery - PG Like Home",
    description: "View photos of our rooms, dining area, kitchen, and facilities.",
};

export default function Gallery() {
    const images = [
        { src: "https://images.unsplash.com/photo-1555854743-e3c2f6a5fc6e?q=80&w=800&auto=format&fit=crop", category: "Rooms", alt: "Spacious AC Room" },
        { src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop", category: "Rooms", alt: "Study setup" },
        { src: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=800&auto=format&fit=crop", category: "Common Area", alt: "Common Hall" },
        { src: "https://images.unsplash.com/photo-1595405494493-27c9e504c5e3?q=80&w=800&auto=format&fit=crop", category: "Rooms", alt: "Comfortable Bedding" },
        { src: "https://images.unsplash.com/photo-1565514020176-db792f4b6d80?q=80&w=800&auto=format&fit=crop", category: "Dining", alt: "Dining Area" },
        { src: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop", category: "Building", alt: "Front View" },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Gallery</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        Take a sneak peek into your future home. Real photos of our facilities.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all border border-slate-100 aspect-[4/3]">
                            {/* Using normal img tag for simplicity in this demo, but next/image should be used for production with local assets */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${img.src})` }}
                                role="img"
                                aria-label={img.alt}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <div>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{img.category}</span>
                                    <h3 className="text-white font-bold text-lg">{img.alt}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Want to see it in person?</h2>
                    <CallButton size="lg" />
                </div>
            </div>
        </div>
    );
}
