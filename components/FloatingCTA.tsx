import { Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export function FloatingCTA() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:hidden">
            <Link
                href="https://wa.me/919925574196"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-transform active:scale-95"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="w-7 h-7" />
            </Link>
            <Link
                href="tel:9054499036"
                className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
                aria-label="Call Now"
            >
                <Phone className="w-7 h-7" />
            </Link>
        </div>
    );
}
