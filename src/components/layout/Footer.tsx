export default function Footer() {
  return (
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
  );
}
