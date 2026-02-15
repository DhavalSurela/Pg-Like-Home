import { CallButton } from "@/components/CTAButtons";
import { AlertCircle, Ban, Clock, DoorClosed, FileText } from "lucide-react";

export const metadata = {
    title: "Rules & Regulations - PG Like Home",
    description: "Simple guidelines to ensure a peaceful and disciplined environment for all students.",
};

export default function Rules() {
    const rules = [
        {
            title: "No Smoking / Alcohol",
            desc: "Strictly prohibited inside the PG premises. Any violation will lead to immediate expulsion.",
            icon: Ban,
            color: "text-red-500",
            bg: "bg-red-50",
        },
        {
            title: "Notice Period",
            desc: "One month notice is mandatory before leaving. Without notice, the security deposit will not be refunded.",
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            title: "Entry Timings",
            desc: "No strict time limit for entry, but residents must inform the owner if arriving very late for safety reasons.",
            icon: Clock,
            color: "text-green-500",
            bg: "bg-green-50",
        },
        {
            title: "Visitors Policy",
            desc: "Male friends allowed in common area only. Female visitors (except mothers/sisters) not allowed inside rooms.",
            icon: DoorClosed,
            color: "text-orange-500",
            bg: "bg-orange-50",
        }
    ];

    return (
        <div className="bg-brand-cream min-h-screen pb-20">
            <div className="bg-brand-teal text-white py-16">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">House Rules</h1>
                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        To maintain a studious and peaceful atmosphere, we request all residents to follow these simple guidelines.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 mt-12 max-w-4xl">
                <div className="grid gap-6">
                    {rules.map((rule, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-dark shrink-0">
                                <rule.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{rule.title}</h3>
                                <p className="text-slate-600 mt-1 leading-relaxed">
                                    {rule.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-blue-900">Refund Policy</h4>
                        <p className="text-blue-700 text-sm mt-1">
                            Security deposit is refundable only if the 1-month notice period is served. If a student leaves without notice, the deposit will be forfeited. Rent is non-refundable once paid.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
