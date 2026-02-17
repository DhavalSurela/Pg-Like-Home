import { CallButton, WhatsAppButton, InstagramButton } from "@/components/CTAButtons";
import { RoomCard } from "@/components/RoomCard";
import { MapPin, Star, Shield, Wifi, Utensils, Droplets, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import fs from "fs";
import path from "path";
import { FoodShowcase } from "@/components/FoodShowcase";

// Helper to get images
function getImages(category: string): string[] {
  const dirPath = path.join(process.cwd(), "public", "images", "food", category);
  try {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/images/food/${category}/${file}`);
  } catch (error) {
    return [];
  }
}

export default function Home() {
  // Read images server-side
  const breakfastImages = getImages("breakfast");
  const lunchDinnerImages = getImages("lunch-dinner");
  const festivalImages = getImages("festival-food");
  const fastFoodImages = getImages("fastfood");

  const features = [
    { icon: Utensils, label: "Pure Veg Food", desc: "Breakfast, Lunch, Dinner" },
    { icon: Wifi, label: "High-Speed Wi-Fi", desc: "Unlimited 5G internet" },
    { icon: Shield, label: "CCTV Security", desc: "24x7 surveillance" },
    { icon: Droplets, label: "RO Water", desc: "Chilled & Purified" },
    { icon: Zap, label: "Power Backup", desc: "Uninterrupted supply" },
    { icon: Star, label: "Housekeeping", desc: "Daily room cleaning" },
  ];

  const featuredRooms = [
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
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-teal text-white py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-teal/95 to-brand-teal/70 z-10" />
          {/* Placeholder for Hero Image - using a high quality Unsplash image */}
          {/* In a real project, we would use next/image with a local file or optimized remote image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522771753035-1a5b6562f3ba?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Comfort, Care & <br className="hidden md:block" />
              <span className="text-brand-orange">Feeling of Home</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-100 max-w-xl font-light">
              Premium student accommodation in Memnagar. Delicious veg food, hygienic stay, and family atmosphere.
            </p>
            <div className="hidden md:flex flex-wrap gap-4 pt-4">
              <CallButton size="lg" />
              <WhatsAppButton size="lg" className="hover:bg-green-700 border-transparent" />
              <InstagramButton size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
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

      {/* Food Strip - Dynamic Showcase */}
      <FoodShowcase
        breakfastImages={breakfastImages}
        lunchDinnerImages={lunchDinnerImages}
        festivalImages={festivalImages}
        fastFoodImages={fastFoodImages}
      />

      {/* Pricing Teaser */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Transparent Pricing</h2>
            <Link href="/rooms" className="hidden md:flex text-brand-orange font-semibold hover:text-orange-700 transition-colors text-sm items-center gap-1">
              View detailed pricing table <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room, i) => (
              <RoomCard key={i} room={room} className="w-full" />
            ))}
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/rooms" className="px-6 py-3 bg-white border border-brand-orange/20 rounded-full text-brand-orange font-semibold hover:bg-brand-orange/5 transition-all text-sm flex items-center gap-2 shadow-sm">
              View detailed pricing table <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Location / Colleges */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.2717290421306!2d72.52838387509269!3d23.050497479154185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85d70d2b8d5f%3A0xa073becfd75ae939!2sPg%20like%20home!5e0!3m2!1sen!2sin!4v1771012444714!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale-[50%] hover:grayscale-0 transition-all duration-500"
            />

          </div>
        </div>
      </section>

    </div>
  );
}
