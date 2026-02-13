import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use Inter for 'Modern & Professional'
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PG Like Home - Student PG in Memnagar, Ahmedabad",
  description: "Comfort, Care & Feeling of Home. Best student PG near Gujarat University, IIM Ahmedabad, and LD Engineering with pure veg food and AC rooms.",
  keywords: ["PG in Memnagar", "PG near Gujarat University", "PG near IIM Ahmedabad", "Student PG in Ahmedabad", "Paying Guest"],
  openGraph: {
    title: "PG Like Home - Student PG in Memnagar",
    description: "Comfort, Care & Feeling of Home. Affordable AC/Non-AC rooms with food.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-slate-900 bg-slate-50 flex flex-col min-h-screen`}>
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
