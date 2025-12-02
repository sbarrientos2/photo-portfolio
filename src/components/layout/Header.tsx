import Link from 'next/link';

export default function Header() {
  return (
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
  );
}
