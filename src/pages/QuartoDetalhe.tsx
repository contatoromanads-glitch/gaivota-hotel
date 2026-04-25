import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_URL } from "@/lib/constants";
import { ArrowLeft, BedDouble, Maximize, CheckCircle, Phone } from "lucide-react";
import hotelCorredor from "@/assets/hotel-corredor.png";

interface Room {
  id: string;
  name: string;
  description: string | null;
  beds: string;
  size: string | null;
  amenities: string[];
  highlight: boolean | null;
  price: number | null;
  show_price: boolean;
}

interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number | null;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

const QuartoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchRoom = async () => {
      const [roomRes, imagesRes] = await Promise.all([
        supabase.from("rooms").select("*").eq("id", id).single(),
        supabase.from("room_images").select("*").eq("room_id", id).order("display_order"),
      ]);
      if (roomRes.data) {
        setRoom({ ...roomRes.data, amenities: (roomRes.data.amenities as string[]) || [], price: (roomRes.data as any).price ?? null, show_price: (roomRes.data as any).show_price ?? true });
      }
      if (imagesRes.data) setRoomImages(imagesRes.data);
      setLoading(false);
    };
    fetchRoom();
  }, [id]);

  const heroImage = roomImages.length > 0 ? roomImages[0].image_url : hotelCorredor;
  const allImages = roomImages.map((img) => ({ src: img.image_url, alt: img.alt_text || (room?.name ?? "") }));
  const whatsappMsg = encodeURIComponent("Ola! Vim do site e gostaria de fazer uma reserva para o quarto " + (room?.name ?? "") + ". Poderia me ajudar?");
  const whatsappLink = "https://wa.me/5594992854456?text=" + whatsappMsg;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse mx-auto" />
            <div className="h-6 bg-muted rounded w-48 mx-auto animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-display text-3xl font-bold mb-4">Quarto nao encontrado</h1>
            <p className="text-muted-foreground mb-6">O quarto solicitado nao existe ou foi removido.</p>
            <Link to="/quartos" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold">
              <ArrowLeft className="w-4 h-4" /> Ver todos os quartos
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[350px] flex items-end overflow-hidden">
        <img
          src={heroImage}
          alt={room.name}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          onClick={() => allImages.length > 0 && setLightboxIndex(0)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 container pb-10">
          <Link to="/quartos" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para Quartos
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              {room.highlight && <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">Destaque</span>}
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">{room.name}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                {room.beds && <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{room.beds}</span>}
                {room.size && <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{room.size}</span>}
              </div>
            </div>
            {room.show_price && room.price != null && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-white text-center">
                <p className="text-xs uppercase tracking-widest opacity-70">A partir de</p>
                <p className="font-display text-2xl font-bold">{formatPrice(room.price)}</p>
                <p className="text-xs opacity-70">por noite</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {room.description && (
                <ScrollReveal direction="up">
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4">Sobre este quarto</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{room.description}</p>
                  </div>
                </ScrollReveal>
              )}

              {room.amenities.length > 0 && (
                <ScrollReveal direction="up" delay={0.1}>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4">Comodidades</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {room.amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2 bg-warm rounded-lg p-3">
                          <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                          <span className="text-sm font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {allImages.length > 1 && (
                <ScrollReveal direction="up" delay={0.2}>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4">Galeria</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {allImages.map((img, i) => (
                        <img
                          key={i}
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-40 object-cover rounded-lg shadow-sm cursor-pointer img-hover"
                          onClick={() => setLightboxIndex(i)}
                        />
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="right">
                <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
                  <h3 className="font-display text-xl font-bold mb-2">Reservar este quarto</h3>
                  <p className="text-muted-foreground text-sm mb-4">Entre em contato pelo WhatsApp e garanta sua reserva com facilidade.</p>
                  {room.show_price && room.price != null && (
                    <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 mb-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Diaria a partir de</p>
                      <p className="font-display text-3xl font-bold text-secondary">{formatPrice(room.price)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Consulte disponibilidade e promocoes</p>
                    </div>
                  )}
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-pulse w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-base mb-3"
                  >
                    <Phone className="w-5 h-5" /> Reservar via WhatsApp
                  </a>
                  <Link to="/quartos" className="w-full flex items-center justify-center gap-2 border py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Ver outros quartos
                  </Link>
                  <p className="text-xs text-muted-foreground text-center mt-4">Preco sujeito a alteracao conforme temporada e disponibilidade.</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <ReviewsCarousel />

      {lightboxIndex !== null && allImages.length > 0 && (
        <ImageLightbox images={allImages} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </Layout>
  );
};

export default QuartoDetalhe;