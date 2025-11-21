import { getData } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const data = await getData();

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
            <li><Link href="/" className="hover:underline">Portfolio</Link></li>
            <li><Link href="/about" className="hover:underline text-gray-400">About</Link></li>
          </ul>
        </nav>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.categories.map((category) => (
          <Link
            key={category.id}
            href={`/portfolio/${category.id}`}
            className="group block relative aspect-[4/5] overflow-hidden bg-gray-100"
          >
            {category.coverImage ? (
              <Image
                src={category.coverImage}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
