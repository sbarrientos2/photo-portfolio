export default function Hero() {
  return (
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
          Photographer - Capturing the beauty of the world with my girlfriend moments through a lens.
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
  );
}
