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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
            >
                <X size={32} />
            </button>

            <button
                onClick={handlePrev}
                className="absolute left-4 text-white/70 hover:text-white z-50 p-2"
            >
                <ChevronLeft size={48} />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 text-white/70 hover:text-white z-50 p-2"
            >
                <ChevronRight size={48} />
            </button>

            <div className="relative w-full h-full max-w-6xl max-h-[90vh] p-4 flex flex-col items-center justify-center">
                <div className="relative w-full h-full">
                    <Image
                        src={photo.src}
                        alt={photo.caption || ''}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                {(photo.caption || photo.description) && (
                    <div className="mt-4 text-center text-white max-w-2xl">
                        {photo.caption && <h3 className="text-xl font-bold">{photo.caption}</h3>}
                        {photo.description && <p className="text-gray-300 mt-2">{photo.description}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
