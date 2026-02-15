import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal shadow-sm">
                <Home className="h-6 w-6 text-brand-orange" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-tight text-brand-teal">
                    PG LIKE
                </span>
                <span className="text-xl font-extrabold tracking-tight text-brand-orange -mt-1">
                    HOME
                </span>
            </div>
        </div>
    );
}
