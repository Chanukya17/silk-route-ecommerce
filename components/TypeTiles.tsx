import Image from "next/image";
import Link from "next/link";

export default function TypeTiles() {
  return (
    <section id="shop" className="py-16 md:py-24 bg-primary-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12 text-primary-900">
          Shop by Type
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Handloom Tile */}
          <Link href="/handloom" className="group relative block h-[500px] overflow-hidden rounded-2xl shadow-lg transition-transform hover:shadow-2xl">
            <Image
              src="/images/handloom_tile.png"
              alt="Handloom Sarees"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 p-8 w-full text-white">
              <h3 className="font-display text-3xl font-bold mb-2">Handloom</h3>
              <p className="text-white/80 mb-4 max-w-sm">Authentic, artisanal weaves crafted with tradition.</p>
              <span className="inline-block border border-white/50 px-6 py-2 rounded-full uppercase tracking-wider text-sm font-semibold transition-colors group-hover:bg-white group-hover:text-primary-900">
                Explore
              </span>
            </div>
          </Link>

          {/* Powerloom Tile */}
          <Link href="/powerloom" className="group relative block h-[500px] overflow-hidden rounded-2xl shadow-lg transition-transform hover:shadow-2xl">
            <Image
              src="/images/powerloom_tile.png"
              alt="Powerloom Sarees"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 p-8 w-full text-white">
              <h3 className="font-display text-3xl font-bold mb-2">Powerloom</h3>
              <p className="text-white/80 mb-4 max-w-sm">Trendy, vibrant designs for everyday elegance.</p>
              <span className="inline-block border border-white/50 px-6 py-2 rounded-full uppercase tracking-wider text-sm font-semibold transition-colors group-hover:bg-white group-hover:text-primary-900">
                Explore
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
