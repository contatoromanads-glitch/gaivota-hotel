import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Upload, GripVertical, BedDouble } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);

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
      }
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.name) { toast.error("Nome é obrigatório"); return; }
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
      if (error) { toast.error(error.message); return; }
      toast.success("Quarto criado!");
    } else {
      const { error } = await supabase.from("rooms").update(payload).eq("id", editing.id!);
      if (error) { toast.error(error.message); return; }
      toast.success("Quarto atualizado!");
    }
    setEditing(null);
    setIsNew(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este quarto?")) return;
    // Delete storage files for this room's images first
    const roomImages = images[id] || [];
    for (const img of roomImages) {
      const path = img.image_url.split("/hotel-images/")[1];
      if (path) {
        await supabase.storage.from("hotel-images").remove([decodeURIComponent(path)]);
      }
    }
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) { toast.error("Erro ao excluir: " + error.message); return; }
    toast.success("Quarto excluído!");
    load();
  };

  const handleUploadImage = async (roomId: string, files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `rooms/${roomId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("hotel-images").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      const { data: urlData } = supabase.storage.from("hotel-images").getPublicUrl(path);
      await supabase.from("room_images").insert({ room_id: roomId, image_url: urlData.publicUrl, alt_text: file.name });
    }
    setUploading(false);
    toast.success("Imagens enviadas!");
    load();
  };

  const handleDeleteImage = async (imgId: string) => {
    // Find the image to get storage path
    const allImgs = Object.values(images).flat();
    const img = allImgs.find((i) => i.id === imgId);
    if (img) {
      const path = img.image_url.split("/hotel-images/")[1];
      if (path) {
        await supabase.storage.from("hotel-images").remove([decodeURIComponent(path)]);
      }
    }
    const { error } = await supabase.from("room_images").delete().eq("id", imgId);
    if (error) { toast.error("Erro ao remover imagem: " + error.message); return; }
    toast.success("Imagem removida!");
    load();
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Gerenciar Quartos</h2>
          <button
            onClick={() => { setEditing(emptyRoom()); setIsNew(true); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Novo Quarto
          </button>
        </div>

        {/* Editor modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
            <div className="bg-card rounded-xl border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold">{isNew ? "Novo Quarto" : "Editar Quarto"}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome *</label>
                  <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 rounded-md border bg-background resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Camas</label>
                    <input value={editing.beds || ""} onChange={(e) => setEditing({ ...editing, beds: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" placeholder="Ex: 2 camas de solteiro" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tamanho</label>
                    <input value={editing.size || ""} onChange={(e) => setEditing({ ...editing, size: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" placeholder="Ex: 20 m²" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Ordem de exibição</label>
                  <input type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.highlight || false} onChange={(e) => setEditing({ ...editing, highlight: e.target.checked })} id="highlight" className="rounded" />
                  <label htmlFor="highlight" className="text-sm font-medium">Destaque</label>
                </div>
                <div>
                  <label className="text-sm font-medium">Comodidades</label>
                  <div className="flex gap-2 mt-1">
                    <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())} className="flex-1 px-3 py-2 rounded-md border bg-background" placeholder="Ex: Ar-condicionado" />
                    <button onClick={addAmenity} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(editing.amenities || []).map((a, i) => (
                      <span key={i} className="bg-muted text-sm px-2 py-1 rounded flex items-center gap-1">
                        {a}
                        <button onClick={() => removeAmenity(i)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 py-2 rounded-md border text-sm font-medium">Cancelar</button>
                <button onClick={handleSave} className="flex-1 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold">Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* Rooms list */}
        <div className="space-y-4">
          {rooms.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BedDouble className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum quarto cadastrado ainda.</p>
            </div>
          )}
          {rooms.map((room) => (
            <div key={room.id} className="bg-card border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">{room.beds} {room.size && `• ${room.size}`}</p>
                  </div>
                  {room.highlight && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">Destaque</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(room); setIsNew(false); setAmenityInput(""); }} className="p-2 rounded-lg hover:bg-muted">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-3">
                {room.amenities.map((a, i) => (
                  <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">{a}</span>
                ))}
              </div>

              {/* Images */}
              <div className="flex gap-2 flex-wrap items-center">
                {(images[room.id] || []).map((img) => (
                  <div key={img.id} className="relative group">
                    <img src={img.image_url} alt={img.alt_text} className="w-20 h-16 object-cover rounded border" />
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-16 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleUploadImage(room.id, e.target.files)}
                  />
                </label>
              </div>
              {uploading && <p className="text-xs text-muted-foreground mt-2">Enviando imagens...</p>}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
