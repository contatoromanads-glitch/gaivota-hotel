import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  guest_name: string;
  source: string;
  rating: number;
  text: string;
}

const fallbackReviews: Review[] = [
  { id: "1", guest_name: "Geovane", source: "Tripadvisor", rating: 5, text: "De todos os Hotéis de Eldorado este com certeza e o melhor, não deixa a desejar em nada." },
  { id: "2", guest_name: "Zé Raimundo", source: "Google", rating: 5, text: "Um excelente hotel com preço bastante justo... e excelente café da manhã..." },
  { id: "3", guest_name: "Carlos Matias", source: "Google", rating: 5, text: "Ambiente limpo e confortável e um bom café da manhã. Não tem como não recomendar!" },
];

const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, guest_name, source, rating, text")
      .eq("is_visible", true)
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) setReviews(data);
      });
  }, []);

  return reviews;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-card rounded-lg border p-6 shadow-sm flex flex-col h-full">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
          {review.guest_name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{review.guest_name}</p>
          <p className="text-xs text-muted-foreground">{review.source}</p>
        </div>
      </div>
      <span className="text-lg font-bold text-primary">{review.rating}/5</span>
    </div>
    <StarRating rating={review.rating} />
    <p className="text-muted-foreground text-sm leading-relaxed mt-3 flex-1">"{review.text}"</p>
  </div>
);

/** Full section for Home page */
export const ReviewsFull = () => {
  const reviews = useReviews();

  return (
    <section className="py-16 md:py-24 bg-warm">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Avaliações</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            O Que Nossos Hóspedes Dizem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Avaliações reais de quem já se hospedou no Gaivota Hotel.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={r.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/** Compact carousel for other pages */
export const ReviewsCarousel = () => {
  const reviews = useReviews();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % reviews.length), 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent((c) => (c + 1) % reviews.length);

  if (reviews.length === 0) return null;
  const review = reviews[current % reviews.length];

  return (
    <section className="py-10 bg-warm">
      <div className="container max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">Avaliações de Hóspedes</h3>
          <div className="flex gap-2">
            <button onClick={prev} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-card transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-card transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
                {review.guest_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{review.guest_name}</p>
                <p className="text-xs text-muted-foreground">{review.source}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-primary">{review.rating}/5</span>
          </div>
          <StarRating rating={review.rating} />
          <p className="text-muted-foreground text-sm leading-relaxed mt-3">"{review.text}"</p>
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
