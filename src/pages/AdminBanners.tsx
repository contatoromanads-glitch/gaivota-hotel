import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Upload, Image } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: string;
  page: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  is_active: boolean;
  display_order: number;
}

const emptyBanner = (): Partial<Banner> => ({
  page: "home", title: "", subtitle: "", image_url: "", cta_text: "", cta_url: "", is_active: true, display_order: 0,
});

const pages = [
  { value: "home", label: "Home" },
  { value: "quartos", label: "Quartos" },
  { value: "estrutura", label: "Estrutura" },
  { value: "contatos", label: "Contatos" },
  { value: "politica", label: "Política" },
];

const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("banners").select("*").order("page").order("display_order");
    if (data) setBanners(data as Banner[]);
  };

  useEffect(() => { load(); }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("hotel-images").upload(path, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("hotel-images").getPublicUrl(path);
    setEditing((prev) => prev ? { ...prev, image_url: data.publicUrl } : prev);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!editing?.title) { toast.error("Título é obrigatório"); return; }
    const payload = {
      page: editing.page || "home",
      title: editing.title,
      subtitle: editing.subtitle || "",
      image_url: editing.image_url || "",
      cta_text: editing.cta_text || "",
      cta_url: editing.cta_url || "",
      is_active: editing.is_active ?? true,
      display_order: editing.display_order || 0,
    };

    if (isNew) {
      const { error } = await supabase.from("banners").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Banner criado!");
    } else {
      const { error } = await supabase.from("banners").update(payload).eq("id", editing.id!);
      if (error) { toast.error(error.message); return; }
      toast.success("Banner atualizado!");
    }
    setEditing(null); setIsNew(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este banner?")) return;
    await supabase.from("banners").delete().eq("id", id);
    toast.success("Excluído!"); load();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Gerenciar Banners</h2>
          <button onClick={() => { setEditing(emptyBanner()); setIsNew(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
            <Plus className="w-4 h-4" /> Novo Banner
          </button>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
            <div className="bg-card rounded-xl border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold">{isNew ? "Novo Banner" : "Editar Banner"}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Página</label>
                  <select value={editing.page || "home"} onChange={(e) => setEditing({ ...editing, page: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background">
                    {pages.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Título *</label>
                  <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtítulo</label>
                  <input value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium">Imagem</label>
                  {editing.image_url && <img src={editing.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-1 mb-2" />}
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 text-sm text-muted-foreground">
                    <Upload className="w-4 h-4" /> {uploading ? "Enviando..." : "Escolher imagem"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Texto do CTA</label>
                    <input value={editing.cta_text || ""} onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" placeholder="Ex: Reservar Agora" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL do CTA</label>
                    <input value={editing.cta_url || ""} onChange={(e) => setEditing({ ...editing, cta_url: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} id="active" className="rounded" />
                  <label htmlFor="active" className="text-sm font-medium">Ativo</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 py-2 rounded-md border text-sm font-medium">Cancelar</button>
                <button onClick={handleSave} className="flex-1 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold">Salvar</button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {banners.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum banner cadastrado.</p>
            </div>
          )}
          {banners.map((b) => (
            <div key={b.id} className={`bg-card border rounded-xl p-4 flex gap-4 ${!b.is_active ? "opacity-60" : ""}`}>
              {b.image_url && <img src={b.image_url} alt={b.title} className="w-24 h-16 object-cover rounded-lg" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium capitalize">{b.page}</span>
                  <p className="font-semibold text-sm truncate">{b.title}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(b); setIsNew(false); }} className="p-2 rounded-lg hover:bg-muted"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
