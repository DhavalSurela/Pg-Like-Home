import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

const BASE_URL = "https://pg-like-home.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PG Like Home - Best Boys PG in Memnagar, Ahmedabad | AC Rooms & Veg Food",
    template: "%s | PG Like Home - Memnagar, Ahmedabad",
  },
  description:
    "PG Like Home offers premium boys PG accommodation in Memnagar, Ahmedabad near Gujarat University, IIM Ahmedabad & LD Engineering. AC/Non-AC rooms starting ₹9,000/month with pure veg food, Wi-Fi, CCTV & housekeeping.",
  keywords: [
    "PG in Memnagar",
    "PG near Gujarat University",
    "PG near IIM Ahmedabad",
    "boys PG in Ahmedabad",
    "student PG Ahmedabad",
    "paying guest Memnagar",
    "PG with food Ahmedabad",
    "affordable PG Ahmedabad",
    "AC PG rooms Memnagar",
    "hostel near LD Engineering",
    "hostel near CEPT University",
    "hostel near HL College",
    "PG Like Home",
    "pg like home memnagar",
    "boys hostel Ahmedabad",
    "PG near MG Science",
    "veg PG Ahmedabad",
  ],
  authors: [{ name: "PG Like Home" }],
  creator: "PG Like Home",
  publisher: "PG Like Home",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "PG Like Home - Best Boys PG in Memnagar, Ahmedabad",
    description:
      "Premium student accommodation with AC/Non-AC rooms, pure veg food, Wi-Fi & 24x7 security. Starting ₹9,000/month near Gujarat University & IIM Ahmedabad.",
    url: BASE_URL,
    siteName: "PG Like Home",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PG Like Home - Student PG in Memnagar, Ahmedabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PG Like Home - Best Boys PG in Memnagar, Ahmedabad",
    description:
      "AC/Non-AC rooms with pure veg food starting ₹9,000/month. Near Gujarat University, IIM & LD Engineering.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "k88s7p4NeTP5D0kYJUzPHMN3ydKrlpb94r2Dlm60yWE",
  },
};

// JSON-LD Structured Data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "PG Like Home",
  alternateName: "PG Like Home Memnagar",
  description:
    "Premium boys PG accommodation in Memnagar, Ahmedabad near Gujarat University, IIM Ahmedabad & LD Engineering. AC/Non-AC rooms with pure veg food, Wi-Fi, CCTV & daily housekeeping.",
  url: BASE_URL,
  telephone: "+91-9054499036",
  email: "pglikehome1@gmail.com",
  image: `${BASE_URL}/images/og-image.jpg`,
  priceRange: "₹9,000 - ₹20,000 per month",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    streetAddress: "C7, 1st Floor, Nilmani Society",
    addressLocality: "Memnagar",
    addressRegion: "Gujarat",
    addressCountry: "IN",
    postalCode: "380052",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.050497,
    longitude: 72.530764,
  },
  hasMap: "https://maps.google.com/?q=PG+Like+Home+Memnagar+Ahmedabad",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Pure Vegetarian Food", value: true },
    { "@type": "LocationFeatureSpecification", name: "High-Speed Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "CCTV Security", value: true },
    { "@type": "LocationFeatureSpecification", name: "RO Drinking Water", value: true },
    { "@type": "LocationFeatureSpecification", name: "Power Backup", value: true },
    { "@type": "LocationFeatureSpecification", name: "Daily Housekeeping", value: true },
    { "@type": "LocationFeatureSpecification", name: "Laundry Facility", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
  ],
  sameAs: [
    "https://www.instagram.com/pglike_home_1",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased text-slate-900 bg-slate-50 flex flex-col min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
        <Analytics />
      </body>
    </html>
  );
}
