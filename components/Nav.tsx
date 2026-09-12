export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-6">
      <span className="glow-text font-display text-xl md:text-2xl tracking-widest font-bold">
        DAVE
      </span>
      <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-bone/60">
        Est. Today
      </span>
    </nav>
  );
}
