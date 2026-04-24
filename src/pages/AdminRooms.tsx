import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Upload, BedDouble, Image as ImageIcon, Info, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  description: string;
  beds: string;
  size: string;
  amenities: string[];
  highlight: boolean;
  display_order: number;
}

interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  alt_text: string;
}

const emptyRoom = (): Partial<Room> => ({
  name: "", description: "", beds: "", size: "", amenities: [], highlight: false, display_order: 0,
});

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [images, setImages] = useState<Record<string, RoomImage[]>>({});
  const [editing, setEditing] = useState<Partial<Room> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "room" | "image"; id: string; label: string } | null>(null);

  const load = async () => {
    const { data: rms } = await supabase.from("rooms").select("*").order("display_order");
    if (rms) {
      setRooms(rms.map((r) => ({ ...r, amenities: (r.amenities as string[]) || [] })));
      const { data: imgs } = await supabase.from("room_images").select("*").order("display_order");
      if (imgs) {
        const grouped: Record<string, RoomImage[]> = {};
        imgs.forEach((img) => {
          if (!grouped[img.room_id]) grouped[img.room_id] = [];
          grouped[img.room_id].push(img);
        });
        setImages(grouped);
      } else {
        setImages({});
      }
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.name) { toast.error("Por favor, dê um nome ao quarto"); return; }
    const payload = {
      name: editing.name,
      description: editing.description || "",
      beds: editing.beds || "",
      size: editing.size || "",
      amenities: editing.amenities || [],
      highlight: editing.highlight || false,
      display_order: editing.display_order || 0,
    };

    if (isNew) {
      const { error } = await supabase.from("rooms").insert(payload);
      if (error) { toast.error("Não foi possível salvar: " + error.message); return; }
      toast.success("Quarto criado com sucesso!");
    } else {
      const { error } = await supabase.from("rooms").update(payload).eq("id", editing.id!);
      if (error) { toast.error("Não foi possível salvar: " + error.message); return; }
      toast.success("Alterações salvas!");
    }
    setEditing(null);
    setIsNew(false);
    load();
  };

  const handleDeleteRoom = async (id: string) => {
    const roomImages = images[id] || [];
    // 1. Atualização otimista — some imediatamente da tela
    setRooms((prev) => prev.filter((r) => r.id !== id));
    setImages((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setConfirmDelete(null);

    // 2. Remove arquivos do storage
    for (const img of roomImages) {
      const path = img.image_url.split("/hotel-images/")[1];
      if (path) {
        await supabase.storage.from("hotel-images").remove([decodeURIComponent(path)]);
      }
    }
    // 3. Remove do banco
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir: " + error.message);
      load(); // restaura estado real
      return;
    }
    toast.success("Quarto excluído. Já sumiu do site também.");
  };

  const handleUploadImage = async (roomId: string, files: FileList) => {
    setUploadingFor(roomId);
    let success = 0;
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" é maior que 10MB e não foi enviada.`);
        continue;
      }
      const ext = file.name.split(".").pop();
      const path = `rooms/${roomId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("hotel-images").upload(path, file);
      if (upErr) { toast.error(`Falha ao enviar "${file.name}": ${upErr.message}`); continue; }
      const { data: urlData } = supabase.storage.from("hotel-images").getPublicUrl(path);
      await supabase.from("room_images").insert({ room_id: roomId, image_url: urlData.publicUrl, alt_text: file.name });
      success++;
    }
    setUploadingFor(null);
    if (success > 0) toast.success(`${success} imagem${success > 1 ? "s" : ""} enviada${success > 1 ? "s" : ""}!`);
    load();
  };

  const handleDeleteImage = async (imgId: string, roomId: string) => {
    // Otimista: remove da UI imediatamente
    setImages((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter((i) => i.id !== imgId),
    }));
    setConfirmDelete(null);

    const allImgs = Object.values(images).flat();
    const img = allImgs.find((i) => i.id === imgId);
    if (img) {
      const path = img.image_url.split("/hotel-images/")[1];
      if (path) {
        await supabase.storage.from("hotel-images").remove([decodeURIComponent(path)]);
      }
    }
    const { error } = await supabase.from("room_images").delete().eq("id", imgId);
    if (error) {
      toast.error("Erro ao remover: " + error.message);
      load();
      return;
    }
    toast.success("Foto removida do site.");
  };

  const addAmenity = () => {
    if (!amenityInput.trim() || !editing) return;
    setEditing({ ...editing, amenities: [...(editing.amenities || []), amenityInput.trim()] });
    setAmenityInput("");
  };

  const removeAmenity = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, amenities: (editing.amenities || []).filter((_, i) => i !== idx) });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Quartos do Hotel</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie quartos, fotos e comodidades. As mudanças aparecem no site na hora.
            </p>
          </div>
          <button
            onClick={() => { setEditing(emptyRoom()); setIsNew(true); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" /> Novo quarto
          </button>
        </div>

        {/* Dica */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80">
            <strong>Dica:</strong> use o botão <Upload className="inline w-3.5 h-3.5 mx-0.5" /> dentro de cada quarto
            para enviar fotos. Para remover uma foto, passe o mouse sobre ela e clique no <span className="inline-flex items-center justify-center w-4 h-4 bg-destructive text-white rounded-full text-[10px]">×</span>.
            Tudo é refletido imediatamente no site público.
          </div>
        </div>

        {/* Editor modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
            <div className="bg-card rounded-t-2xl sm:rounded-2xl border shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">{isNew ? "Novo quarto" : `Editar: ${editing.name}`}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-muted rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold flex items-center gap-1">
                    Nome do quarto <span className="text-destructive">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-1">Ex: "Quarto Deluxe Casal" ou "Suíte Mutum"</p>
                  <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Descrição</label>
                  <p className="text-xs text-muted-foreground mb-1">Texto curto que aparece junto do quarto.</p>
                  <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold">Camas</label>
                    <input value={editing.beds || ""} onChange={(e) => setEditing({ ...editing, beds: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="2 camas de solteiro" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Tamanho</label>
                    <input value={editing.size || ""} onChange={(e) => setEditing({ ...editing, size: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="20 m²" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Ordem na listagem</label>
                  <p className="text-xs text-muted-foreground mb-1">Número menor aparece primeiro no site.</p>
                  <input type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
                </div>
                <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors">
                  <input type="checkbox" checked={editing.highlight || false} onChange={(e) => setEditing({ ...editing, highlight: e.target.checked })} className="rounded w-4 h-4" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <Star className="w-3.5 h-3.5 text-accent" /> Marcar como destaque
                    </div>
                    <p className="text-xs text-muted-foreground">Exibe um selo "Destaque" nesse quarto no site.</p>
                  </div>
                </label>
                <div>
                  <label className="text-sm font-semibold">Comodidades</label>
                  <p className="text-xs text-muted-foreground mb-1">Liste itens como "Ar-condicionado", "Wi-Fi", "Frigobar".</p>
                  <div className="flex gap-2">
                    <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())} className="flex-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="Digite e pressione Enter" />
                    <button onClick={addAmenity} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-semibold hover:opacity-90">Adicionar</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(editing.amenities || []).map((a, i) => (
                      <span key={i} className="bg-muted text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        {a}
                        <button onClick={() => removeAmenity(i)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    {(editing.amenities || []).length === 0 && (
                      <span className="text-xs text-muted-foreground italic">Nenhuma comodidade adicionada ainda.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex gap-3">
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 py-2.5 rounded-md border text-sm font-semibold hover:bg-muted">Cancelar</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                  {isNew ? "Criar quarto" : "Salvar alterações"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm dialog */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display font-bold text-lg text-center mb-2">
                {confirmDelete.type === "room" ? "Excluir este quarto?" : "Remover esta foto?"}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-5">
                {confirmDelete.type === "room"
                  ? `O quarto "${confirmDelete.label}" e todas as suas fotos serão removidos do site permanentemente.`
                  : "A foto sumirá do site público imediatamente. Essa ação não pode ser desfeita."}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-md border text-sm font-semibold hover:bg-muted">Cancelar</button>
                <button
                  onClick={() => {
                    if (confirmDelete.type === "room") handleDeleteRoom(confirmDelete.id);
                    else {
                      const roomId = Object.keys(images).find((rid) => images[rid].some((i) => i.id === confirmDelete.id)) || "";
                      handleDeleteImage(confirmDelete.id, roomId);
                    }
                  }}
                  className="flex-1 py-2.5 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rooms list */}
        <div className="space-y-4">
          {rooms.length === 0 && (
            <div className="text-center py-16 bg-card border-2 border-dashed rounded-2xl">
              <BedDouble className="w-14 h-14 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-semibold mb-1">Nenhum quarto cadastrado ainda</p>
              <p className="text-sm text-muted-foreground mb-4">Comece adicionando o primeiro quarto.</p>
              <button
                onClick={() => { setEditing(emptyRoom()); setIsNew(true); }}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Adicionar primeiro quarto
              </button>
            </div>
          )}
          {rooms.map((room) => {
            const roomImgs = images[room.id] || [];
            return (
              <div key={room.id} className="bg-card border rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-base">{room.name}</h3>
                      {room.highlight && (
                        <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Destaque
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {room.beds || "Sem informação de camas"} {room.size && `• ${room.size}`}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => { setEditing(room); setIsNew(false); setAmenityInput(""); }}
                      title="Editar este quarto"
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ type: "room", id: room.id, label: room.name })}
                      title="Excluir este quarto"
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Amenities */}
                {room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.amenities.map((a, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                )}

                {/* Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <ImageIcon className="inline w-3 h-3 mr-1" />
                      Fotos ({roomImgs.length})
                    </p>
                    {uploadingFor === room.id && (
                      <span className="text-xs text-primary flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Enviando…
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    {roomImgs.map((img) => (
                      <div key={img.id} className="relative group">
                        <img src={img.image_url} alt={img.alt_text} className="w-24 h-20 object-cover rounded-lg border" />
                        <button
                          onClick={() => setConfirmDelete({ type: "image", id: img.id, label: img.alt_text })}
                          title="Remover esta foto"
                          className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-24 h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-colors group">
                      <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-muted-foreground mt-1">Adicionar</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleUploadImage(room.id, e.target.files)}
                      />
                    </label>
                  </div>
                  {roomImgs.length === 0 && (
                    <p className="text-xs text-muted-foreground italic mt-2">
                      Sem fotos ainda. Clique em "Adicionar" para enviar.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
