import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Star, ChevronLeft, ChevronRight, Send, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { toast } from "sonner";

interface Review {
  id: string;
  guest_name: string;
  source: string;
  rating: number;
  text: string;
}

const fallbackReviews: Review[] = [
  { id: "1", guest_name: "Geovane", source: "Tripadvisor", rating: 5, text: "De todos os Hoteis de Eldorado este com certeza e o melhor, nao deixa a desejar em nada." },
  { id: "2", guest_name: "Ze Raimundo", source: "Google", rating: 5, text: "Um excelente hotel com preco bastante justo... e excelente cafe da manha..." },
  { id: "3", guest_name: "Carlos Matias", source: "Google", rating: 5, text: "Ambiente limpo e confortavel e um bom cafe da manha. Nao tem como nao recomendar!" },
];

const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, guest_name, source, rating, text")
      .eq("is_visible", true)
      .order("display_order")
      .then(({ data }) => { if (data && data.length > 0) setReviews(data); });
  }, []);
  return reviews;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={"w-4 h-4 " + (i < rating ? "fill-accent text-accent" : "text-muted-foreground/30")} />
    ))}
  </div>
);

const ReviewCard = ({ review, translatedText }: { review: Review; translatedText: string }) => (
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
    <p className="text-muted-foreground text-sm leading-relaxed mt-3 flex-1">"{translatedText}"</p>
  </div>
);

export const ReviewsFull = () => {
  const reviews = useReviews();
  const { t } = useTranslation();
  const translatedTexts = useTranslatedContent(reviews.map((r) => r.text));

  return (
    <section className="py-16 md:py-24 bg-warm">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">{t("reviews.tag")}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">{t("reviews.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("reviews.desc")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={r.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: i * 0.08 + "s" }}>
              <ReviewCard review={r} translatedText={translatedTexts[i] || r.text} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ReviewsCarousel = () => {
  const reviews = useReviews();
  const { t } = useTranslation();
  const translatedTexts = useTranslatedContent(reviews.map((r) => r.text));
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
          <h3 className="font-display text-lg font-semibold">{t("reviews.carouselTitle")}</h3>
          <div className="flex gap-2">
            <button onClick={prev} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-card transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={next} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-card transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">{review.guest_name.charAt(0)}</div>
              <div><p className="font-semibold text-sm">{review.guest_name}</p><p className="text-xs text-muted-foreground">{review.source}</p></div>
            </div>
            <span className="text-lg font-bold text-primary">{review.rating}/5</span>
          </div>
          <StarRating rating={review.rating} />
          <p className="text-muted-foreground text-sm leading-relaxed mt-3">"{translatedTexts[current % reviews.length] || review.text}"</p>
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={"w-2 h-2 rounded-full transition-colors " + (i === current ? "bg-primary" : "bg-muted-foreground/30")} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const PublicReviewForm = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) { toast.error("Por favor, preencha nome e depoimento."); return; }
    if (text.trim().length < 20) { toast.error("O depoimento deve ter pelo menos 20 caracteres."); return; }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      guest_name: name.trim(),
      source: "Site Gaivota",
      rating,
      text: text.trim(),
      is_visible: false,
      display_order: 0,
      status: "pending",
    } as any);
    setSubmitting(false);
    if (error) { toast.error("Erro ao enviar avaliacao: " + error.message); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-16 bg-warm">
        <div className="container max-w-lg text-center">
          <div className="bg-card border rounded-2xl p-10 shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold mb-3">Obrigado pela sua avaliacao!</h3>
            <p className="text-muted-foreground leading-relaxed">Sua avaliacao foi enviada e sera analisada pela nossa equipe antes de ser publicada no site. Agradecemos por compartilhar sua experiencia no Gaivota Hotel!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-warm">
      <div className="container max-w-lg">
        <div className="text-center mb-8">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Sua Experiencia</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-2">Avalie sua estadia</h2>
          <p className="text-muted-foreground text-sm">Compartilhe sua experiencia. Sua avaliacao sera publicada apos aprovacao da nossa equipe.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
          <div>
            <label className="text-sm font-semibold block mb-1">Seu nome *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="Como prefere ser identificado?" required />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">Sua nota *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star className={"w-7 h-7 transition-colors " + (star <= (hoverRating || rating) ? "fill-accent text-accent" : "text-muted-foreground/30")} />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center">{rating === 5 ? "Otimo!" : rating === 4 ? "Bom!" : rating === 3 ? "Regular" : rating === 2 ? "Ruim" : "Pessimo"}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Seu depoimento * <span className="text-xs font-normal text-muted-foreground">(minimo 20 caracteres)</span></label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full px-3 py-2.5 rounded-md border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="Conte como foi sua experiencia no Gaivota Hotel..." required />
            <p className="text-xs text-muted-foreground mt-1">{text.length} / minimo 20 caracteres</p>
          </div>
          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? "Enviando..." : "Enviar avaliacao"}
          </button>
          <p className="text-xs text-muted-foreground text-center">Sua avaliacao sera revisada pela nossa equipe antes de ser publicada.</p>
        </form>
      </div>
    </section>
  );
};