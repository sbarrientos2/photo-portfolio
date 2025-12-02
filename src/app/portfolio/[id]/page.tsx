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
        <main className="min-h-screen bg-[var(--color-charcoal)] text-[var(--color-cream)] relative">
            {/* Decorative gradient background */}
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-gold)] blur-[150px] rounded-full" />
            </div>

            {/* Fixed Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[var(--color-charcoal)]/90 border-b border-[var(--color-gold)]/10">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
                    <Link href="/" className="text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] font-light hover:text-[var(--color-cream)] transition-colors duration-300">
                        SB
                    </Link>
                    <nav>
                        <ul className="flex gap-8 md:gap-12 text-xs md:text-sm uppercase tracking-[0.2em] font-light">
                            <li><Link href="/" className="text-[var(--color-cream)] hover:text-[var(--color-gold)] transition-colors duration-300">Portfolio</Link></li>
                            <li><Link href="/about" className="text-[var(--color-gray-light)] hover:text-[var(--color-gold)] transition-colors duration-300">About</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Category Header */}
            <div className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
                <div className="text-center relative z-10">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted-gold)] mb-8 hover:text-[var(--color-gold)] transition-colors duration-300 group"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Portfolio
                    </Link>

                    {/* Category Title */}
                    <h1 
                        className="font-[var(--font-display)] text-6xl md:text-8xl lg:text-9xl font-light text-[var(--color-cream)] leading-none mb-6"
                        style={{
                            animation: 'fadeInUp 1s ease-out 0.2s forwards',
                            opacity: 0,
                        }}
                    >
                        {category.title}
                    </h1>

                    {/* Decorative Divider */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
                        <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
                        <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
                    </div>

                    {/* Photo Count */}
                    {category.photos.length > 0 && (
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted-gold)] mt-8 font-light">
                            {category.photos.length} {category.photos.length === 1 ? 'Image' : 'Images'}
                        </p>
                    )}
                </div>
            </div>

            {/* Photo Grid */}
            <div className="relative px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
                {category.photos.length > 0 ? (
                    <PhotoGrid photos={category.photos} />
                ) : (
                    <div className="text-center py-24">
                        <p className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-gray-mid)] italic font-light">
                            No images yet
                        </p>
                        <p className="text-sm text-[var(--color-gray-light)] mt-4 font-light">
                            This collection is coming soon
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="relative px-6 md:px-12 py-12 border-t border-[var(--color-gold)]/10">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-[var(--color-gray-light)] tracking-[0.2em] uppercase font-light">
                        © {new Date().getFullYear()} Sebastian Barrientos
                    </p>
                    <Link href="/" className="text-xs text-[var(--color-muted-gold)] hover:text-[var(--color-gold)] transition-colors duration-300 uppercase tracking-[0.2em] font-light">
                        View All Collections
                    </Link>
                </div>
            </footer>
        </main>
    );
}
