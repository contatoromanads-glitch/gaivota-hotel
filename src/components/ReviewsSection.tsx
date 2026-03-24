import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Geovane",
    source: "Tripadvisor",
    rating: 5,
    text: "De todos os Hotéis de Eldorado este com certeza e o melhor, não deixa a desejar em nada. Bem localizado, oferece estacionamento grátis com suítes de luxos maravilhosas, um hotel novo porém muito útil pra quem procura conforto.",
    time: "Tripadvisor",
  },
  {
    name: "Zé Raimundo",
    source: "Google",
    rating: 5,
    text: "Um excelente hotel com preço bastante justo... e excelente café da manhã... gostei da divisão dos quartos, ao invés de números, são vários animais da Amazônia... fiquei no quarto da Anta... a Internet do hotel é ótima... camas confortáveis e um banheiro adequado.",
    time: "Google",
  },
  {
    name: "Olacir Carvalho",
    source: "Google",
    rating: 4,
    text: "Quartos completos bem confortáveis, ótimo café da manhã, é uma boa pedida para quem estiver na região...",
    time: "Google",
  },
  {
    name: "Adriano Xavier Santos",
    source: "Google",
    rating: 5,
    text: "Um dos melhores hotel da região se não for o melhor, está de parabéns o hotel. O café da manhã é muito bom e farto, quartos limpos, banheiro impecável.",
    time: "Google",
  },
  {
    name: "Divino Eterno da Silva",
    source: "Google",
    rating: 5,
    text: "Tudo muito bom, café da manhã nota dez, tudo de bom.",
    time: "Google",
  },
  {
    name: "Carlos Matias",
    source: "Google",
    rating: 5,
    text: "Mesa com cadeira para trabalho com notebook, ar, frigobar e internet boa. Ambiente limpo e confortável e um bom café da manhã. Não tem como não recomendar!",
    time: "Google",
  },
  {
    name: "Servant Armando",
    source: "Google",
    rating: 4,
    text: "Ótimas acomodações, enxoval de cama muito limpo e higienizado e um preço que vale a pena pagar com o complemento do café da manhã que é de bom para mais.",
    time: "Google",
  },
  {
    name: "Victor Hugo Gomes Valente",
    source: "Google",
    rating: 4,
    text: "Pelo preço foi um excelente custo benefício.",
    time: "Google",
  },
  {
    name: "Luciana Martins",
    source: "Google",
    rating: 5,
    text: "Ótimo hotel para interior, é limpo, bem localizado e seguro.",
    time: "Google",
  },
];

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

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
  <div className="bg-card rounded-lg border p-6 shadow-sm flex flex-col h-full">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{review.name}</p>
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
export const ReviewsFull = () => (
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
          <div key={r.name} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
            <ReviewCard review={r} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

/** Compact carousel for other pages */
export const ReviewsCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % reviews.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent((c) => (c + 1) % reviews.length);

  const review = reviews[current];

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
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{review.name}</p>
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
