import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Leaf, MapPin, Heart, Coffee, ArrowRight } from "lucide-react";
import hotelFachada from "@/assets/hotel-fachada2.jpeg";
import hotelLobby from "@/assets/hotel-lobby.jpeg";
import hotelCafeManha from "@/assets/hotel-cafe-manha.jpeg";
import hotelCafeManha2 from "@/assets/hotel-cafe-manha2.jpeg";
import hotelQuarto from "@/assets/hotel-quarto.jpeg";
import hotelCafeArea from "@/assets/hotel-cafe-area.jpeg";
import hotelRestaurante from "@/assets/hotel-restaurante.jpeg";
import hotelMataAtlantica from "@/assets/hotel-mata-atlantica.jpeg";

const highlights = [
  { icon: Leaf, title: "Experiência Amazônica", desc: "Decoração e ambiente inspirados na riqueza da fauna e flora local." },
  { icon: MapPin, title: "Localização Privilegiada", desc: "No centro de Eldorado dos Carajás, próximo a tudo que você precisa." },
  { icon: Heart, title: "Conforto e Aconchego", desc: "46 apartamentos climatizados com toda a infraestrutura para seu descanso." },
  { icon: Coffee, title: "Café da Manhã Regional", desc: "Buffet incluso com sabores autênticos da culinária paraense." },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img src={hotelFachada} alt="Fachada do Gaivota Hotel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white text-shadow-hero mb-4 animate-fade-in-up">
            Seu Refúgio Amazônico em Eldorado dos Carajás
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-light animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Conforto, natureza e hospitalidade no coração da Amazônia Paraense.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a
              href="https://wa.me/5594992854456"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold text-lg hover:bg-primary/90 transition-colors"
            >
              Faça sua Reserva
            </a>
            <Link
              to="/quartos"
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Ver Quartos
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-24 bg-warm">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item) => (
              <div key={item.title} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 group-hover:bg-secondary/20 transition-colors">
                  <item.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">Sobre o Hotel</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-6">
                Um Oásis de Tranquilidade no Coração do Pará
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                O Gaivota Hotel é mais do que uma hospedagem — é uma experiência autêntica da Amazônia paraense. 
                Com uma estrutura cuidadosamente planejada, nossos ambientes remetem à beleza natural da região, 
                criando uma atmosfera acolhedora e única.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Oferecemos 46 apartamentos climatizados, estacionamento coberto, café da manhã regional incluso 
                e uma equipe dedicada ao seu bem-estar. Unimos a hospitalidade paraense ao conforto moderno 
                para que sua estadia seja inesquecível.
              </p>
              <Link
                to="/estrutura"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Conheça nossa estrutura <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={hotelLobby} alt="Lobby do Hotel" className="rounded-lg shadow-lg w-full h-48 object-cover" />
              <img src={hotelMataAtlantica} alt="Decoração Mata Atlântica" className="rounded-lg shadow-lg w-full h-48 object-cover mt-8" />
              <img src={hotelCafeManha2} alt="Café da Manhã Regional" className="rounded-lg shadow-lg w-full h-48 object-cover" />
              <img src={hotelCafeArea} alt="Área do Café" className="rounded-lg shadow-lg w-full h-48 object-cover mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Preview */}
      <section className="py-16 md:py-24 bg-warm">
        <div className="container text-center">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Acomodações</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            Quartos com Temática Amazônica
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Cada quarto é um convite ao relaxamento, com decoração inspirada na fauna e flora da Amazônia.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <img src={hotelQuarto} alt="Quarto do Hotel" className="rounded-lg shadow-lg w-full h-64 object-cover" />
            <div className="flex flex-col justify-center text-left bg-card rounded-lg p-8 shadow-lg">
              <h3 className="font-display text-xl font-semibold mb-3">Conforto em Cada Detalhe</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>✓ Ar-condicionado e aquecimento solar</li>
                <li>✓ TV de tela plana e Wi-Fi gratuito</li>
                <li>✓ Frigobar e banheiro privativo</li>
                <li>✓ Café da manhã regional incluso</li>
              </ul>
              <Link
                to="/quartos"
                className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold text-center hover:bg-primary/90 transition-colors"
              >
                Ver Todos os Quartos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary text-secondary-foreground text-center">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Reserve Agora e Viva a Amazônia
          </h2>
          <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
            Entre em contato pelo WhatsApp e garanta sua hospedagem no Gaivota Hotel.
          </p>
          <a
            href="https://wa.me/5594992854456"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-foreground text-secondary px-8 py-4 rounded-md font-bold text-lg hover:bg-primary-foreground/90 transition-colors"
          >
            (94) 99285-4456 — WhatsApp
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
