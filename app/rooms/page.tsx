import { CallButton, WhatsAppButton } from "@/components/CTAButtons";
import { Check, Info } from "lucide-react";

export const metadata = {
    title: "Rooms & Pricing - PG Like Home",
    description: "Affordable room rent in Memnagar. AC and Non-AC rooms available with food included.",
};

export default function Rooms() {
    const rooms = [
        {
            title: "Non AC Hall",
            price: "₹9,000",
            type: "Multi Sharing",
            features: ["Bed & Mattress", "Cupboard", "Study Table", "Shared Washroom", "Fan & Lights"],
            recommended: false,
        },
        {
            title: "Non AC Room",
            price: "₹10,000",
            type: "3 Sharing",
            features: ["Bed & Mattress", "Personal Cupboard", "Study Table", "Attached Washroom", "Fan & Lights"],
            recommended: true,
        },
        {
            title: "AC Room",
            price: "₹11,000",
            type: "3 Sharing",
            features: ["Air Conditioner", "Bed & Mattress", "Personal Cupboard", "Study Table", "Attached Washroom", "Electricity Excluded"],
            recommended: false,
        },
        {
            title: "AC Room",
            price: "₹14,500",
            type: "2 Sharing",
            features: ["Air Conditioner", "Premium Bedding", "Spacious Cupboard", "Large Study Table", "Attached Washroom", "Electricity Excluded"],
            recommended: false,
        },
        {
            title: "AC Room",
            price: "₹20,000",
            type: "1 Sharing",
            features: ["Air Conditioner", "Private Room", "Personal Cupboard", "Dedicated Workspace", "Private Washroom", "Electricity Excluded"],
            recommended: false,
        },
    ];

    return (
        <div className="bg-brand-cream min-h-screen pb-20">
            <div className="bg-brand-dark text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Rooms & Pricing</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        Transparent pricing. No hidden costs. Choose the room that fits your budget and comfort.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl p-6 shadow-sm border ${room.recommended ? 'border-brand-orange ring-1 ring-brand-orange shadow-md' : 'border-slate-200'} flex flex-col`}
                        >
                            {room.recommended && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-slate-700">{room.title}</h3>
                                <p className="text-sm text-slate-500">{room.type}</p>
                            </div>

                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-slate-900">{room.price}</span>
                                <span className="text-sm text-slate-500 font-medium">/mo</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-grow">
                                {room.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-6 border-t border-slate-100">
                                <WhatsAppButton className="w-full justify-center" size="sm" variant="outline" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        Important Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Inclusions</h4>
                            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                                <li>Breakfast, Lunch, and Dinner (Pure Veg)</li>
                                <li>High-speed Wi-Fi</li>
                                <li>Daily Room Cleaning</li>
                                <li>RO Purified Water</li>
                                <li>Washing Machine for Laundry</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Terms</h4>
                            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                                <li><span className="font-medium text-slate-900">Security Deposit:</span> One month rent (Refundable)</li>
                                <li><span className="font-medium text-slate-900">Electricity:</span> Included for Non-AC. Excluded for AC rooms (sub-meter reading).</li>
                                <li><span className="font-medium text-slate-900">Notice Period:</span> 1 Month strictly required before leaving.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <p className="text-slate-600 mb-4">Have questions about room availability?</p>
                    <div className="flex justify-center gap-4">
                        <CallButton />
                        <WhatsAppButton variant="primary" />
                    </div>
                </div>
            </div>
        </div>
    );
}
