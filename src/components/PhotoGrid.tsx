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
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="break-inside-avoid relative group cursor-pointer"
                        onClick={() => setLightboxIndex(index)}
                    >
                        <Image
                            src={photo.src}
                            alt={photo.caption || 'Photo'}
                            width={800}
                            height={1200}
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        {(photo.caption || photo.description) && (
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {photo.caption && <p className="text-sm font-bold">{photo.caption}</p>}
                                {photo.description && (
                                    <p className="text-xs mt-1 text-gray-200 line-clamp-3">{photo.description}</p>
                                )}
                            </div>
                        )}
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
