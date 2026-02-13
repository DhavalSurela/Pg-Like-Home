import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-brand-dark text-slate-200 border-t border-slate-700">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">PG Like Home</h3>
                        <p className="text-sm text-slate-400">
                            Comfort, Care & Feeling of Home. The best student accommodation in Memnagar, Ahmedabad.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/rooms" className="hover:text-brand-orange transition-colors">Rooms & Pricing</Link></li>
                            <li><Link href="/facilities" className="hover:text-brand-orange transition-colors">Facilities</Link></li>
                            <li><Link href="/food" className="hover:text-brand-orange transition-colors">Food Menu</Link></li>
                            <li><Link href="/rules" className="hover:text-brand-orange transition-colors">Rules</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-orange transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-brand-blue shrink-0" />
                                <span>C7, 1st Floor, Nilmani Society, Memnagar, beside Sterling Hospital, Ahmedabad</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-blue shrink-0" />
                                <a href="tel:9054499036" className="hover:text-white transition-colors">9054499036</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle className="w-5 h-5 text-green-500 shrink-0" />
                                <a href="https://wa.me/919925574196" className="hover:text-white transition-colors">9925574196</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-brand-blue shrink-0" />
                                <a href="mailto:pglikehome1@gmail.com" className="hover:text-white transition-colors">pglikehome1@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700 text-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} PG Like Home. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
