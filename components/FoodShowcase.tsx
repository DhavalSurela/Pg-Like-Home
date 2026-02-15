"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface FoodShowcaseProps {
    breakfastImages: string[];
    lunchDinnerImages: string[];
    festivalImages: string[];
    fastFoodImages: string[];
}

export function FoodShowcase({
    breakfastImages,
    lunchDinnerImages,
    festivalImages,
    fastFoodImages
}: FoodShowcaseProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Set index based on current hour to rotate images hourly
        const hour = new Date().getHours();
        setCurrentIndex(hour);
    }, []);

    // Helper to get image at current index (looping if index > length)
    const getImage = (images: string[]) => {
        if (!images || images.length === 0) return null;
        return images[currentIndex % images.length];
    };

    const categories = [
        { name: "Breakfast", image: getImage(breakfastImages) },
        { name: "Lunch & Dinner", image: getImage(lunchDinnerImages) },
        { name: "Festival Special", image: getImage(festivalImages) },
        { name: "Fast Food", image: getImage(fastFoodImages) },
    ];

    return (
        <section className="py-12 bg-brand-cream border-b border-brand-orange/10">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Freshly Prepared Meals</h2>
                    <Link href="/food" className="text-brand-orange font-semibold hover:text-orange-700 transition-colors text-sm flex items-center gap-1">
                        View Full Menu <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group bg-slate-200">
                            {cat.image ? (
                                <>
                                    <Image
                                        src={cat.image}
                                        alt={`Delicious ${cat.name}`}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <p className="text-white font-medium text-sm">{cat.name}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 flex-col gap-2">
                                    <span className="text-xs font-medium">Coming Soon</span>
                                    <span className="text-xs opacity-70">{cat.name}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
