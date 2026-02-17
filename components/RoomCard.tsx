import { Check, Snowflake, WashingMachine, Sparkles, Wifi, Utensils, Wind, Zap, BedDouble } from "lucide-react";

// Helper to map features to icons
const getFeatureIcon = (feature: string) => {
    const lower = feature.toLowerCase();
    if (lower.includes("ac") || lower.includes("air conditioner")) return <Snowflake className="w-5 h-5 text-brand-teal" />;
    if (lower.includes("laundry") || lower.includes("washing")) return <WashingMachine className="w-5 h-5 text-brand-teal" />;
    if (lower.includes("cleaning") || lower.includes("housekeeping")) return <Sparkles className="w-5 h-5 text-brand-teal" />;
    if (lower.includes("wifi") || lower.includes("net")) return <Wifi className="w-5 h-5 text-brand-teal" />;
    if (lower.includes("food") || lower.includes("meal")) return <Utensils className="w-5 h-5 text-brand-teal" />;
    if (lower.includes("cooler") || lower.includes("fan")) return <Wind className="w-5 h-5 text-brand-teal" />;
    if (lower.includes("power") || lower.includes("electricity")) return <Zap className="w-5 h-5 text-brand-teal" />;
    if (lower.includes("bed") || lower.includes("mattress")) return <BedDouble className="w-5 h-5 text-brand-teal" />;
    return <Check className="w-5 h-5 text-brand-teal" />;
};

interface RoomProps {
    room: {
        title: string;
        subtitle: string;
        price: string;
        tag: string;
        description: string;
        features: string[];
        recommended: boolean;
    };
    className?: string;
}

export const RoomCard = ({ room, className = "" }: RoomProps) => {
    return (
        <div
            className={`bg-white rounded-3xl border shadow-sm overflow-hidden relative flex flex-col ${room.recommended
                ? 'border-brand-orange ring-1 ring-brand-orange/20 shadow-md'
                : 'border-slate-100'
                } ${className}`}
        >
            {room.recommended && (
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-teal text-white text-[10px] font-bold rounded-bl-xl tracking-widest z-10">
                    MOST POPULAR
                </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block px-3 py-1 bg-brand-teal/10 text-brand-teal text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
                            {room.tag}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{room.title}</h3>
                        <p className="text-sm font-medium text-slate-500">{room.subtitle}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-brand-orange">{room.price}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Per Month</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500 mb-6 font-medium flex-1">
                    {room.description}
                </p>
                <div className="grid grid-cols-2 gap-y-5 gap-x-2 border-t border-slate-50 pt-6 mt-auto">
                    {room.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            {getFeatureIcon(feature)}
                            <span className="text-xs font-semibold text-slate-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
