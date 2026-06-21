import type { Metadata } from "next";
import { CallButton, WhatsAppButton, InstagramButton } from "@/components/CTAButtons";
import { RoomCard } from "@/components/RoomCard";
import { MapPin, Star, Shield, Wifi, Utensils, Droplets, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import fs from "fs";
import path from "path";
import { FoodShowcase } from "@/components/FoodShowcase";

export const metadata: Metadata = {
  title: "PG Like Home - Best Boys PG in Memnagar, Ahmedabad | AC Rooms & Veg Food",
  description:
    "Looking for a boys PG in Memnagar, Ahmedabad? PG Like Home offers AC/Non-AC rooms from ₹9,000/month with pure veg food, Wi-Fi, CCTV, RO water & daily housekeeping. Near Gujarat University, IIM Ahmedabad, LD Engineering & CEPT University.",
  alternates: {
    canonical: "https://pg-like-home.vercel.app",
  },
  openGraph: {
    title: "PG Like Home - Best Boys PG in Memnagar, Ahmedabad",
    description:
      "Premium student PG with AC rooms & veg food from ₹9,000/month. Near Gujarat University & IIM Ahmedabad.",
    url: "https://pg-like-home.vercel.app",
  },
};

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
    <div className="flex flex-col min-h-dvh">
      <section className="relative bg-brand-teal text-white min-h-[90vh] flex items-center overflow-hidden">
        {/* Right side illustration (Desktop: full opacity and positioned right, Mobile: faint background) */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:left-[45%] lg:w-auto h-full z-0 opacity-15 lg:opacity-100 pointer-events-none">
          <div className="relative w-full h-full">

          </div>
        </div>

        {/* Left Side Decorative Background Elements */}
        {/* Orange Arc */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-brand-orange/20 pointer-events-none z-0" />
        {/* Dot Grid */}
        <svg
          className="absolute bottom-12 left-12 w-32 h-10 opacity-30 text-white fill-current pointer-events-none z-0"
          viewBox="0 0 128 40"
        >
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={12 + c * 16} cy={8 + r * 12} r={2} />
            ))
          )}
        </svg>

        <div className="container relative z-10 mx-auto px-6 md:px-12 py-20 lg:py-32">
          <div className="max-w-2xl lg:max-w-[540px] space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-[4.75rem] lg:leading-[1.1] font-extrabold tracking-tight drop-shadow-md lg:drop-shadow-none">
              Comfort, Care & <br className="hidden md:block" />
              <span className="text-brand-orange">Feeling of Home</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-xl font-light drop-shadow-sm lg:drop-shadow-none leading-relaxed">
              Premium student accommodation in Memnagar. <br className="hidden lg:block" />
              Delicious veg food, hygienic stay, and family atmosphere.
            </p>
            <div className="hidden md:flex flex-wrap gap-4 pt-4">
              <CallButton size="lg" />
              <WhatsAppButton size="lg" className="shadow-md hover:scale-105 active:scale-95 transition-transform" />
              <InstagramButton size="lg" className="shadow-md hover:scale-105 active:scale-95 transition-transform" />
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
              <address className="not-italic text-slate-600 text-sm mt-2">
                C7, 1st Floor, Nilmani Society, Memnagar, Ahmedabad - 380052
              </address>
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
