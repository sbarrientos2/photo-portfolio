import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/data';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="relative px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[400px] md:auto-rows-[500px]">
        {categories.map((category, index) => {
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
  );
}
