import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Leaf, MapPin, Heart, Coffee, ArrowRight } from "lucide-react";
import { ReviewsFull } from "@/components/ReviewsSection";
import { GalleryProvider, ClickableImage } from "@/components/GalleryProvider";
import { WHATSAPP_URL } from "@/lib/constants";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import HistorySection from "@/components/HistorySection";
import hotelFachada from "@/assets/hotel-fachada.png";
import hotelLobby from "@/assets/hotel-lobby.png";
import hotelCafeManha2 from "@/assets/hotel-cafe-manha.png";
import hotelQuarto from "@/assets/hotel-quarto.png";
import hotelCafeArea from "@/assets/hotel-cafe-area.png";
import hotelMataAtlantica from "@/assets/hotel-mata-atlantica.png";

const allImages = [
  { src: hotelFachada, alt: "Fachada do Gaivota Hotel" },
  { src: hotelLobby, alt: "Lobby do Hotel" },
  { src: hotelMataAtlantica, alt: "Decoração Mata Atlântica" },
  { src: hotelCafeManha2, alt: "Café da Manhã Regional" },
  { src: hotelCafeArea, alt: "Área do Café" },
  { src: hotelQuarto, alt: "Quarto do Hotel" },
];

const Index = () => {
  const { t } = useTranslation();

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
              <img src={hotelFachada} alt="Fachada do Gaivota Hotel" className="absolute inset-0 w-full h-full object-cover cursor-pointer" onClick={() => openLightbox(0)} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hero-overlay)" }} />
              <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white text-shadow-hero mb-4 animate-fade-in-up">
                  {t("home.heroTitle")}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 font-light animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  {t("home.heroSubtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cta-pulse bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold text-lg">
                    {t("home.ctaReserva")}
                  </a>
                  <Link to="/quartos" className="cta-pulse border-2 border-white text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-white/10">
                    {t("home.ctaQuartos")}
                  </Link>
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
                    <Link to="/estrutura" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                      {t("home.sobreLink")} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </ScrollReveal>
                  <ScrollReveal direction="right">
                    <div className="grid grid-cols-2 gap-4">
                      <ClickableImage src={hotelLobby} alt="Lobby do Hotel" className="rounded-lg shadow-lg w-full h-48 object-cover img-hover" allImages={allImages} index={1} onClick={openLightbox} />
                      <ClickableImage src={hotelMataAtlantica} alt="Decoração Mata Atlântica" className="rounded-lg shadow-lg w-full h-48 object-cover mt-8 img-hover" allImages={allImages} index={2} onClick={openLightbox} />
                      <ClickableImage src={hotelCafeManha2} alt="Café da Manhã Regional" className="rounded-lg shadow-lg w-full h-48 object-cover img-hover" allImages={allImages} index={3} onClick={openLightbox} />
                      <ClickableImage src={hotelCafeArea} alt="Área do Café" className="rounded-lg shadow-lg w-full h-48 object-cover mt-8 img-hover" allImages={allImages} index={4} onClick={openLightbox} />
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
                        <li>✓ {t("home.confortoItem1")}</li>
                        <li>✓ {t("home.confortoItem2")}</li>
                        <li>✓ {t("home.confortoItem3")}</li>
                        <li>✓ {t("home.confortoItem4")}</li>
                      </ul>
                      <Link to="/quartos" className="cta-pulse mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold text-center">
                        {t("home.verQuartos")}
                      </Link>
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

      {/* History */}
      <HistorySection />

      {/* CTA */}
      <section className="py-20 bg-secondary text-secondary-foreground text-center">
        <div className="container">
          <ScrollReveal direction="scale">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("home.ctaTitle")}</h2>
            <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">{t("home.ctaDesc")}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cta-pulse inline-block bg-primary-foreground text-secondary px-8 py-4 rounded-md font-bold text-lg">
              {t("home.ctaWhatsapp")}
            </a>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
