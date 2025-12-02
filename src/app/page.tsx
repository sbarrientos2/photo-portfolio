import { getData } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen relative bg-[var(--color-charcoal)]">
      {/* Decorative gradient background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-gold)] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-muted-gold)] blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[var(--color-charcoal)]/80 border-b border-[var(--color-gold)]/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
          <Link href="/" className="text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] font-light">
            SB
          </Link>
          <ul className="flex gap-8 md:gap-12 text-xs md:text-sm uppercase tracking-[0.2em] font-light">
            <li><Link href="/" className="text-[var(--color-cream)] hover:text-[var(--color-gold)] transition-colors duration-300">Portfolio</Link></li>
            <li><Link href="/about" className="text-[var(--color-gray-light)] hover:text-[var(--color-gold)] transition-colors duration-300">About</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="relative z-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--color-muted-gold)] mb-6 font-light animate-[fadeIn_0.8s_ease-out]">
            Visual Storytelling
          </p>
          <h1
            className="font-[var(--font-display)] text-7xl md:text-9xl lg:text-[12rem] font-light leading-[0.9] text-[var(--color-cream)] mb-8"
            style={{
              animationDelay: '0.2s',
              opacity: 0,
              animation: 'fadeInUp 1s ease-out 0.2s forwards'
            }}
          >
            Sebastian
            <br />
            <span className="inline-block ml-0 md:ml-24 text-[var(--color-gold)] italic">Barrientos</span>
          </h1>
          <p
            className="text-base md:text-lg text-[var(--color-gray-light)] max-w-xl font-light leading-relaxed tracking-wide"
            style={{
              animationDelay: '0.4s',
              opacity: 0,
              animation: 'fadeInUp 1s ease-out 0.4s forwards'
            }}
          >
            Photographer & Visual Artist — Capturing moments through a lens of editorial elegance and raw emotion
          </p>
        </div>

        {/* Decorative line */}
        <div
          className="absolute left-6 md:left-12 bottom-0 w-[1px] h-24 bg-gradient-to-b from-[var(--color-gold)] to-transparent"
          style={{
            animationDelay: '0.6s',
            opacity: 0,
            animation: 'fadeIn 1s ease-out 0.6s forwards'
          }}
        />
      </header>

      {/* Category Grid - Asymmetric Editorial Layout */}
      <section className="relative px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[400px] md:auto-rows-[500px]">
          {data.categories.map((category, index) => {
            // Asymmetric grid pattern
            const patterns = [
              'md:col-span-7 md:row-span-2', // Large
              'md:col-span-5 md:row-span-1', // Medium
              'md:col-span-5 md:row-span-2', // Tall
              'md:col-span-7 md:row-span-1', // Wide
              'md:col-span-6 md:row-span-1', // Square
              'md:col-span-6 md:row-span-2', // Tall square
            ];
            const pattern = patterns[index % patterns.length];

            return (
              <Link
                key={category.id}
                href={`/portfolio/${category.id}`}
                className={`group block relative overflow-hidden bg-[var(--color-charcoal)] ${pattern}`}
                style={{
                  animationDelay: `${0.8 + index * 0.1}s`,
                  opacity: 0,
                  animation: `fadeInUp 0.8s ease-out ${0.8 + index * 0.1}s forwards`
                }}
              >
                {/* Image Container */}
                <div className="absolute inset-0 overflow-hidden">
                  {category.coverImage ? (
                    <Image
                      src={category.coverImage}
                      alt={category.title}
                      fill
                      className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-110 group-hover:rotate-[2deg]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-gray-mid)] font-[var(--font-display)] text-2xl italic">
                      Coming Soon
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

                  {/* Decorative Border */}
                  <div className="absolute inset-0 border border-[var(--color-gold)]/0 group-hover:border-[var(--color-gold)]/30 transition-all duration-700" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  {/* Category Number */}
                  <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted-gold)] mb-4 font-light opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    0{index + 1}
                  </span>

                  {/* Title */}
                  <h2 className="font-[var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-[var(--color-cream)] leading-none mb-3 transition-all duration-500 transform group-hover:translate-x-2">
                    {category.title}
                  </h2>

                  {/* Decorative Arrow */}
                  <div className="absolute top-8 right-8 w-12 h-12 border border-[var(--color-gold)]/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform rotate-0 group-hover:rotate-45">
                    <svg className="w-5 h-5 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 md:px-12 py-12 border-t border-[var(--color-gold)]/10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[var(--color-gray-light)] tracking-[0.2em] uppercase font-light">
            © {new Date().getFullYear()} Sebastian Barrientos
          </p>
          <p className="text-xs text-[var(--color-gray-light)] font-light">
            Crafted with attention to detail
          </p>
        </div>
      </footer>

    </main>
  );
}
