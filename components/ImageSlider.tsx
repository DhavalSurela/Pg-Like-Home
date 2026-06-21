"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
    images: string[];
    category: string;
}

export function ImageSlider({ images, category }: ImageSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300; // Adjust scroll amount as needed
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // buffer of 10px
        }
    };

    // Drag to scroll handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftState(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeftState - walk;
    };

    if (images.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p>No images available for {category} yet.</p>
            </div>
        );
    }

    return (
        <div className="relative group">
            {/* Scroll Buttons */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-brand-dark hover:text-brand-orange transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {showRightArrow && (
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md text-brand-dark hover:text-brand-orange transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Slider Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:-mx-12 md:px-12 xl:mx-0 xl:px-0 select-none ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
                    }`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="relative flex-shrink-0 w-72 h-56 md:w-80 md:h-64 rounded-xl overflow-hidden snap-center shadow-sm border border-slate-100"
                    >
                        <Image
                            src={src}
                            alt={`${category} image ${index + 1}`}
                            fill
                            className="object-cover pointer-events-none" // pointer-events-none prevents image dragging ghost
                            sizes="(max-width: 768px) 288px, 320px"
                            unoptimized={src.startsWith("http")}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
