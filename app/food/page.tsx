import { CallButton } from "@/components/CTAButtons";
import { Utensils, Clock, AlertCircle, Salad, CheckCircle2, Coffee, Pizza } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Food Menu - PG Like Home",
    description: "Pure vegetarian, hygienic, and nutritious food served daily at PG Like Home.",
};

export default function Food() {
    const weeklyMenu = [
        {
            day: "Monday",
            breakfast: "Thepla / Ganthiya",
            lunch: "Kadhi",
            dinner: "Kobi Bateta / Choli Bateta / Choli"
        },
        {
            day: "Tuesday",
            breakfast: "Bhakri",
            lunch: "Green Sabzi (Seasonal)",
            dinner: "Ringan Bateta / Papdi Bateta / Flower Bateta"
        },
        {
            day: "Wednesday",
            breakfast: "Bateta Poha / Vaghareli Roti",
            lunch: "Kadhi",
            dinner: "Fast Food"
        },
        {
            day: "Thursday",
            breakfast: "Pav Khari / Biscuit / Sev Mamra",
            lunch: "Mix Sabzi",
            dinner: "Sukibhaji - Roti"
        },
        {
            day: "Friday",
            breakfast: "Handvo / Dhokla",
            lunch: "Tindora Bateta / Kobi Bateta / Flower Bateta",
            dinner: "Sev Tameta Parotha"
        },
        {
            day: "Saturday",
            breakfast: "Sev Khamani / Masala Bhakri",
            lunch: "Kadhi",
            dinner: "Kadhi Khichdi / Pulao"
        },
        {
            day: "Sunday",
            breakfast: "Pav Khari / Biscuit / Sev Mamra",
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
    ];

    return (
        <div className="bg-brand-cream min-h-screen pb-20">
            <div className="bg-brand-dark text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Hygiene & Taste</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        We believe that good food is essential for good health and better studies. Pure vegetarian meals prepared with love.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">

                {/* Weekly Menu Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
                        <Utensils className="text-brand-orange" />
                        Weekly Time Table
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {weeklyMenu.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
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
                <div className="mt-16 grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Salad className="text-brand-green" />
                            Special Features
                        </h3>
                        <div className="space-y-4">
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

                    <div className="bg-white p-8 rounded-2xl border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Kitchen Hygiene</h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            Our kitchen is cleaned twice daily. We use high-quality oil, fresh vegetables, and RO water for cooking. Parents are welcome to inspect our kitchen at any time.
                        </p>
                        <div className="p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-lg text-sm text-brand-dark">
                            <strong>Note:</strong> Outside food is allowed. You can order from Zomato/Swiggy if you wish to eat something different.
                        </div>
                    </div>
                </div>

                {/* Food Gallery */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Our Delicious Meals</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {Array.from({ length: 33 }, (_, i) => i + 1).map((num) => (
                            <div key={num} className="relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group bg-slate-200">
                                <Image
                                    src={`/images/food/food-${num}.jpg`}
                                    alt={`Delicious food at PG Like Home ${num}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={num <= 6}
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
