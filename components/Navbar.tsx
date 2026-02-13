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
        { href: "/gallery", label: "Gallery" },
        { href: "/rules", label: "Rules" },
        { href: "/about", label: "About & Contact" },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b border-brand-blue/10 bg-brand-cream shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors py-1 ${isActive
                                    ? "text-brand-orange font-bold border-b-2 border-brand-orange"
                                    : "text-brand-dark hover:text-brand-orange"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden border-t border-brand-blue/10 p-4 bg-brand-cream shadow-lg space-y-4">
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
