import Layout from "@/components/Layout";
import { Wifi, Wind, Tv, Coffee, Bath, Snowflake } from "lucide-react";
import hotelQuarto from "@/assets/hotel-quarto.jpeg";
import hotelBanheiro from "@/assets/hotel-banheiro.jpeg";
import hotelCorredor from "@/assets/hotel-corredor.jpeg";

const rooms = [
  {
    name: "Quarto Individual Deluxe",
    beds: "1 cama de solteiro",
    size: "",
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheiro privativo", "Mesa de trabalho", "Guarda-roupa"],
    highlight: false,
  },
  {
    name: "Quarto Deluxe com 2 Camas",
    beds: "2 camas de solteiro",
    size: "16 m²",
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheiro privativo"],
    highlight: false,
  },
  {
    name: "Quarto Deluxe Casal",
    beds: "1 cama de casal",
    size: "50 m²",
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheira", "Hidromassagem", "Banheiro privativo"],
    highlight: true,
  },
  {
    name: "Quarto Triplo Deluxe",
    beds: "1 solteiro + 1 casal",
    size: "",
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheiro privativo"],
    highlight: false,
  },
  {
    name: "Quarto Triplo Luxo",
    beds: "3 hóspedes",
    size: "20 m²",
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheiro privativo"],
    highlight: false,
  },
  {
    name: "Quarto Quádruplo Deluxe",
    beds: "4 hóspedes",
    size: "",
    amenities: ["Wi-Fi", "Ar-condicionado", "TV tela plana", "Frigobar", "Banheiro privativo"],
    highlight: false,
  },
];

const Quartos = () => (
  <Layout>
    {/* Hero */}
    <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center overflow-hidden">
      <img src={hotelCorredor} alt="Corredor do hotel" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/70" />
      <div className="relative z-10 text-center px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3">
          Nossas Acomodações
        </h1>
        <p className="text-white/85 text-lg max-w-xl mx-auto">
          Conforto e temática amazônica em cada detalhe
        </p>
      </div>
    </section>

    {/* Intro */}
    <section className="py-12 bg-warm">
      <div className="container max-w-3xl text-center">
        <p className="text-muted-foreground leading-relaxed">
          Cada quarto é um convite ao relaxamento, com decoração inspirada na fauna e flora da Amazônia. 
          Acomodações espaçosas, climatizadas e equipadas com aquecimento de água solar, frigobar e banheiro privativo.
          Todos os quartos incluem <strong className="text-foreground">café da manhã regional</strong>.
        </p>
      </div>
    </section>

    {/* Gallery */}
    <section className="py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <img src={hotelQuarto} alt="Quarto" className="rounded-lg shadow-md w-full h-56 object-cover" />
          <img src={hotelBanheiro} alt="Banheiro" className="rounded-lg shadow-md w-full h-56 object-cover" />
          <img src={hotelCorredor} alt="Corredor" className="rounded-lg shadow-md w-full h-56 object-cover" />
        </div>
      </div>
    </section>

    {/* Rooms Grid */}
    <section className="pb-16">
      <div className="container">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Tipos de Quartos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.name}
              className={`rounded-lg border p-6 transition-shadow hover:shadow-lg ${
                room.highlight ? "border-primary bg-primary/5" : "bg-card"
              }`}
            >
              {room.highlight && (
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                  ★ Destaque
                </span>
              )}
              <h3 className="font-display text-lg font-semibold mb-1">{room.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{room.beds}</p>
              {room.size && <p className="text-sm text-accent font-medium mb-3">{room.size}</p>}
              <ul className="space-y-1 mt-3">
                {room.amenities.map((a) => (
                  <li key={a} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/5594992854456"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block text-center bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Reservar
              </a>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-8">
          * Preços são referência e podem variar conforme temporada. Nenhum quarto possui cofre.
        </p>
      </div>
    </section>
  </Layout>
);

export default Quartos;
