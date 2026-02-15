"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/rooms", label: "Rooms & Pricing" },
        { href: "/food", label: "Food" },
        { href: "/facilities", label: "Facilities" },

        { href: "/rules", label: "Rules" },
        { href: "/about", label: "About & Contact" },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b border-brand-teal/10 bg-brand-cream shadow-sm">
            <div className="container mx-auto px-6 md:px-12 h-16 flex items-center">
                {/* Logo Wrapper */}
                <div className="flex-1 basis-0 flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <Logo />
                    </Link>
                </div>

                {/* Desktop Navigation - Centered */}
                <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-[2]">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors py-1 whitespace-nowrap ${isActive
                                    ? "text-brand-orange font-bold border-b-2 border-brand-orange"
                                    : "text-brand-dark hover:text-brand-orange"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side / Mobile Toggle Wrapper */}
                <div className="flex-1 basis-0 flex items-center justify-end">
                    <button
                        className="lg:hidden p-2 text-brand-dark hover:bg-brand-teal/10 rounded-md transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden border-t border-brand-teal/10 p-4 bg-brand-cream shadow-lg space-y-4">
                    <nav className="flex flex-col space-y-3">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-base font-medium px-4 py-2 rounded-md transition-colors ${isActive
                                        ? "text-brand-orange font-bold bg-brand-orange/10"
                                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
