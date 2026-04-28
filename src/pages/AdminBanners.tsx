import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon, Info, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import hotelFachada from "@/assets/hotel-fachada.png";
import hotelCorredor from "@/assets/hotel-corredor.png";

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
  { value: "home", label: "Página Inicial (Home)" },
  { value: "quartos", label: "Quartos" },
  { value: "estrutura", label: "Estrutura" },
  { value: "contatos", label: "Contatos" },
  { value: "politica", label: "Política" },
];

// Imagens padrão por página (usadas quando não há upload)
const defaultImages: Record<string, string> = {
  home: hotelFachada,
  quartos: hotelCorredor,
};

const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Banner | null>(null);

  const load = async () => {
    const { data } = await supabase.from("banners").select("*").order("page").order("display_order");
    if (data) setBanners(data as Banner[]);
  };

  useEffect(() => { load(); }, []);

  const handleImageUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error("A imagem é maior que 10MB. Reduza o tamanho antes."); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from("hotel-images").upload(path, file);
    if (error) { toast.error("Falha no envio: " + error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("hotel-images").getPublicUrl(path);
    setEditing((prev) => prev ? { ...prev, image_url: data.publicUrl } : prev);
    setUploading(false);
    toast.success("Imagem carregada! Não esqueça de salvar.");
  };

  const removeBannerImage = async () => {
    if (!editing?.image_url) return;
    const path = editing.image_url.split("/hotel-images/")[1];
    if (path) await supabase.storage.from("hotel-images").remove([decodeURIComponent(path)]);
    setEditing({ ...editing, image_url: "" });
  };

  const handleSave = async () => {
    if (!editing?.title) { toast.error("O título é obrigatório."); return; }
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

  const handleDelete = async (banner: Banner) => {
    setBanners((prev) => prev.filter((b) => b.id !== banner.id));
    setConfirmDelete(null);
    if (banner.image_url) {
      const path = banner.image_url.split("/hotel-images/")[1];
      if (path) await supabase.storage.from("hotel-images").remove([decodeURIComponent(path)]);
    }
    const { error } = await supabase.from("banners").delete().eq("id", banner.id);
    if (error) { toast.error(error.message); load(); return; }
    toast.success("Banner removido do site.");
  };

  const toggleActive = async (banner: Banner) => {
    setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, is_active: !b.is_active } : b));
    await supabase.from("banners").update({ is_active: !banner.is_active }).eq("id", banner.id);
    toast.success(banner.is_active ? "Banner oculto do site." : "Banner publicado no site.");
  };

  const grouped = banners.reduce((acc, b) => {
    if (!acc[b.page]) acc[b.page] = [];
    acc[b.page].push(b);
    return acc;
  }, {} as Record<string, Banner[]>);

  const pageLabel = (slug: string) => pages.find((p) => p.value === slug)?.label || slug;

  // Miniatura exibida no card: imagem do Supabase se tiver, senão a padrão do código
  const getThumb = (b: Banner) => b.image_url || defaultImages[b.page] || null;

  const currentEditorImage = editing?.image_url || "";
  const currentEditorDefault = defaultImages[editing?.page || "home"] || null;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Banners do Site</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Banners são as imagens grandes que aparecem no topo de cada página.
            </p>
          </div>
          <button onClick={() => { setEditing(emptyBanner()); setIsNew(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 shadow-sm">
            <Plus className="w-4 h-4" /> Novo banner
          </button>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80">
            Para a melhor qualidade, use imagens em <strong>formato horizontal</strong> com pelo menos
            <strong> 1920×800 pixels</strong>. Tamanho máximo: 10MB.
          </div>
        </div>

        {/* Editor modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
            <div className="bg-card rounded-t-2xl sm:rounded-2xl border shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">{isNew ? "Novo banner" : "Editar banner"}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold">Em qual página este banner aparece?</label>
                  <select value={editing.page || "home"} onChange={(e) => setEditing({ ...editing, page: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none">
                    {pages.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Título <span className="text-destructive">*</span></label>
                  <p className="text-xs text-muted-foreground mb-1">Texto principal grande, em destaque.</p>
                  <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Subtítulo</label>
                  <p className="text-xs text-muted-foreground mb-1">Texto menor abaixo do título (opcional).</p>
                  <input value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
                </div>

                {/* Image section */}
                <div>
                  <label className="text-sm font-semibold">Imagem de fundo</label>

                  {currentEditorImage ? (
                    /* Imagem já enviada para o Supabase */
                    <div className="relative mt-1">
                      <img src={currentEditorImage} alt="Pré-visualização" className="w-full h-40 object-cover rounded-lg border" />
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">✓ Imagem personalizada</div>
                      <button onClick={removeBannerImage} className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 shadow-lg" title="Remover imagem">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : currentEditorDefault ? (
                    /* Sem imagem personalizada — mostra a padrão como referência */
                    <div className="mt-1 space-y-2">
                      <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-amber-400">
                        <img src={currentEditorDefault} alt="Imagem padrão atual" className="w-full h-40 object-cover opacity-70" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center px-4">
                          <AlertCircle className="w-6 h-6 text-amber-300 mb-1" />
                          <p className="text-xs font-bold text-amber-200">Esta é a imagem padrão atual do site</p>
                          <p className="text-[10px] text-white/80 mt-1">Faça upload abaixo para substituí-la por uma foto personalizada</p>
                        </div>
                      </div>
                      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-colors">
                        {uploading ? (
                          <><Loader2 className="w-5 h-5 animate-spin text-primary" /><span className="text-sm">Enviando…</span></>
                        ) : (
                          <><Upload className="w-5 h-5 text-muted-foreground" /><span className="text-sm font-semibold">Clique para enviar nova imagem</span><span className="text-xs text-muted-foreground ml-1">(JPG, PNG · até 10MB)</span></>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    /* Sem imagem padrão disponível */
                    <label className="mt-1 flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-colors">
                      {uploading ? (
                        <><Loader2 className="w-5 h-5 animate-spin text-primary" /><span className="text-sm">Enviando…</span></>
                      ) : (
                        <><Upload className="w-6 h-6 text-muted-foreground" /><span className="text-sm font-semibold">Clique para enviar uma imagem</span><span className="text-xs text-muted-foreground">JPG, PNG ou WebP — até 10MB</span></>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold">Texto do botão extra</label>
                    <p className="text-xs text-muted-foreground mb-1">Ex: "Promoção especial"</p>
                    <input value={editing.cta_text || ""} onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Link do botão</label>
                    <p className="text-xs text-muted-foreground mb-1">Onde leva ao clicar.</p>
                    <input value={editing.cta_url || ""} onChange={(e) => setEditing({ ...editing, cta_url: e.target.value })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="/quartos ou https://..." />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg cursor-pointer hover:bg-muted/70">
                  <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="rounded w-4 h-4" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Banner ativo</div>
                    <p className="text-xs text-muted-foreground">Se desmarcado, o banner fica salvo mas não aparece no site.</p>
                  </div>
                </label>
              </div>
              <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex gap-3">
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 py-2.5 rounded-md border text-sm font-semibold hover:bg-muted">Cancelar</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">{isNew ? "Criar banner" : "Salvar"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm delete */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display font-bold text-lg text-center mb-2">Excluir banner?</h3>
              <p className="text-sm text-muted-foreground text-center mb-5">
                "{confirmDelete.title}" será removido permanentemente. Para apenas escondê-lo, prefira o botão de olho.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-md border text-sm font-semibold hover:bg-muted">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">Sim, excluir</button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        {banners.length === 0 ? (
          <div className="text-center py-16 bg-card border-2 border-dashed rounded-2xl">
            <ImageIcon className="w-14 h-14 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-semibold mb-1">Nenhum banner cadastrado</p>
            <p className="text-sm text-muted-foreground mb-4">Crie o primeiro banner para o seu site.</p>
            <button onClick={() => { setEditing(emptyBanner()); setIsNew(true); }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
              <Plus className="w-4 h-4" /> Criar banner
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([page, items]) => (
              <div key={page}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  {pageLabel(page)} ({items.length})
                </h3>
                <div className="space-y-2">
                  {items.map((b) => {
                    const thumb = getThumb(b);
                    const isDefault = !b.image_url && !!thumb;
                    return (
                      <div key={b.id} className={`bg-card border rounded-xl p-4 flex gap-4 hover:shadow-sm transition-shadow ${!b.is_active ? "opacity-60" : ""}`}>
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0">
                          {thumb ? (
                            <img src={thumb} alt={b.title} className="w-24 h-16 object-cover rounded-lg" />
                          ) : (
                            <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                          )}
                          {isDefault && (
                            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-900 text-[8px] font-bold px-1 rounded leading-tight">padrão</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{b.title}</p>
                          {b.subtitle && <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {!b.is_active && <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Oculto</span>}
                            {isDefault && <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">📷 Usando imagem padrão — clique em editar para trocar</span>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => toggleActive(b)} title={b.is_active ? "Ocultar do site" : "Mostrar no site"} className="p-2 rounded-lg hover:bg-muted transition-colors">
                            {b.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setEditing(b); setIsNew(false); }} title="Editar" className="p-2 rounded-lg hover:bg-muted transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setConfirmDelete(b)} title="Excluir" className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;