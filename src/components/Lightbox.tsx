'use client';

import { useState, useEffect, useCallback } from 'react';
import { Photo } from '@/lib/data';
import { X, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import Image from 'next/image';

interface Props {
    photos: Photo[];
    initialIndex: number;
    onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: Props) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isLoading, setIsLoading] = useState(true);
    const photo = photos[currentIndex];

    const handleNext = useCallback(() => {
        setIsLoading(true);
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, [photos.length]);

    const handlePrev = useCallback(() => {
        setIsLoading(true);
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

    // Reset loading state when photo src changes
    useEffect(() => {
        setIsLoading(true);
    }, [photo.src]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
        >
            {/* Blurred Background */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110 transition-all duration-500"
                style={{ backgroundImage: `url(${photo.src})` }}
            />

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center border border-white/30 rounded-full hover:border-white/60 hover:bg-white/10 text-white transition-all duration-300 group backdrop-blur-md"
                aria-label="Close lightbox"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Navigation Buttons */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-6 z-[110] w-14 h-14 flex items-center justify-center border border-white/30 rounded-full hover:border-white/60 hover:bg-white/10 text-white transition-all duration-300 group backdrop-blur-md"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-6 z-[110] w-14 h-14 flex items-center justify-center border border-white/30 rounded-full hover:border-white/60 hover:bg-white/10 text-white transition-all duration-300 group backdrop-blur-md"
                        aria-label="Next image"
                    >
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </>
            )}

            {/* Image Counter */}
            <div className="absolute top-6 left-6 z-[110] px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full">
                <span className="text-xs tracking-[0.2em] uppercase text-white font-light">
                    {currentIndex + 1} / {photos.length}
                </span>
            </div>

            {/* Image Container */}
            <div
                className="relative w-full h-full max-w-[95vw] max-h-[95vh] px-4 md:px-12 py-4 md:py-12 flex flex-col items-center justify-center z-[105]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full h-full shadow-2xl flex items-center justify-center">
                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="absolute z-20">
                            <Loader className="animate-spin text-white/50" size={48} />
                        </div>
                    )}
                    
                    {/* Image with cross-fade */}
                    <Image
                        key={photo.id} // Key change triggers re-render and transition
                        src={photo.src}
                        alt={photo.caption || ''}
                        fill
                        className={`object-contain relative z-10 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        priority
                        onLoad={() => setIsLoading(false)}
                    />
                </div>

                {/* Caption Area */}
                {(photo.caption || photo.description) && (
                    <div className={`mt-6 text-center max-w-3xl mx-auto px-6 backdrop-blur-md bg-black/20 rounded-2xl py-4 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                        {photo.caption && (
                            <h3 className="font-[var(--font-display)] text-xl md:text-2xl text-white mb-2 font-light">
                                {photo.caption}
                            </h3>
                        )}
                        {photo.description && (
                            <p className="text-xs md:text-sm text-white/80 leading-relaxed font-light">
                                {photo.description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
