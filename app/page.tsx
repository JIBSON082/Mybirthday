import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Gallery />
      <Contact />
      <footer className="relative z-[2] bg-bg text-center px-[5vw] py-10 text-[0.7rem] tracking-[0.3em] uppercase text-ink/40">
        David Ajibua &mdash; captured, kept, celebrated
      </footer>
    </main>
  );
}
