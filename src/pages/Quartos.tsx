import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { Search, X } from "lucide-react";
import hotelCorredor from "@/assets/hotel-corredor.png";

interface Banner {
  image_url: string;
  title: string | null;
  subtitle: string | null;
}

interface Room {
  id: string;
  name: string;
  description: string | null;
  beds: string;
  size: string | null;
  amenities: string[];
  highlight: boolean | null;
  display_order: number | null;
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

const Quartos = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomImages, setRoomImages] = useState<Record<string, RoomImage[]>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [search, setSearch] = useState("");

  const roomTexts = rooms.flatMap((r) => [r.name, r.beds, r.description || "", ...(r.amenities || [])]);
  const translatedRoomTexts = useTranslatedContent(roomTexts);

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
    const [roomsRes, imagesRes, bannerRes] = await Promise.all([
      supabase.from("rooms").select("*").order("display_order"),
      supabase.from("room_images").select("*").order("display_order"),
      supabase.from("banners").select("image_url,title,subtitle").eq("page", "quartos").eq("is_active", true).maybeSingle(),
    ]);
    if (roomsRes.data) {
      setRooms(roomsRes.data.map((r) => ({
        ...r,
        amenities: (r.amenities as string[]) || [],
        price: r.price ?? null,
        show_price: r.show_price ?? true,
      })));
    }
    if (imagesRes.data) {
      const grouped: Record<string, RoomImage[]> = {};
      imagesRes.data.forEach((img) => {
        if (!grouped[img.room_id]) grouped[img.room_id] = [];
        grouped[img.room_id].push(img);
      });
      setRoomImages(grouped);
    }
    if (bannerRes.data) setBanner(bannerRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const ch = supabase
      .channel("rooms-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "room_images" }, () => loadData())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filteredRooms = useMemo(() => {
    if (!search.trim()) return rooms;
    const q = search.toLowerCase();
    return rooms.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        r.beds.toLowerCase().includes(q) ||
        r.amenities.some((a) => a.toLowerCase().includes(q))
    );
  }, [rooms, search]);

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
        <img
          src={banner?.image_url || hotelCorredor}
          alt={banner?.title || "Quartos do hotel"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3 animate-fade-in-up">
            {banner?.title || t("quartos.heroTitle")}
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {banner?.subtitle || t("quartos.heroSubtitle")}
          </p>
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
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-6">{t("quartos.tiposTitle")}</h2>
          </ScrollReveal>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por tipo, comodidade..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-shadow"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {search && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {filteredRooms.length === 0 ? "Nenhum quarto encontrado." : `${filteredRooms.length} quarto(s) encontrado(s)`}
              </p>
            )}
          </div>

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
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>Nenhum quarto encontrado para &quot;{search}&quot;.</p>
              <button onClick={() => setSearch("")} className="mt-3 text-sm text-primary underline">Limpar busca</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-left">
              {filteredRooms.map((room, i) => {
                const roomIdx = rooms.indexOf(room);
                const tr = getTranslatedRoom(roomIdx);
                return (
                  <ScrollReveal key={room.id} delay={i * 0.08} direction="up">
                    <div className={`rounded-lg border overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col ${room.highlight ? "border-primary bg-primary/5" : "bg-card"}`}>
                      <img
                        src={getRoomMainImage(room.id)}
                        alt={tr.name}
                        className="w-full h-52 object-cover cursor-pointer img-hover"
                        onClick={() => setLightboxIndex(getRoomLightboxIndex(room.id))}
                      />
                      <div className="p-6 flex flex-col flex-1">
                        {room.highlight && <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{t("quartos.destaque")}</span>}
                        <h3 className="font-display text-lg font-semibold mb-1">{tr.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{tr.beds}</p>
                        {room.size && <p className="text-sm text-accent font-medium mb-1">{room.size}</p>}
                        {room.show_price && room.price != null && (
                          <p className="text-base font-bold text-primary mt-1 mb-1">
                            {formatPrice(room.price)} <span className="text-xs font-normal text-muted-foreground">/ noite</span>
                          </p>
                        )}
                        <ul className="space-y-1 mt-3 flex-1">
                          {tr.amenities.map((a, ai) => (
                            <li key={ai} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-5 flex flex-col gap-2">
                          <Link
                            to={`/quartos/${room.id}`}
                            className="block text-center border border-primary text-primary py-2.5 rounded-md text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            Ver detalhes
                          </Link>
                          <a
                            href={`https://wa.me/5594992854456?text=${encodeURIComponent(`Olá! Vim do site e gostaria de fazer uma reserva para o quarto ${room.name}. Poderia me ajudar?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-pulse block text-center bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-semibold"
                          >
                            {t("quartos.reservar")}
                          </a>
                        </div>
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