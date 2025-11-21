import { getCategory } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PhotoGrid from '@/components/PhotoGrid';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const category = await getCategory(id);
    if (!category) return { title: 'Not Found' };
    return {
        title: `${category.title} | Sebastian Barrientos`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { id } = await params;
    const category = await getCategory(id);

    if (!category) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white text-black">
            <header className="p-8 md:p-12 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-60 transition-opacity">
                    Sebastian Barrientos
                </Link>
                <nav>
                    <ul className="flex gap-6 text-sm uppercase tracking-widest">
                        <li><Link href="/" className="hover:underline">Portfolio</Link></li>
                        <li><Link href="/about" className="hover:underline text-gray-400">About</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="px-4 md:px-8 pb-24">
                <div className="mb-16 pt-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.title}</h1>
                    <div className="w-12 h-1 bg-black mx-auto"></div>
                </div>

                {category.photos.length > 0 ? (
                    <PhotoGrid photos={category.photos} />
                ) : (
                    <div className="text-center py-24 text-gray-400">
                        <p>No photos in this category yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
