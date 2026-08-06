import ProductCard, { ProductProps } from "./ProductCard";

interface ProductGridProps {
  title: string;
  description?: string;
  products: ProductProps[];
}

export default function ProductGrid({ title, description, products }: ProductGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-primary-700 max-w-2xl text-lg">{description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
