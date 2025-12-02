'use client';

import { useState, useEffect, useCallback } from 'react';
import { Photo } from '@/lib/data';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Props {
    photos: Photo[];
    initialIndex: number;
    onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: Props) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const photo = photos[currentIndex];

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, [photos.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, [photos.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, handleNext, handlePrev]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center border border-[var(--color-gold)]/40 rounded-full hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 text-[var(--color-cream)] transition-all duration-300 group"
                aria-label="Close lightbox"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Navigation Buttons */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                }}
                className="absolute left-6 z-[110] w-14 h-14 flex items-center justify-center border border-[var(--color-gold)]/40 rounded-full hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 text-[var(--color-cream)] transition-all duration-300 group"
                aria-label="Previous image"
            >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                }}
                className="absolute right-6 z-[110] w-14 h-14 flex items-center justify-center border border-[var(--color-gold)]/40 rounded-full hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 text-[var(--color-cream)] transition-all duration-300 group"
                aria-label="Next image"
            >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 z-[110] px-4 py-2 backdrop-blur-sm bg-black/40 border border-[var(--color-gold)]/20 rounded-full">
                <span className="text-xs tracking-[0.2em] uppercase text-[var(--color-gold)] font-light">
                    {currentIndex + 1} / {photos.length}
                </span>
            </div>

            {/* Image Container */}
            <div
                className="relative w-full h-full max-w-7xl max-h-[85vh] px-20 py-20 flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full h-full">
                    {/* Decorative Border */}
                    <div className="absolute inset-0 border border-[var(--color-gold)]/20 pointer-events-none z-10" />

                    {/* Image */}
                    <Image
                        src={photo.src}
                        alt={photo.caption || ''}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Caption Area */}
                {(photo.caption || photo.description) && (
                    <div className="mt-8 text-center max-w-3xl mx-auto px-6">
                        {photo.caption && (
                            <h3 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--color-cream)] mb-3 font-light">
                                {photo.caption}
                            </h3>
                        )}
                        {photo.description && (
                            <p className="text-sm md:text-base text-[var(--color-gray-light)] leading-relaxed font-light">
                                {photo.description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
