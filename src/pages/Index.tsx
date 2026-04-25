import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Leaf, MapPin, Heart, Coffee, ArrowRight, ExternalLink } from "lucide-react";
import { ReviewsFull, PublicReviewForm } from "@/components/ReviewsSection";
import { GalleryProvider, ClickableImage } from "@/components/GalleryProvider";
import { WHATSAPP_URL } from "@/lib/constants";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import HistorySection from "@/components/HistorySection";
import { supabase } from "@/integrations/supabase/client";
import hotelFachada from "@/assets/hotel-fachada.png";
import hotelLobby from "@/assets/hotel-lobby.png";
import hotelCafeManha2 from "@/assets/hotel-cafe-manha.png";
import hotelQuarto from "@/assets/hotel-quarto.png";
import hotelCafeArea from "@/assets/hotel-cafe-area.png";
import hotelMataAtlantica from "@/assets/hotel-mata-atlantica.png";

const allImages = [
  { src: hotelFachada, alt: "Fachada do Gaivota Hotel" },
  { src: hotelLobby, alt: "Lobby do Hotel" },
  { src: hotelMataAtlantica, alt: "Decoracao Mata Atlantica" },
  { src: hotelCafeManha2, alt: "Cafe da Manha Regional" },
  { src: hotelCafeArea, alt: "Area do Cafe" },
  { src: hotelQuarto, alt: "Quarto do Hotel" },
];

interface Banner {
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
}

const Index = () => {
  const { t } = useTranslation();
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    supabase
      .from("banners")
      .select("title, subtitle, image_url, cta_text, cta_url")
      .eq("page", "home")
      .eq("is_active", true)
      .order("display_order")
      .limit(1)
      .then(({ data }) => { if (data && data.length > 0) setBanner(data[0]); });
  }, []);

  const heroImage = banner?.image_url || hotelFachada;
  const heroTitle = banner?.title || t("home.heroTitle");
  const heroSubtitle = banner?.subtitle || t("home.heroSubtitle");

  const highlights = [
    { icon: Leaf, title: t("home.highlightAmazonica"), desc: t("home.highlightAmazonicaDesc") },
    { icon: MapPin, title: t("home.highlightLocalizacao"), desc: t("home.highlightLocalizacaoDesc") },
    { icon: Heart, title: t("home.highlightConforto"), desc: t("home.highlightConfortoDesc") },
    { icon: Coffee, title: t("home.highlightCafe"), desc: t("home.highlightCafeDesc") },
  ];

  return (
    <Layout>
      <GalleryProvider images={allImages}>
        {({ openLightbox }) => (
          <>
            {/* Hero */}
            <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
              <img src={heroImage} alt="Fachada do Gaivota Hotel" className="absolute inset-0 w-full h-full object-cover cursor-pointer" onClick={() => !banner?.image_url && openLightbox(0)} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hero-overlay)" }} />
              <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white text-shadow-hero mb-4 animate-fade-in-up">{heroTitle}</h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 font-light animate-fade-in-up" style={{ animationDelay: "0.2s" }}>{heroSubtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cta-pulse bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold text-lg">{t("home.ctaReserva")}</a>
                  <Link to="/quartos" className="cta-pulse border-2 border-white text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-white/10">{t("home.ctaQuartos")}</Link>
                  {banner?.cta_text && banner?.cta_url && (
                    <a href={banner.cta_url} target="_blank" rel="noopener noreferrer" className="cta-pulse bg-secondary text-secondary-foreground px-8 py-3 rounded-md font-semibold text-lg">{banner.cta_text}</a>
                  )}
                </div>
              </div>
            </section>

            {/* Highlights */}
            <section className="py-16 md:py-24 bg-warm">
              <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {highlights.map((item, i) => (
                    <ScrollReveal key={i} delay={i * 0.1} direction="up">
                      <div className="text-center group">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
                          <item.icon className="w-7 h-7 text-secondary" />
                        </div>
                        <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* About */}
            <section className="py-16 md:py-24">
              <div className="container">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <ScrollReveal direction="left">
                    <span className="text-accent font-semibold text-sm uppercase tracking-widest">{t("home.sobreTag")}</span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-6">{t("home.sobreTitle")}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">{t("home.sobreP1")}</p>
                    <p className="text-muted-foreground leading-relaxed mb-6">{t("home.sobreP2")}</p>
                    <Link to="/estrutura" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">{t("home.sobreLink")} <ArrowRight className="w-4 h-4" /></Link>
                  </ScrollReveal>
                  <ScrollReveal direction="right">
                    <div className="grid grid-cols-2 gap-4">
                      <ClickableImage src={hotelLobby} alt="Lobby do Hotel" className="rounded-lg shadow-lg w-full h-48 object-cover img-hover" allImages={allImages} index={1} onClick={openLightbox} />
                      <ClickableImage src={hotelMataAtlantica} alt="Decoracao Mata Atlantica" className="rounded-lg shadow-lg w-full h-48 object-cover mt-8 img-hover" allImages={allImages} index={2} onClick={openLightbox} />
                      <ClickableImage src={hotelCafeManha2} alt="Cafe da Manha Regional" className="rounded-lg shadow-lg w-full h-48 object-cover img-hover" allImages={allImages} index={3} onClick={openLightbox} />
                      <ClickableImage src={hotelCafeArea} alt="Area do Cafe" className="rounded-lg shadow-lg w-full h-48 object-cover mt-8 img-hover" allImages={allImages} index={4} onClick={openLightbox} />
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* Rooms Preview */}
            <section className="py-16 md:py-24 bg-warm">
              <div className="container text-center">
                <ScrollReveal>
                  <span className="text-accent font-semibold text-sm uppercase tracking-widest">{t("home.acomodacoesTag")}</span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">{t("home.acomodacoesTitle")}</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{t("home.acomodacoesDesc")}</p>
                </ScrollReveal>
                <ScrollReveal delay={0.15}>
                  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <ClickableImage src={hotelQuarto} alt="Quarto do Hotel" className="rounded-lg shadow-lg w-full h-64 object-cover img-hover" allImages={allImages} index={5} onClick={openLightbox} />
                    <div className="flex flex-col justify-center text-left bg-card rounded-lg p-8 shadow-lg">
                      <h3 className="font-display text-xl font-semibold mb-3">{t("home.confortoTitle")}</h3>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        <li>checkmark {t("home.confortoItem1")}</li>
                        <li>checkmark {t("home.confortoItem2")}</li>
                        <li>checkmark {t("home.confortoItem3")}</li>
                        <li>checkmark {t("home.confortoItem4")}</li>
                      </ul>
                      <Link to="/quartos" className="cta-pulse mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold text-center">{t("home.verQuartos")}</Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </>
        )}
      </GalleryProvider>

      {/* Reviews */}
      <ReviewsFull />

      {/* Massacre de 17 de Abril */}
      <section className="py-16 md:py-24 bg-foreground text-primary-foreground">
        <div className="container max-w-4xl">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">17 de Abril de 1996</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Um Marco na Historia do Brasil</h2>
              <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">Eldorado dos Carajas foi palco de um dos episodios mais marcantes da luta por terra no Brasil.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <div className="border-l-4 border-red-600 pl-6 space-y-5">
              <p className="text-primary-foreground/85 leading-relaxed text-base">
                Em 17 de abril de 1996, as margens da PA-150, proximo a Eldorado dos Carajas, 19 trabalhadores rurais sem-terra foram mortos e dezenas ficaram feridos durante uma operacao da Policia Militar do Para. O episodio, conhecido como Massacre de Eldorado dos Carajas, chocou o Brasil e o mundo, e impulsionou o debate sobre a reforma agraria no pais.
              </p>
              <p className="text-primary-foreground/85 leading-relaxed text-base">
                O local onde ocorreu o massacre - a poucos quilometros do Gaivota Hotel - tornou-se um simbolo de resistencia e memoria. A data 17 de Abril foi declarada o Dia Internacional da Luta Camponesa pela Via Campesina. Eldorado dos Carajas carrega essa historia com responsabilidade, mantendo viva a memoria das vitimas e o compromisso com a justica social.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-8 text-center">
              <a
                href="https://pt.wikipedia.org/wiki/Massacre_de_Eldorado_dos_Caraj%C3%A1s"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground border border-primary-foreground/30 hover:border-primary-foreground/60 px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Saiba mais na Wikipedia
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* History */}
      <HistorySection />

      {/* Formulario de avaliacao publica */}
      <PublicReviewForm />

      {/* CTA */}
      <section className="py-20 bg-secondary text-secondary-foreground text-center">
        <div className="container">
          <ScrollReveal direction="scale">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("home.ctaTitle")}</h2>
            <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">{t("home.ctaDesc")}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cta-pulse inline-block bg-primary-foreground text-secondary px-8 py-4 rounded-md font-bold text-lg">{t("home.ctaWhatsapp")}</a>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;