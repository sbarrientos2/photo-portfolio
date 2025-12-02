'use client';

import { useState } from 'react';
import { Photo } from '@/lib/data';
import Image from 'next/image';
import Lightbox from './Lightbox';

interface Props {
    photos: Photo[];
}

export default function PhotoGrid({ photos }: Props) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    return (
        <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8">
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="break-inside-avoid relative group cursor-pointer mb-6 md:mb-8 overflow-hidden"
                        onClick={() => setLightboxIndex(index)}
                        style={{
                            animationDelay: `${index * 0.05}s`,
                            opacity: 0,
                            animation: `fadeInUp 0.6s ease-out ${index * 0.05}s forwards`
                        }}
                    >
                        {/* Image Container with Border */}
                        <div className="relative overflow-hidden bg-[var(--color-charcoal)]">
                            {/* Decorative Border */}
                            <div className="absolute inset-0 border-2 border-[var(--color-gold)]/0 group-hover:border-[var(--color-gold)]/40 transition-all duration-700 z-10 pointer-events-none" />

                            {/* Image */}
                            <Image
                                src={photo.src}
                                alt={photo.caption || 'Photo'}
                                width={800}
                                height={1200}
                                className="w-full h-auto object-cover transition-all duration-[800ms] ease-out group-hover:scale-105 group-hover:brightness-90"
                            />

                            {/* Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Content Overlay */}
                            {(photo.caption || photo.description) && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    {photo.caption && (
                                        <p className="font-[var(--font-display)] text-xl md:text-2xl text-[var(--color-cream)] mb-2 font-light leading-tight">
                                            {photo.caption}
                                        </p>
                                    )}
                                    {photo.description && (
                                        <p className="text-xs md:text-sm text-[var(--color-gray-light)] font-light leading-relaxed line-clamp-3">
                                            {photo.description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Index Number - Top Right */}
                            <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center border border-[var(--color-gold)]/0 group-hover:border-[var(--color-gold)]/50 rounded-full backdrop-blur-sm bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <span className="text-xs text-[var(--color-gold)] font-light">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>

                            {/* Expand Icon - Bottom Right */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                                <div className="w-8 h-8 border border-[var(--color-cream)]/60 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/20">
                                    <svg className="w-4 h-4 text-[var(--color-cream)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {lightboxIndex !== null && (
                <Lightbox
                    photos={photos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </>
    );
}
