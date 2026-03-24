import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
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
  {
    category: "Gastronomia",
    icon: UtensilsCrossed,
    items: [
      "Espetos — barzinho com espetinhos e cerveja",
      "Container — restaurante à la carte, picanha na chapa",
      "Pizza Prime — melhor pizzaria da cidade (2km)",
    ],
  },
  {
    category: "Serviços Essenciais",
    icon: Landmark,
    items: [
      "Postos de combustível",
      "Bancos: Banpará, BASA, CCREDI",
      "Cartório de Registro",
    ],
  },
  {
    category: "Lazer e Natureza",
    icon: TreePine,
    items: [
      "Praça e Feira do Produtor Rural",
      "Clubes aquáticos",
      "Clube de águas naturais (17km)",
      "Serra Pelada",
      "Parque Nacional de Carajás",
    ],
  },
];

const Estrutura = () => (
  <Layout>
    <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center overflow-hidden">
      <img src={hotelLobby} alt="Lobby" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/70" />
      <div className="relative z-10 text-center px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3">
          Sua Experiência Completa
        </h1>
        <p className="text-white/85 text-lg">Estrutura completa com inspiração amazônica</p>
      </div>
    </section>

    <section className="py-16 bg-warm">
      <div className="container">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Comodidades do Hotel</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities.map((a) => (
            <div key={a.label} className="flex items-center gap-3 bg-card rounded-lg p-4 shadow-sm">
              <a.icon className="w-5 h-5 text-secondary shrink-0" />
              <span className="text-sm font-medium">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-3">
        <img src={hotelFachada2} alt="Fachada do Hotel" className="rounded-lg shadow-md w-full h-56 object-cover col-span-2" />
        <img src={hotelRecepcao} alt="Recepção" className="rounded-lg shadow-md w-full h-56 object-cover" />
        <img src={hotelCafeArea} alt="Área do Café" className="rounded-lg shadow-md w-full h-56 object-cover" />
        <img src={hotelHallAmazonia} alt="Hall com quadro amazônico" className="rounded-lg shadow-md w-full h-56 object-cover" />
        <img src={hotelMataAtlantica} alt="Decoração Mata Atlântica" className="rounded-lg shadow-md w-full h-56 object-cover" />
        <img src={hotelRestaurante2} alt="Restaurante" className="rounded-lg shadow-md w-full h-56 object-cover" />
        <img src={hotelEscada} alt="Escadaria" className="rounded-lg shadow-md w-full h-56 object-cover" />
      </div>
    </section>

    <section className="py-16 bg-warm">
      <div className="container">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Proximidades e Pontos de Interesse</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {nearby.map((cat) => (
            <div key={cat.category} className="bg-card rounded-lg p-6 shadow-sm">
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
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-secondary text-secondary-foreground">
      <div className="container text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Serviços Anexos ao Hotel</h2>
        <p className="max-w-2xl mx-auto text-secondary-foreground/80 mb-6">
          O Gaivota Hotel conta com o <strong>Supermercado Gaivota</strong> e a <strong>Lanchonete Gaivota</strong> anexos 
          ao hotel, além de um <strong>Correspondente Bradesco Express</strong> para sua conveniência bancária.
        </p>
        <p className="text-secondary-foreground/70 text-sm">
          Tudo o que você precisa, sem sair do hotel.
        </p>
      </div>
    </section>

    <ReviewsCarousel />
  </Layout>
);

export default Estrutura;
