import type { Metadata } from "next";
import { CallButton, WhatsAppButton, InstagramButton } from "@/components/CTAButtons";
import { RoomCard } from "@/components/RoomCard";
import { Info, Utensils, Shield, Droplets, Gamepad2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const inr = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

// Used when the database has no pricing rows yet (or is unreachable), so the
// page always renders the original plans.
const fallbackRooms = [
    {
        title: "Multi Sharing",
        subtitle: "Non AC Hall",
        price: "₹9,000",
        tag: "Budget",
        description: "Great for building friendships and keeping costs low.",
        features: ["Bed & Mattress", "Study Table", "Shared Washroom", "Fan & Lights"],
        recommended: false,
    },
    {
        title: "3 Sharing",
        subtitle: "Non AC Room",
        price: "₹10,000",
        tag: "Standard",
        description: "A balanced mix of social living and personal comfort.",
        features: ["Personal Cupboard", "Study Table", "Attached Washroom", "Fan & Lights"],
        recommended: true,
    },
    {
        title: "3 Sharing",
        subtitle: "AC Room",
        price: "₹11,000",
        tag: "Premium",
        description: "Cool comfort with shared amenities.",
        features: ["Air Conditioner", "Personal Cupboard", "Study Table", "Attached Washroom"],
        recommended: false,
    },
    {
        title: "2 Sharing",
        subtitle: "AC Room",
        price: "₹14,500",
        tag: "Elite",
        description: "More space and privacy with premium comfort.",
        features: ["Air Conditioner", "Premium Bedding", "Spacious Cupboard", "Attached Washroom"],
        recommended: false,
    },
    {
        title: "1 Sharing",
        subtitle: "AC Room",
        price: "₹20,000",
        tag: "Luxury",
        description: "Private room for those who prefer complete solitude and focus.",
        features: ["Air Conditioner", "Private Room", "Dedicated Workspace", "Private Washroom"],
        recommended: false,
    },
];

export const metadata: Metadata = {
    title: "Rooms & Pricing - AC/Non-AC PG Rooms from ₹9,000",
    description:
        "Transparent PG room pricing in Memnagar, Ahmedabad. Multi-sharing from ₹9,000, 3-sharing non-AC ₹10,000, 3-sharing AC ₹11,000, 2-sharing AC ₹14,500 & single AC ₹20,000/month. Food, Wi-Fi & housekeeping included.",
    keywords: ["PG room price Ahmedabad", "AC room PG Memnagar", "cheap PG Ahmedabad", "PG rent near Gujarat University", "affordable hostel Ahmedabad"],
    alternates: {
        canonical: "https://pglikehome.vercel.app/rooms",
    },
    openGraph: {
        title: "Rooms & Pricing - PG Like Home, Memnagar",
        description: "AC/Non-AC rooms from ₹9,000/month with food included. No hidden charges.",
        url: "https://pglikehome.vercel.app/rooms",
    },
};



export default async function Rooms() {
    let rooms = fallbackRooms;

    try {
        const supabase = await createClient();
        const { data: plans } = await supabase
            .from("pricing")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("monthly_rate", { ascending: true });

        if (plans && plans.length > 0) {
            rooms = plans.map((plan) => ({
                title: plan.plan_name,
                subtitle: plan.subtitle ?? plan.occupancy_type,
                price: inr.format(Number(plan.monthly_rate)),
                tag: plan.tag ?? "",
                description: plan.description ?? "",
                features: plan.features ?? [],
                recommended: plan.recommended ?? false,
            }));
        }
    } catch {
        // Keep the fallback rooms if Supabase is unavailable.
    }

    return (
        <div className="bg-brand-cream min-h-dvh pb-20">
            <div className="bg-brand-teal text-white py-16 mb-20">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Rooms & Pricing</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        Transparent pricing. No hidden costs. Choose the room that fits your budget and comfort.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl flex flex-wrap justify-center gap-6">
                {/* Room Cards */}
                {rooms.map((room, index) => (
                    <RoomCard
                        key={index}
                        room={room}
                        className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]"
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 max-w-4xl space-y-6">
                {/* Standard Features Section */}
                <section className="mt-16 px-8 py-10 bg-brand-teal/5 rounded-[2.5rem]">
                    <h4 className="text-center text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-teal mb-8">Standard with every room</h4>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
                        <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all cursor-default">
                            <Shield className="w-5 h-5 text-brand-teal" />
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">24/7 CCTV</span>
                        </div>
                        <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all cursor-default">
                            <Droplets className="w-5 h-5 text-brand-teal" />
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">RO WATER</span>
                        </div>
                        <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all cursor-default">
                            <Utensils className="w-5 h-5 text-brand-teal" />
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">VEG FOOD</span>
                        </div>
                        <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all cursor-default">
                            <Gamepad2 className="w-5 h-5 text-brand-teal" />
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">COMMON AREA</span>
                        </div>
                    </div>
                </section>

                {/* Additional Info / Terms */}
                <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mx-auto">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        Quick Terms
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-600 list-disc list-inside">
                        <li><span className="font-semibold text-slate-800">Security Deposit:</span> One month rent (Refundable)</li>
                        <li><span className="font-semibold text-slate-800">Electricity:</span> Included for Non-AC. Excluded for AC rooms.</li>
                        <li><span className="font-semibold text-slate-800">Notice Period:</span> 1 Month strictly required.</li>
                    </ul>
                </div>

                <div className="text-center mt-12 pb-8">
                    <p className="text-slate-600 mb-4 font-medium text-sm">Have questions about availability?</p>
                    <div className="flex justify-center gap-4">
                        <CallButton />
                        <WhatsAppButton />
                        <InstagramButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
