import Link from "next/link";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

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
                                <span>C7, 1st Floor, Nilmani Society, Memnagar, Ahmedabad</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-blue shrink-0" />
                                <a href="tel:9054499036" className="hover:text-white transition-colors">9054499036</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-green-500 shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <a href="https://wa.me/919925574196" className="hover:text-white transition-colors">9925574196</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-brand-blue shrink-0" />
                                <a href="mailto:pglikehome1@gmail.com" className="hover:text-white transition-colors">pglikehome1@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Instagram className="w-5 h-5 text-[#E1306C] shrink-0" />
                                <a href="https://www.instagram.com/pglike_home_1?igsh=OXFxaTVpczE1eXR4" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Follow us on Instagram</a>
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
