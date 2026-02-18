import type { Metadata } from "next";
import { CallButton } from "@/components/CTAButtons";
import { Utensils, Clock, AlertCircle, Salad, CheckCircle2, Coffee, Pizza, PartyPopper, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { ImageSlider } from "@/components/ImageSlider";

export const metadata: Metadata = {
    title: "Food Menu - Pure Veg Meals at PG Like Home",
    description:
        "Enjoy unlimited pure vegetarian breakfast, lunch & dinner at PG Like Home, Memnagar. Student-decided weekly menu, festival specials, fast food days & daily buttermilk. Hygienic kitchen with RO water cooking.",
    keywords: ["PG food Ahmedabad", "veg food hostel Memnagar", "PG with meals", "student food menu", "unlimited food PG"],
    alternates: {
        canonical: "https://pg-like-home.vercel.app/food",
    },
    openGraph: {
        title: "Food Menu - Pure Veg Meals Daily | PG Like Home",
        description: "Unlimited pure veg breakfast, lunch & dinner. Student-decided menus, festival specials & hygienic kitchen.",
        url: "https://pg-like-home.vercel.app/food",
    },
};

// Helper function to get images from a directory
function getImages(category: string): string[] {
    const dirPath = path.join(process.cwd(), "public", "images", "food", category);

    try {
        if (!fs.existsSync(dirPath)) {
            return [];
        }

        const files = fs.readdirSync(dirPath);
        return files
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .map(file => `/images/food/${category}/${file}`);
    } catch (error) {
        console.error(`Error reading directory ${category}:`, error);
        return [];
    }
}

export default function Food() {
    const weeklyMenu = [
        {
            day: "Monday",
            breakfast: "Thepla / Ganthiya",
            lunch: "Chana Sabzi",
            dinner: "Olo Rotlo"
        },
        {
            day: "Tuesday",
            breakfast: "Bhakhri",
            lunch: "Kobi Bateta",
            dinner: "Sev Tameta Parotha/Bhakhari"
        },
        {
            day: "Wednesday",
            breakfast: "Bateta Poha",
            lunch: "Mag Sabzi",
            dinner: "Fast Food"
        },
        {
            day: "Thursday",
            breakfast: "Handvo",
            lunch: "Mix Sabzi",
            dinner: "Bhaji - Roti"
        },
        {
            day: "Friday",
            breakfast: "Sev Khamani",
            lunch: "Guvar Bateta",
            dinner: "Our Choice"
        },
        {
            day: "Saturday",
            breakfast: "Idli",
            lunch: "Chhole",
            dinner: "Pulao Bateta"
        },
        {
            day: "Sunday",
            breakfast: "Pav Khari / Biscuit",
            lunch: "Punjabi / Sweet",
            dinner: "Closed"
        }
    ];

    const features = [
        {
            title: "Student-decided weekly menu",
            desc: "Our menu changes every week based on student preferences.",
        },
        {
            title: "Unlimited food",
            desc: "Eat as much as you want, ensuring you're always satisfied.",
        },
        {
            title: "Sunday Feast",
            desc: "Special meal with Sweet/Farsan every Sunday.",
        },
        {
            title: "Buttermilk provided daily",
            desc: "Fresh Buttermilk available daily for all residents.",
        },
        {
            title: "Kitchen Hygiene",
            desc: "Our kitchen is cleaned twice daily. We use high-quality oil, fresh vegetables, and RO water for cooking. Parents are welcome to inspect our kitchen at any time.",
        },
    ];

    // Get images for each category
    const breakfastImages = getImages("breakfast");
    const lunchDinnerImages = getImages("lunch-dinner");
    const festivalImages = getImages("festival-food");
    const fastFoodImages = getImages("fastfood");

    return (
        <div className="bg-brand-cream min-h-screen pb-20">
            <div className="bg-brand-teal text-white py-16">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Hygiene & Taste</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        We believe that good food is essential for good health and better studies. Pure vegetarian meals prepared with love.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 mt-12">

                {/* Weekly Menu Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
                        <Utensils className="text-brand-orange" />
                        Weekly Time Table
                    </h2>
                    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 pb-8 md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {weeklyMenu.map((item, index) => (
                            <div key={index} className="min-w-[85vw] sm:min-w-[300px] md:min-w-0 snap-center bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="bg-brand-orange/10 p-4 border-b border-brand-orange/20 text-center">
                                    <h3 className="font-bold text-brand-dark text-lg">{item.day}</h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Breakfast</p>
                                        <p className="text-slate-700 font-medium text-sm">{item.breakfast}</p>
                                    </div>
                                    <div className="border-t border-slate-50 pt-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Lunch</p>
                                        <p className="text-slate-700 font-medium text-sm">{item.lunch}</p>
                                    </div>
                                    <div className="border-t border-slate-50 pt-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dinner</p>
                                        <p className="text-slate-700 font-medium text-sm">{item.dinner}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features */}
                <div className="mt-16 bg-white p-8 rounded-2xl border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">
                        Special Features
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green shrink-0 mt-1">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{feature.title}</h3>
                                    <p className="text-slate-600 text-sm mt-1">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Food Categories Sliders */}
                <div className="mt-20 space-y-20">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Delicious Meals</h2>

                    {/* Breakfast */}
                    <div id="breakfast" className="space-y-4 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                                <Coffee className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Breakfast</h3>
                        </div>
                        <ImageSlider images={breakfastImages} category="Breakfast" />
                    </div>

                    {/* Lunch & Dinner */}
                    <div id="lunch-dinner" className="space-y-4 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                                <UtensilsCrossed className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Lunch & Dinner</h3>
                        </div>
                        <ImageSlider images={lunchDinnerImages} category="Lunch & Dinner" />
                    </div>

                    {/* Festival Food */}
                    <div id="festival-food" className="space-y-4 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                                <PartyPopper className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Festival Day Food</h3>
                        </div>
                        <ImageSlider images={festivalImages} category="Festival Food" />
                    </div>

                    {/* Fast Food */}
                    <div id="fast-food" className="space-y-4 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg text-red-700">
                                <Pizza className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Fast Food</h3>
                        </div>
                        <ImageSlider images={fastFoodImages} category="Fast Food" />
                    </div>
                </div>
            </div>
        </div>
    );
}
