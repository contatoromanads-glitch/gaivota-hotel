import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { WHATSAPP_URL } from "@/lib/constants";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import { supabase } from "@/integrations/supabase/client";
import hotelCorredor from "@/assets/hotel-corredor.jpeg";

interface Room {
  id: string;
  name: string;
  description: string | null;
  beds: string;
  size: string | null;
  amenities: string[];
  highlight: boolean | null;
  display_order: number | null;
}

interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number | null;
}

const Quartos = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomImages, setRoomImages] = useState<Record<string, RoomImage[]>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [roomsRes, imagesRes] = await Promise.all([
      supabase.from("rooms").select("*").order("display_order"),
      supabase.from("room_images").select("*").order("display_order"),
    ]);

    if (roomsRes.data) {
      setRooms(roomsRes.data.map((r) => ({ ...r, amenities: (r.amenities as string[]) || [] })));
    }
    if (imagesRes.data) {
      const grouped: Record<string, RoomImage[]> = {};
      imagesRes.data.forEach((img) => {
        if (!grouped[img.room_id]) grouped[img.room_id] = [];
        grouped[img.room_id].push(img);
      });
      setRoomImages(grouped);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Realtime sync
    const roomsChannel = supabase
      .channel("rooms-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "room_images" }, () => loadData())
      .subscribe();

    return () => { supabase.removeChannel(roomsChannel); };
  }, []);

  // Build all images for lightbox
  const allImages: { src: string; alt: string }[] = [];
  rooms.forEach((room) => {
    const imgs = roomImages[room.id] || [];
    imgs.forEach((img) => {
      allImages.push({ src: img.image_url, alt: img.alt_text || room.name });
    });
  });

  // Get first image for each room
  const getRoomMainImage = (roomId: string) => {
    const imgs = roomImages[roomId];
    return imgs && imgs.length > 0 ? imgs[0].image_url : hotelCorredor;
  };

  // Get lightbox index for a room's main image
  const getRoomLightboxIndex = (roomId: string) => {
    let index = 0;
    for (const room of rooms) {
      const imgs = roomImages[room.id] || [];
      if (room.id === roomId) return index;
      index += imgs.length;
    }
    return 0;
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img src={hotelCorredor} alt="Corredor do hotel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3 animate-fade-in-up">Nossas Acomodações</h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>Conforto e temática amazônica em cada detalhe</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-warm">
        <div className="container max-w-3xl text-center">
          <ScrollReveal>
            <p className="text-muted-foreground leading-relaxed">
              Cada quarto é um convite ao relaxamento, com decoração inspirada na fauna e flora da Amazônia.
              Acomodações espaçosas, climatizadas e equipadas com aquecimento de água solar, frigobar e banheiro privativo.
              Todos os quartos incluem <strong className="text-foreground">café da manhã regional</strong>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Tipos de Quartos</h2>
          </ScrollReveal>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border bg-card animate-pulse">
                  <div className="w-full h-52 bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, i) => (
                <ScrollReveal key={room.id} delay={i * 0.08} direction="up">
                  <div className={`rounded-lg border overflow-hidden transition-shadow hover:shadow-lg h-full ${room.highlight ? "border-primary bg-primary/5" : "bg-card"}`}>
                    <img
                      src={getRoomMainImage(room.id)}
                      alt={room.name}
                      className="w-full h-52 object-cover cursor-pointer img-hover"
                      onClick={() => setLightboxIndex(getRoomLightboxIndex(room.id))}
                    />
                    <div className="p-6">
                      {room.highlight && <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">★ Destaque</span>}
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
                      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cta-pulse mt-5 block text-center bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-semibold">
                        Reservar
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-8">* Preços são referência e podem variar conforme temporada. Nenhum quarto possui cofre.</p>
        </div>
      </section>

      {/* Gallery - all room images */}
      {allImages.length > 0 && (
        <section className="py-16 bg-warm">
          <div className="container">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Galeria de Fotos</h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {allImages.map((img, i) => (
                <ScrollReveal key={i} delay={i * 0.05} direction="scale">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="rounded-lg shadow-sm w-full h-40 object-cover img-hover cursor-pointer"
                    onClick={() => setLightboxIndex(i)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <ReviewsCarousel />

      {lightboxIndex !== null && (
        <ImageLightbox images={allImages} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </Layout>
  );
};

export default Quartos;
