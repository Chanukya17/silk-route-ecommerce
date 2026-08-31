import Link from "next/link";
import Image from "next/image";

export interface SubtypeProps {
  id: string;
  name: string;
  type: { name: string };
}

export default function SubtypeCarousel({ subtypes }: { subtypes: SubtypeProps[] }) {
  return (
    <section className="py-16 bg-secondary-light overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900">
          Shop by Craft
        </h2>
        <p className="text-primary-700 mt-2 text-lg">Explore our diverse weaves and distinct styles.</p>
      </div>
      
      <div className="flex overflow-x-auto pb-8 pt-4 px-4 md:px-6 gap-6 snap-x snap-mandatory scrollbar-hide">
        {subtypes.map((subtype) => {
          const isHandloom = subtype.type.name === 'Handloom';
          const imgUrl = isHandloom ? '/images/handloom_tile.png' : '/images/powerloom_tile.png';
          
          return (
            <Link 
              key={subtype.id}
              href={`/${subtype.type.name.toLowerCase()}/${subtype.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="snap-start shrink-0 w-[280px] md:w-[320px] group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square relative w-full">
                <Image
                  src={imgUrl}
                  alt={subtype.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary-DEFAULT mb-2 block">
                    {subtype.type.name}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white line-clamp-2">
                    {subtype.name}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
