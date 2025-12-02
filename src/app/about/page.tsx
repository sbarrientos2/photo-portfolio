import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--color-charcoal)] text-[var(--color-cream)] relative">
            {/* Decorative gradient background */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--color-gold)] blur-[150px] rounded-full" />
                <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[var(--color-muted-gold)] blur-[120px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[var(--color-charcoal)]/80 border-b border-[var(--color-gold)]/10">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
                    <Link href="/" className="text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] font-light">
                        SB
                    </Link>
                    <ul className="flex gap-8 md:gap-12 text-xs md:text-sm uppercase tracking-[0.2em] font-light">
                        <li><Link href="/" className="text-[var(--color-gray-light)] hover:text-[var(--color-gold)] transition-colors duration-300">Portfolio</Link></li>
                        <li><Link href="/about" className="text-[var(--color-cream)] hover:text-[var(--color-gold)] transition-colors duration-300">About</Link></li>
                    </ul>
                </div>
            </nav>

            {/* Hero Header */}
            <header className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12 max-w-[1200px] mx-auto">
                <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--color-muted-gold)] mb-6 font-light">
                    About the Artist
                </p>
                <h1 className="font-[var(--font-display)] text-6xl md:text-8xl lg:text-9xl font-light leading-[0.95] text-[var(--color-cream)] mb-6">
                    Behind
                    <br />
                    <span className="text-[var(--color-gold)] italic">the Lens</span>
                </h1>

                {/* Decorative divider */}
                <div className="flex items-center gap-4 mt-12">
                    <div className="w-24 h-[1px] bg-[var(--color-gold)]" />
                    <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
                </div>
            </header>

            {/* Content */}
            <section className="relative px-6 md:px-12 pb-24 max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
                    {/* Main Content */}
                    <div className="md:col-span-8">
                        <div className="space-y-8 text-base md:text-lg leading-relaxed text-[var(--color-gray-light)] font-light">
                            <p className="first-letter:text-6xl first-letter:font-[var(--font-display)] first-letter:text-[var(--color-gold)] first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
                                I'm Sebastian, a passionate photographer who finds beauty in the world around us.
                                This portfolio is a collection of moments I've captured throughout my journey—places
                                I've explored, people I've met, and the landscapes that have taken my breath away.
                            </p>

                            <p>
                                I love traveling and discovering new places, whether it's wandering through vibrant
                                cities, hiking remote trails, or simply finding hidden gems in everyday life. My camera
                                is my companion as I chase light, capture emotions, and document the beauty of our world.
                            </p>

                            <p>
                                From the grace of animals in their natural habitats to the warmth of human connection,
                                from sweeping landscapes to intimate details—every photograph tells a story. I'm
                                especially drawn to those fleeting moments that reveal something genuine and beautiful.
                            </p>

                            <p>
                                I share this adventure with my girlfriend Ruth, who joins me in exploring the world
                                and inspires me to see things from new perspectives. Together, we're always seeking
                                the next beautiful moment to capture.
                            </p>

                            <p className="font-[var(--font-display)] text-xl md:text-2xl text-[var(--color-cream)] italic mt-12 pt-8 border-t border-[var(--color-gold)]/20">
                                "Thank you for visiting my portfolio. I hope these images bring you a glimpse of the
                                wonder I see through my lens."
                            </p>
                        </div>

                        {/* Contact Section */}
                        <div className="mt-16 pt-12 border-t border-[var(--color-gold)]/20">
                            <h3 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-cream)] mb-4 font-light">
                                Get in Touch
                            </h3>
                            <p className="text-[var(--color-gray-light)] font-light leading-relaxed">
                                Interested in my work or want to collaborate? Feel free to reach out.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="md:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            {/* Info Cards */}
                            <div className="border border-[var(--color-gold)]/20 p-6 backdrop-blur-sm bg-[var(--color-charcoal)]/50">
                                <h4 className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted-gold)] mb-4 font-light">
                                    Specialties
                                </h4>
                                <ul className="space-y-2 text-sm text-[var(--color-gray-light)] font-light">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[var(--color-gold)]" />
                                        Landscape Photography
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[var(--color-gold)]" />
                                        Wildlife & Nature
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[var(--color-gold)]" />
                                        Travel Documentation
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[var(--color-gold)]" />
                                        Portrait Photography
                                    </li>
                                </ul>
                            </div>

                            <div className="border border-[var(--color-gold)]/20 p-6 backdrop-blur-sm bg-[var(--color-charcoal)]/50">
                                <h4 className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted-gold)] mb-4 font-light">
                                    Philosophy
                                </h4>
                                <p className="text-sm text-[var(--color-gray-light)] font-light leading-relaxed italic">
                                    "Every moment is fleeting, but a photograph makes it eternal. I strive to capture
                                    not just what I see, but what I feel."
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative px-6 md:px-12 py-12 border-t border-[var(--color-gold)]/10">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-[var(--color-gray-light)] tracking-[0.2em] uppercase font-light">
                        © {new Date().getFullYear()} Sebastian Barrientos
                    </p>
                    <Link href="/" className="text-xs text-[var(--color-muted-gold)] hover:text-[var(--color-gold)] transition-colors duration-300 uppercase tracking-[0.2em] font-light">
                        View Portfolio
                    </Link>
                </div>
            </footer>
        </main>
    );
}
