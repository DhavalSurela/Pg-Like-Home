import { CallButton } from "@/components/CTAButtons";
import { Utensils, Coffee, Pizza, Salad } from "lucide-react";

export const metadata = {
    title: "Food Menu - PG Like Home",
    description: "Pure vegetarian, hygienic, and nutritious food served daily at PG Like Home.",
};

export default function Food() {
    const menuHighlights = [
        {
            title: "Breakfast",
            time: "8:00 AM - 9:30 AM",
            items: ["Poha", "Upma", "Thepla", "Ganthiya", "Bread Butter", "Tea/Coffee"],
            icon: Coffee,
        },
        {
            title: "Lunch",
            time: "12:30 PM - 2:00 PM",
            items: ["Roti", "Sabzi (seasonal)", "Dal/Kadhi", "Rice", "Salad", "Buttermilk"],
            icon: Pizza, // Pizza icon as placeholder for Lunch meal
        },
        {
            title: "Dinner",
            time: "8:00 PM - 9:30 PM",
            items: ["Roti/Bhakhri", "Sabzi", "Khichdi-Kadhi", "Milk (on request)"],
            icon: Utensils,
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Hygiene & Taste</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        We believe that good food is essential for good health and better studies. Pure vegetarian meals prepared with love.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {menuHighlights.map((meal, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-blue-50 p-6 flex flex-col items-center border-b border-blue-100">
                                <div className="p-3 bg-white text-blue-600 rounded-full shadow-sm mb-3">
                                    <meal.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{meal.title}</h3>
                                <span className="text-xs text-slate-500 font-medium bg-blue-100 px-2 py-1 rounded-full mt-2">
                                    {meal.time}
                                </span>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-2">
                                    {meal.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-slate-600 text-sm border-b border-slate-50 last:border-0 py-2 first:pt-0">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="mt-16 grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Salad className="text-green-600" />
                            Special Features
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-slate-700">
                                <span className="text-green-500 font-bold">✓</span>
                                Student-decided weekly menu (changes every week)
                            </li>
                            <li className="flex gap-3 text-slate-700">
                                <span className="text-green-500 font-bold">✓</span>
                                Unlimited food (eat as much as you want)
                            </li>
                            <li className="flex gap-3 text-slate-700">
                                <span className="text-green-500 font-bold">✓</span>
                                Sunday Feast: Special meal with Sweet/Farsan
                            </li>
                            <li className="flex gap-3 text-slate-700">
                                <span className="text-green-500 font-bold">✓</span>
                                Milk provided daily
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Kitchen Hygiene</h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            Our kitchen is cleaned twice daily. We use high-quality oil, fresh vegetables, and RO water for cooking. Parents are welcome to inspect our kitchen at any time.
                        </p>
                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                            <strong>Note:</strong> Outside food is allowed. You can order from Zomato/Swiggy if you wish to eat something different.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
