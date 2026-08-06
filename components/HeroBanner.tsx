import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] bg-secondary flex items-center justify-center overflow-hidden">
      <Image
        src="/images/hero_banner.png"
        alt="Elegant Kanjivaram Silk Saree"
        fill
        className="object-cover object-center opacity-90"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center animate-fade-in">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-lg mb-4">
          The Festive Weave Collection
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
          Discover the authentic heritage of handloom sarees and the vibrant modern appeal of powerloom creations.
        </p>
        <Link 
          href="#shop" 
          className="bg-white text-primary-900 px-8 py-4 rounded-full font-semibold hover:bg-secondary-light transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Explore the Collection
        </Link>
      </div>
    </section>
  );
}
