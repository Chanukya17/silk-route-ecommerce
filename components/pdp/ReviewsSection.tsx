import { Star, ThumbsUp } from "lucide-react";

export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: "Priya S.",
      rating: 5,
      date: "October 12, 2025",
      title: "Absolutely stunning!",
      content: "The quality of the silk is amazing. It drapes beautifully and the zari work is intricate and authentic. Very happy with this purchase.",
      helpful: 12
    },
    {
      id: 2,
      name: "Anjali M.",
      rating: 4,
      date: "September 28, 2025",
      title: "Beautiful color, slightly heavy",
      content: "The color is exactly as shown in the pictures. It is a bit heavy to wear for long hours, but that's expected of genuine handloom Kanjivaram. Worth it!",
      helpful: 5
    }
  ];

  return (
    <div className="mt-16 pt-12 border-t border-secondary/40">
      <h3 className="font-display text-3xl font-bold text-primary-900 mb-8">Customer Reviews</h3>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Summary */}
        <div className="md:col-span-1 bg-secondary-light p-6 rounded-2xl h-fit">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-primary-900">4.8</span>
            <span className="text-primary-600">/ 5</span>
          </div>
          <div className="flex text-yellow-500 mb-4">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current opacity-50" />
          </div>
          <p className="text-sm text-primary-700">Based on 24 reviews</p>
        </div>

        {/* List */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-secondary/30 pb-6 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-semibold text-primary-900 ml-2">{review.title}</span>
              </div>
              <p className="text-sm text-primary-600 mb-3">{review.name} on {review.date}</p>
              <p className="text-primary-800 leading-relaxed mb-4">{review.content}</p>
              <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-accent transition-colors">
                <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpful})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
