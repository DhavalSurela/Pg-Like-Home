import { CallButton, WhatsAppButton } from "@/components/CTAButtons";
import { Check, MapPin, Star, Shield, Wifi, Utensils, Droplets, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const features = [
    { icon: Utensils, label: "Pure Veg Food", desc: "Breakfast, Lunch, Dinner" },
    { icon: Wifi, label: "High-Speed Wi-Fi", desc: "Unlimited 5G internet" },
    { icon: Shield, label: "CCTV Security", desc: "24x7 surveillance" },
    { icon: Droplets, label: "RO Water", desc: "Chilled & Purified" },
    { icon: Zap, label: "Power Backup", desc: "Uninterrupted supply" },
    { icon: Star, label: "Housekeeping", desc: "Daily room cleaning" },
  ];

  const pricing = [
    { type: "Non AC Hall", price: "₹9,000", sharing: "Multi Share" },
    { type: "Non AC Room", price: "₹10,000", sharing: "3 Sharing" },
    { type: "AC Room", price: "₹11,000", sharing: "3 Sharing" },
    { type: "AC Room", price: "₹14,500", sharing: "2 Sharing" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-brand-blue/70 z-10" />
          {/* Placeholder for Hero Image - using a high quality Unsplash image */}
          {/* In a real project, we would use next/image with a local file or optimized remote image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522771753035-1a5b6562f3ba?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        </div>

        <div className="container relative z-20 mx-auto px-4">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Comfort, Care & <br className="hidden md:block" />
              <span className="text-brand-orange">Feeling of Home</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-100 max-w-xl font-light">
              Premium student accommodation in Memnagar. Delicious veg food, hygienic stay, and family atmosphere.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <CallButton size="lg" className="bg-brand-orange hover:bg-[#D08060] text-white" />
              <WhatsAppButton size="lg" className="hover:bg-green-700 border-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{f.label}</h3>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Strip */}
      <section className="py-12 bg-brand-cream border-b border-brand-orange/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Freshly Prepared Meals</h2>
            <Link href="/food" className="text-brand-orange font-semibold hover:text-orange-700 transition-colors text-sm flex items-center gap-1">
              View Full Menu <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[12, 18, 24, 28].map((num) => (
              <div key={num} className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group bg-slate-200">
                <Image
                  src={`/images/food/food-${num}.jpg`}
                  alt="Delicious veg meal"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Affordable Pricing</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">Transparent pricing with no hidden charges. Rent includes food, housekeeping, Wi-Fi, and all standard facilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                <h3 className="font-medium text-slate-500 uppercase tracking-wide text-xs">{p.sharing}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">{p.price}</span>
                  <span className="text-sm text-slate-400">/mo</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-blue-700">{p.type}</div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> All Meals Included</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> Electricity {(p.type.includes("Non AC") ? "(Included)" : "(Excluded)")}</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> Daily Cleaning</li>
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/rooms" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center justify-center gap-1">
              View detailed pricing table <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Location / Colleges */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Prime Location in Memnagar</h2>
              <p className="text-slate-600 leading-relaxed">
                Located in Nilmani Society, Memnagar, we are strategically placed to significantly reduce your daily commute. Spend less time travelling and more time studying or relaxing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {["Gujarat University", "IIM Ahmedabad", "HL College", "LD Engineering", "CEPT University", "MG Science"].map((college) => (
                <div key={college} className="flex items-center gap-2 text-slate-700 font-medium">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{college}</span>
                </div>
              ))}
            </div>

            <Link
              href="https://maps.google.com/?q=PG+Like+Home+Memnagar+Ahmedabad"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Get Directions on Google Maps
            </Link>
          </div>

          <div className="bg-slate-100 rounded-2xl overflow-hidden h-96 relative shadow-inner ring-1 ring-slate-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.581961477169!2d72.529367!3d23.041627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84c70d462159%3A0xf69d72224773e34a!2sSterling%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale-[50%] hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-semibold shadow-sm">
              Near Sterling Hospital
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
