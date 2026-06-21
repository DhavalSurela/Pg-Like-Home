import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import { CallButton, InstagramButton, WhatsAppButton } from "@/components/CTAButtons";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - PG Like Home, Memnagar",
  description:
    "Get in touch with PG Like Home in Memnagar, Ahmedabad. Send us a message, call, or WhatsApp to book a visit or ask about rooms, food, and pricing.",
  alternates: {
    canonical: "https://pg-like-home.vercel.app/contact",
  },
  openGraph: {
    title: "Contact PG Like Home, Memnagar",
    description: "Send us a message to book a visit or ask about rooms, food, and pricing.",
    url: "https://pg-like-home.vercel.app/contact",
  },
};

export default function Contact() {
  return (
    <div className="bg-brand-cream min-h-dvh pb-20">
      <div className="bg-brand-teal text-white py-16">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            Questions about rooms, food, or pricing? Send us a message and we&apos;ll get back to you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Address</h3>
                  <p className="text-slate-600 mt-1">
                    C7, 1st Floor, Nilmani Society,
                    <br />
                    Memnagar, Ahmedabad - 380052
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Phone</h3>
                  <a href="tel:9054499036" className="text-slate-600 mt-1 block hover:text-brand-teal">
                    +91 90544 99036
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email</h3>
                  <a href="mailto:pglikehome1@gmail.com" className="text-slate-600 mt-1 block hover:text-brand-teal">
                    pglikehome1@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 grid gap-4">
              <CallButton size="lg" className="justify-center w-full" />
              <WhatsAppButton size="lg" className="justify-center w-full" variant="secondary" />
              <InstagramButton size="lg" className="justify-center w-full" />
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
