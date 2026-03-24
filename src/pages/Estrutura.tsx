import { useState } from "react";
import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import {
  Building2, Car, Wifi, ConciergeBell, Coffee, Clock, Sun, WashingMachine,
  UtensilsCrossed, ShoppingCart, MapPin, TreePine, Landmark
} from "lucide-react";
import hotelRecepcao from "@/assets/hotel-recepcao.jpeg";
import hotelCafeArea from "@/assets/hotel-cafe-area.jpeg";
import hotelLobby from "@/assets/hotel-lobby.jpeg";
import hotelEscada from "@/assets/hotel-escada.jpeg";
import hotelHallAmazonia from "@/assets/hotel-hall-amazonia.jpeg";
import hotelRestaurante2 from "@/assets/hotel-restaurante2.jpeg";
import hotelMataAtlantica from "@/assets/hotel-mata-atlantica.jpeg";
import hotelFachada2 from "@/assets/hotel-fachada2.jpeg";

const amenities = [
  { icon: Building2, label: "46 Apartamentos" },
  { icon: Car, label: "Estacionamento Coberto (30 vagas)" },
  { icon: Wifi, label: "Wi-Fi Gratuito" },
  { icon: ConciergeBell, label: "Serviço de Quarto" },
  { icon: Coffee, label: "Café da Manhã Buffet (incluso)" },
  { icon: Clock, label: "Recepção 24 Horas" },
  { icon: Sun, label: "Energia Solar" },
  { icon: WashingMachine, label: "Lavanderia (custo adicional)" },
  { icon: UtensilsCrossed, label: "Lanchonete Gaivota (anexa)" },
  { icon: ShoppingCart, label: "Supermercado Gaivota (anexo)" },
  { icon: Landmark, label: "Bradesco Express (no supermercado)" },
];

const nearby = [
  { category: "Gastronomia", icon: UtensilsCrossed, items: ["Espetos — barzinho com espetinhos e cerveja", "Container — restaurante à la carte, picanha na chapa", "Pizza Prime — melhor pizzaria da cidade (2km)"] },
  { category: "Serviços Essenciais", icon: Landmark, items: ["Postos de combustível", "Bancos: Banpará, BASA, CCREDI", "Cartório de Registro"] },
  { category: "Lazer e Natureza", icon: TreePine, items: ["Praça e Feira do Produtor Rural", "Clubes aquáticos", "Clube de águas naturais (17km)", "Serra Pelada", "Parque Nacional de Carajás"] },
];

const galleryImages = [
  { src: hotelFachada2, alt: "Fachada do Hotel" },
  { src: hotelRecepcao, alt: "Recepção" },
  { src: hotelCafeArea, alt: "Área do Café" },
  { src: hotelHallAmazonia, alt: "Hall com quadro amazônico" },
  { src: hotelMataAtlantica, alt: "Decoração Mata Atlântica" },
  { src: hotelRestaurante2, alt: "Restaurante" },
  { src: hotelEscada, alt: "Escadaria" },
];

const Estrutura = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img src={hotelLobby} alt="Lobby" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3 animate-fade-in-up">Sua Experiência Completa</h1>
          <p className="text-white/85 text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>Estrutura completa com inspiração amazônica</p>
        </div>
      </section>

      <section className="py-16 bg-warm">
        <div className="container">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Comodidades do Hotel</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities.map((a, i) => (
              <ScrollReveal key={a.label} delay={i * 0.05}>
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
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Proximidades e Pontos de Interesse</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {nearby.map((cat, i) => (
              <ScrollReveal key={cat.category} delay={i * 0.1} direction="up">
                <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <cat.icon className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-lg font-semibold">{cat.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
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
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Serviços Anexos ao Hotel</h2>
            <p className="max-w-2xl mx-auto text-secondary-foreground/80 mb-6">
              O Gaivota Hotel conta com o <strong>Supermercado Gaivota</strong> e a <strong>Lanchonete Gaivota</strong> anexos ao hotel, além de um <strong>Correspondente Bradesco Express</strong> para sua conveniência bancária.
            </p>
            <p className="text-secondary-foreground/70 text-sm">Tudo o que você precisa, sem sair do hotel.</p>
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
