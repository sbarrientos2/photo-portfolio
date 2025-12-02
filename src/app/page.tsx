import { getData } from '@/lib/data';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen relative bg-[var(--color-charcoal)]">
      {/* Decorative gradient background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-gold)] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-muted-gold)] blur-[120px] rounded-full" />
      </div>

      <Hero />
      <CategoryGrid categories={data.categories} />
    </main>
  );
}
