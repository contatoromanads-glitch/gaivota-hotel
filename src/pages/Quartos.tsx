import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { WHATSAPP_URL } from "@/lib/constants";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import hotelCorredor from "@/assets/hotel-corredor.png";

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
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomImages, setRoomImages] = useState<Record<string, RoomImage[]>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Collect all translatable texts from rooms
  const roomTexts = rooms.flatMap((r) => [r.name, r.beds, r.description || "", ...(r.amenities || [])]);
  const translatedRoomTexts = useTranslatedContent(roomTexts);

  // Helper to get translated text for a room
  const getTranslatedRoom = (roomIndex: number) => {
    const room = rooms[roomIndex];
    const amenityCount = rooms.slice(0, roomIndex).reduce((acc, r) => acc + (r.amenities?.length || 0), 0);
    const baseIndex = roomIndex * 3 + amenityCount;
    return {
      name: translatedRoomTexts[baseIndex] || room.name,
      beds: translatedRoomTexts[baseIndex + 1] || room.beds,
      description: translatedRoomTexts[baseIndex + 2] || room.description || "",
      amenities: room.amenities.map((_, ai) => translatedRoomTexts[baseIndex + 3 + ai] || room.amenities[ai]),
    };
  };

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
    const roomsChannel = supabase
      .channel("rooms-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "room_images" }, () => loadData())
      .subscribe();
    return () => { supabase.removeChannel(roomsChannel); };
  }, []);

  const allImages: { src: string; alt: string }[] = [];
  rooms.forEach((room) => {
    (roomImages[room.id] || []).forEach((img) => {
      allImages.push({ src: img.image_url, alt: img.alt_text || room.name });
    });
  });

  const getRoomMainImage = (roomId: string) => {
    const imgs = roomImages[roomId];
    return imgs && imgs.length > 0 ? imgs[0].image_url : hotelCorredor;
  };

  const getRoomLightboxIndex = (roomId: string) => {
    let index = 0;
    for (const room of rooms) {
      if (room.id === roomId) return index;
      index += (roomImages[room.id] || []).length;
    }
    return 0;
  };

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img src={hotelCorredor} alt="Corredor do hotel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3 animate-fade-in-up">{t("quartos.heroTitle")}</h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>{t("quartos.heroSubtitle")}</p>
        </div>
      </section>

      <section className="py-12 bg-warm">
        <div className="container max-w-3xl text-center">
          <ScrollReveal>
            <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t("quartos.introText") }} />
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">{t("quartos.tiposTitle")}</h2>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-left">
              {rooms.map((room, i) => {
                const tr = getTranslatedRoom(i);
                return (
                  <ScrollReveal key={room.id} delay={i * 0.08} direction="up">
                    <div className={`rounded-lg border overflow-hidden transition-shadow hover:shadow-lg h-full ${room.highlight ? "border-primary bg-primary/5" : "bg-card"}`}>
                      <img
                        src={getRoomMainImage(room.id)}
                        alt={tr.name}
                        className="w-full h-52 object-cover cursor-pointer img-hover"
                        onClick={() => setLightboxIndex(getRoomLightboxIndex(room.id))}
                      />
                      <div className="p-6">
                        {room.highlight && <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{t("quartos.destaque")}</span>}
                        <h3 className="font-display text-lg font-semibold mb-1">{tr.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{tr.beds}</p>
                        {room.size && <p className="text-sm text-accent font-medium mb-3">{room.size}</p>}
                        <ul className="space-y-1 mt-3">
                          {tr.amenities.map((a, ai) => (
                            <li key={ai} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                        <a href={`https://wa.me/5594992854456?text=${encodeURIComponent(`Olá! Vim do site e gostaria de fazer uma reserva para o quarto ${room.name}. Poderia me ajudar?`)}`} target="_blank" rel="noopener noreferrer" className="cta-pulse mt-5 block text-center bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-semibold">
                          {t("quartos.reservar")}
                        </a>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-8">{t("quartos.disclaimer")}</p>
        </div>
      </section>

      {allImages.length > 0 && (
        <section className="py-16 bg-warm">
          <div className="container">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">{t("quartos.galeriaTitle")}</h2>
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
