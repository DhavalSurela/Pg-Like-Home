import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
    className?: string;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
}

export function CallButton({ className, variant = "primary", size = "md" }: CTAButtonProps) {
    return (
        <Link
            href="tel:9054499036"
            className={cn(
                "inline-flex items-center gap-2 rounded-md font-semibold transition-colors",
                variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
                variant === "secondary" && "bg-green-600 text-white hover:bg-green-700",
                variant === "outline" && "border-2 border-current hover:bg-accent/10",
                size === "sm" && "px-3 py-1.5 text-sm",
                size === "md" && "px-4 py-2 text-base",
                size === "lg" && "px-6 py-3 text-lg",
                className
            )}
        >
            <Phone className="w-5 h-5" />
            <span>Call Now</span>
        </Link>
    );
}

export function WhatsAppButton({ className, variant = "secondary", size = "md" }: CTAButtonProps) {
    return (
        <Link
            href="https://wa.me/919925574196"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "inline-flex items-center gap-2 rounded-md font-semibold transition-colors",
                variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
                variant === "secondary" && "bg-green-600 text-white hover:bg-green-700",
                variant === "outline" && "border-2 border-current hover:bg-accent/10",
                size === "sm" && "px-3 py-1.5 text-sm",
                size === "md" && "px-4 py-2 text-base",
                size === "lg" && "px-6 py-3 text-lg",
                className
            )}
        >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
        </Link>
    );
}
