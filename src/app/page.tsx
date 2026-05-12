export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24">
      <h1
        className="text-6xl font-light tracking-widest uppercase"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        VOUS
      </h1>
      <p className="text-lg tracking-wide text-vous-gray">
        Moda consciente — próximamente
      </p>
      <div className="h-px w-24 bg-vous-gold" />
      <p className="text-sm text-vous-gray-light tracking-widest uppercase">
        Setup inicial completado ✓
      </p>
    </main>
  );
}
