import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="min-h-screen p-8 md:p-24 bg-white text-black">
            <header className="mb-16 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2">
                        Sebastian Barrientos
                    </h1>
                    <p className="text-gray-500 text-lg">Photographer</p>
                </div>
                <nav className="hidden md:block">
                    <ul className="flex gap-6 text-sm uppercase tracking-widest">
                        <li><Link href="/" className="hover:underline text-gray-400">Portfolio</Link></li>
                        <li><Link href="/about" className="hover:underline">About</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-8">About Me</h2>

                <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                    <p>
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

                    <p className="text-gray-500 italic">
                        Thank you for visiting my portfolio. I hope these images bring you a glimpse of the
                        wonder I see through my lens.
                    </p>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                    <p className="text-gray-600">
                        Interested in my work or want to collaborate? Feel free to reach out.
                    </p>
                </div>
            </div>
        </main>
    );
}
