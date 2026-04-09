import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import {
  Building2, Car, Wifi, ConciergeBell, Coffee, Clock, Sun, WashingMachine,
  UtensilsCrossed, ShoppingCart, MapPin, TreePine, Landmark
} from "lucide-react";
import hotelRecepcao from "@/assets/hotel-recepcao.png";
import hotelCafeArea from "@/assets/hotel-cafe-area.png";
import hotelLobby from "@/assets/hotel-lobby.jpeg";
import hotelEscada from "@/assets/hotel-escada.png";
import hotelHallAmazonia from "@/assets/hotel-hall-amazonia.png";
import hotelRestaurante2 from "@/assets/hotel-restaurante2.png";
import hotelMataAtlantica from "@/assets/hotel-mata-atlantica.png";
import hotelFachada2 from "@/assets/hotel-fachada2.png";
import hotelGalleryNew from "@/assets/hotel-gallery-new.png";

const galleryImages = [
  { src: hotelFachada2, alt: "Fachada do Hotel" },
  { src: hotelRecepcao, alt: "Recepção" },
  { src: hotelCafeArea, alt: "Área do Café" },
  { src: hotelHallAmazonia, alt: "Hall com quadro amazônico" },
  { src: hotelMataAtlantica, alt: "Decoração Mata Atlântica" },
  { src: hotelRestaurante2, alt: "Restaurante" },
  { src: hotelEscada, alt: "Escadaria" },
  { src: hotelGalleryNew, alt: "Hotel" },
];

const Estrutura = () => {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const amenities = [
    { icon: Building2, label: t("estrutura.amenity1") },
    { icon: Car, label: t("estrutura.amenity2") },
    { icon: Wifi, label: t("estrutura.amenity3") },
    { icon: ConciergeBell, label: t("estrutura.amenity4") },
    { icon: Coffee, label: t("estrutura.amenity5") },
    { icon: Clock, label: t("estrutura.amenity6") },
    { icon: Sun, label: t("estrutura.amenity7") },
    { icon: WashingMachine, label: t("estrutura.amenity8") },
    { icon: UtensilsCrossed, label: t("estrutura.amenity9") },
    { icon: ShoppingCart, label: t("estrutura.amenity10") },
    { icon: Landmark, label: t("estrutura.amenity11") },
  ];

  const nearby = [
    {
      category: t("estrutura.catGastronomia"), icon: UtensilsCrossed,
      items: [t("estrutura.gastro1"), t("estrutura.gastro2"), t("estrutura.gastro3")],
    },
    {
      category: t("estrutura.catServicos"), icon: Landmark,
      items: [t("estrutura.servicos1"), t("estrutura.servicos2"), t("estrutura.servicos3")],
    },
    {
      category: t("estrutura.catLazer"), icon: TreePine,
      items: [t("estrutura.lazer1"), t("estrutura.lazer2"), t("estrutura.lazer3"), t("estrutura.lazer4"), t("estrutura.lazer5")],
    },
  ];

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img src={hotelLobby} alt="Lobby" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3 animate-fade-in-up">{t("estrutura.heroTitle")}</h1>
          <p className="text-white/85 text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>{t("estrutura.heroSubtitle")}</p>
        </div>
      </section>

      <section className="py-16 bg-warm">
        <div className="container">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">{t("estrutura.comodidadesTitle")}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities.map((a, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="flex items-center gap-3 bg-card rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <a.icon className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-sm font-medium">{a.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryImages.map((img, i) => (
            <ScrollReveal key={img.alt} delay={i * 0.06} direction="scale">
              <img
                src={img.src}
                alt={img.alt}
                className={`rounded-lg shadow-md w-full h-56 object-cover cursor-pointer img-hover ${i === 0 ? "col-span-2" : ""}`}
                onClick={() => setLightboxIndex(i)}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-16 bg-warm">
        <div className="container">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">{t("estrutura.proximidadesTitle")}</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {nearby.map((cat, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="up">
                <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <cat.icon className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-lg font-semibold">{cat.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {cat.items.map((item, ii) => (
                      <li key={ii} className="text-sm text-muted-foreground flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container text-center">
          <ScrollReveal direction="scale">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">{t("estrutura.servicosAnexosTitle")}</h2>
            <p className="max-w-2xl mx-auto text-secondary-foreground/80 mb-6" dangerouslySetInnerHTML={{ __html: t("estrutura.servicosAnexosDesc") }} />
            <p className="text-secondary-foreground/70 text-sm">{t("estrutura.servicosAnexosFoot")}</p>
          </ScrollReveal>
        </div>
      </section>

      <ReviewsCarousel />

      {lightboxIndex !== null && (
        <ImageLightbox images={galleryImages} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </Layout>
  );
};

export default Estrutura;
