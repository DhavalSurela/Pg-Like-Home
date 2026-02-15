import { CallButton, WhatsAppButton, InstagramButton } from "@/components/CTAButtons";
import { Wifi, Utensils, Droplets, Zap, Shirt, Video, ShieldCheck, Warehouse, Coffee, LampDesk } from "lucide-react";

export const metadata = {
    title: "Facilities - PG Like Home",
    description: "Check out the premium facilities at PG Like Home: Wi-Fi, Food, Laundry, and more.",
};

export default function Facilities() {
    const facilities = [
        { icon: Utensils, label: "Pure Veg Food", desc: "Nutritious home-cooked meals 3 times a day." },
        { icon: Wifi, label: "High-Speed Wi-Fi", desc: "Unlimited internet for your studies and work." },
        { icon: Shirt, label: "Laundry", desc: "Washing machine facility available for residents." },
        { icon: Droplets, label: "RO Water", desc: "Chilled and purified drinking water 24x7." },
        { icon: ShieldCheck, label: "Housekeeping", desc: "Daily cleaning of rooms and washrooms." },
        { icon: Zap, label: "Power Backup", desc: "Inverter backup for uninterrupted power." },
        { icon: Video, label: "CCTV Surveillance", desc: "24x7 security monitoring for your safety." },
        { icon: Warehouse, label: "Cupboard & Locker", desc: "Personal storage space with lock." },
        { icon: LampDesk, label: "Study Table", desc: "Dedicated study chair and table in rooms." },
        { icon: Coffee, label: "Dining Area", desc: "Common dining space with TV." },
    ];

    return (
        <div className="bg-brand-cream min-h-screen pb-20">
            <div className="bg-brand-primary text-white py-16">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Premium Facilities</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        Everything you need for a comfortable stay. No extra charges.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {facilities.map((f, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 bg-brand-cream text-brand-blue rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <f.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{f.label}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 border border-slate-200">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">Why choose PG Like Home?</h2>
                        <p className="text-slate-600">
                            Unlike other PGs, we don't just provide a bed. We provide an ecosystem where you can focus on your career while we take care of your daily needs. Our facilities are maintained daily to ensure high standards of hygiene and comfort.
                        </p>
                        <div className="pt-4">
                            <div className="pt-4 flex flex-wrap justify-center gap-4">
                                <CallButton size="lg" />
                                <WhatsAppButton size="lg" />
                                <InstagramButton size="lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
