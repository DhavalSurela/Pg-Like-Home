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
                {/* Pricing Grid - Centered Flex/Grid approach for better balance with 5 items */}
                <div className="flex flex-wrap justify-center gap-6">
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl p-6 shadow-sm border border-t-4 flex flex-col w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm transition-transform hover:-translate-y-1 ${room.recommended
                                    ? 'border-brand-orange ring-1 ring-brand-orange/20 shadow-md scale-105 z-10'
                                    : 'border-slate-200 border-t-brand-blue/30 hover:border-t-brand-blue hover:shadow-md'
                                }`}
                        >
                            {room.recommended && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-4 text-center border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-bold text-brand-dark">{room.title}</h3>
                                <p className="text-sm font-medium text-brand-blue/80 mt-1 uppercase tracking-wider">{room.type}</p>
                            </div>

                            <div className="mb-6 flex justify-center items-baseline gap-1 text-brand-dark">
                                <span className="text-4xl font-bold">{room.price}</span>
                                <span className="text-sm text-slate-500 font-medium">/mo</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-grow">
                                {room.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="mt-0.5 min-w-4">
                                            <Check className={`w-4 h-4 ${room.recommended ? 'text-brand-orange' : 'text-brand-green'}`} />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-6 border-t border-slate-100">
                                <WhatsAppButton
                                    className="w-full justify-center"
                                    size="sm"
                                    variant={room.recommended ? "primary" : "outline"}
                                />
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
