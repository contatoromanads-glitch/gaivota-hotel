import Layout from "@/components/Layout";
import hotelCorredor from "@/assets/hotel-corredor.jpeg";
import hotelBanheiro from "@/assets/hotel-banheiro.jpeg";
import hotelBanheiro2 from "@/assets/hotel-banheiro2.jpeg";
import hotelQuarto from "@/assets/hotel-quarto.jpeg";
import hotelQuartoIndividual from "@/assets/hotel-quarto-individual.jpeg";
import hotelQuartoIndividual2 from "@/assets/hotel-quarto-individual2.jpeg";
import hotelQuartoIndividual3 from "@/assets/hotel-quarto-individual3.jpeg";
import hotelQuartoMutum from "@/assets/hotel-quarto-mutum.jpeg";
import hotelQuartoColeirinho from "@/assets/hotel-quarto-coleirinho.jpeg";
import hotelQuartoTamandua from "@/assets/hotel-quarto-tamandua.jpeg";
import hotelQuartoBeijaflor from "@/assets/hotel-quarto-beijaflor.jpeg";
import hotelQuartoPeixeboi from "@/assets/hotel-quarto-peixeboi.jpeg";
import hotelQuartoCasal from "@/assets/hotel-quarto-casal.jpeg";
import hotelQuartoCapivara from "@/assets/hotel-quarto-capivara.jpeg";
import hotelQuartoAnta from "@/assets/hotel-quarto-anta.jpeg";
import hotelQuartoSagui from "@/assets/hotel-quarto-sagui.jpeg";
import hotelQuartoOncaNegra from "@/assets/hotel-quarto-oncanegra.jpeg";

const rooms = [
  {
    name: "Quarto Individual Deluxe",
    beds: "1 cama de solteiro",
    size: "",
    image: hotelQuartoCapivara,
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheiro privativo", "Mesa de trabalho", "Guarda-roupa"],
    highlight: false,
  },
  {
    name: "Quarto Deluxe com 2 Camas",
    beds: "2 camas de solteiro",
    size: "16 m²",
    image: hotelQuartoSagui,
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheiro privativo"],
    highlight: false,
  },
  {
    name: "Quarto Deluxe Casal",
    beds: "1 cama de casal",
    size: "50 m²",
    image: hotelQuartoBeijaflor,
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheira", "Hidromassagem", "Banheiro privativo"],
    highlight: true,
  },
  {
    name: "Quarto Triplo Deluxe",
    beds: "1 solteiro + 1 casal",
    size: "",
    image: hotelQuartoOncaNegra,
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheiro privativo"],
    highlight: false,
  },
  {
    name: "Quarto Triplo Luxo",
    beds: "3 hóspedes",
    size: "20 m²",
    image: hotelQuartoMutum,
    amenities: ["Ar-condicionado", "TV tela plana", "Wi-Fi", "Frigobar", "Banheiro privativo"],
    highlight: false,
  },
  {
    name: "Quarto Quádruplo Deluxe",
    beds: "4 hóspedes",
    size: "",
    image: hotelQuartoAnta,
    amenities: ["Wi-Fi", "Ar-condicionado", "TV tela plana", "Frigobar", "Banheiro privativo"],
    highlight: false,
  },
];

const galleryImages = [
  { src: hotelQuarto, alt: "Quarto decorado com cisnes de toalha" },
  { src: hotelQuartoPeixeboi, alt: "Quarto Peixe-Boi" },
  { src: hotelQuartoColeirinho, alt: "Quarto Coleirinho" },
  { src: hotelQuartoTamandua, alt: "Quarto Tamanduá Bandeira" },
  { src: hotelQuartoIndividual, alt: "Quarto Individual com TV e frigobar" },
  { src: hotelQuartoIndividual2, alt: "Quarto Individual" },
  { src: hotelQuartoIndividual3, alt: "Quarto com espelho e frigobar" },
  { src: hotelQuartoCasal, alt: "Quarto de Casal" },
  { src: hotelBanheiro, alt: "Banheiro com pastilhas vermelhas" },
  { src: hotelBanheiro2, alt: "Banheiro privativo" },
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

    {/* Rooms Grid */}
    <section className="py-16">
      <div className="container">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Tipos de Quartos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.name}
              className={`rounded-lg border overflow-hidden transition-shadow hover:shadow-lg ${
                room.highlight ? "border-primary bg-primary/5" : "bg-card"
              }`}
            >
              <img src={room.image} alt={room.name} className="w-full h-52 object-cover" />
              <div className="p-6">
                {room.highlight && (
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">★ Destaque</span>
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
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-8">
          * Preços são referência e podem variar conforme temporada. Nenhum quarto possui cofre.
        </p>
      </div>
    </section>

    {/* Gallery */}
    <section className="py-16 bg-warm">
      <div className="container">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Galeria de Fotos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {galleryImages.map((img) => (
            <img
              key={img.alt}
              src={img.src}
              alt={img.alt}
              className="rounded-lg shadow-sm w-full h-40 object-cover hover:shadow-md transition-shadow"
            />
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Quartos;
