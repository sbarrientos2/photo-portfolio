'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';

export default function Header() {
  const pathname = usePathname();

  // Don't show header on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[var(--color-charcoal)]/80 border-b border-[var(--color-gold)]/10 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
        <Link href="/" className="text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] font-light">
          SB
        </Link>
        <div className="flex items-center gap-6 md:gap-10">
          <ul className="flex gap-8 md:gap-12 text-xs md:text-sm uppercase tracking-[0.2em] font-light">
            <li>
              <Link
                href="/"
                className={`transition-colors duration-300 ${
                  pathname === '/'
                    ? 'text-[var(--color-cream)]'
                    : 'text-[var(--color-gray-light)] hover:text-[var(--color-gold)]'
                }`}
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`transition-colors duration-300 ${
                  pathname === '/about'
                    ? 'text-[var(--color-cream)]'
                    : 'text-[var(--color-gray-light)] hover:text-[var(--color-gold)]'
                }`}
              >
                About
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
