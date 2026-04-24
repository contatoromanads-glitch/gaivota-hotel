import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Star, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  guest_name: string;
  source: string;
  rating: number;
  text: string;
  is_visible: boolean;
  display_order: number;
}

const emptyReview = (): Partial<Review> => ({
  guest_name: "", source: "Google", rating: 5, text: "", is_visible: true, display_order: 0,
});

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Partial<Review> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("reviews").select("*").order("display_order");
    if (data) setReviews(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.guest_name || !editing?.text) { toast.error("Nome e texto são obrigatórios"); return; }
    const payload = {
      guest_name: editing.guest_name,
      source: editing.source || "Google",
      rating: editing.rating || 5,
      text: editing.text,
      is_visible: editing.is_visible ?? true,
      display_order: editing.display_order || 0,
    };

    if (isNew) {
      const { error } = await supabase.from("reviews").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Avaliação criada!");
    } else {
      const { error } = await supabase.from("reviews").update(payload).eq("id", editing.id!);
      if (error) { toast.error(error.message); return; }
      toast.success("Avaliação atualizada!");
    }
    setEditing(null); setIsNew(false); load();
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(`Excluir a avaliação de ${review.guest_name}?\n\nEla será removida permanentemente do site. Se quiser apenas escondê-la, use o botão de olho (👁).`)) return;
    setReviews((prev) => prev.filter((r) => r.id !== review.id));
    const { error } = await supabase.from("reviews").delete().eq("id", review.id);
    if (error) { toast.error(error.message); load(); return; }
    toast.success("Avaliação removida do site.");
  };

  const toggleVisibility = async (review: Review) => {
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, is_visible: !r.is_visible } : r));
    await supabase.from("reviews").update({ is_visible: !review.is_visible }).eq("id", review.id);
    toast.success(review.is_visible ? "Avaliação oculta do site." : "Avaliação publicada no site.");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Avaliações de Hóspedes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione depoimentos reais de hóspedes para mostrar no site.
            </p>
          </div>
          <button onClick={() => { setEditing(emptyReview()); setIsNew(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 shadow-sm">
            <Plus className="w-4 h-4" /> Nova avaliação
          </button>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground/80">
          <strong>Dica:</strong> use o ícone <Eye className="inline w-3.5 h-3.5 mx-0.5" /> para esconder uma avaliação
          temporariamente, ou a lixeira <Trash2 className="inline w-3.5 h-3.5 mx-0.5" /> para apagar de vez.
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
            <div className="bg-card rounded-xl border shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold">{isNew ? "Nova Avaliação" : "Editar"}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome do hóspede *</label>
                  <input value={editing.guest_name || ""} onChange={(e) => setEditing({ ...editing, guest_name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Fonte</label>
                    <select value={editing.source || "Google"} onChange={(e) => setEditing({ ...editing, source: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background">
                      <option>Google</option>
                      <option>Tripadvisor</option>
                      <option>Booking</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nota</label>
                    <select value={editing.rating || 5} onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-md border bg-background">
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} estrelas</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Depoimento *</label>
                  <textarea value={editing.text || ""} onChange={(e) => setEditing({ ...editing, text: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2 rounded-md border bg-background resize-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.is_visible ?? true} onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })} id="visible" className="rounded" />
                  <label htmlFor="visible" className="text-sm font-medium">Visível no site</label>
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
          {reviews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma avaliação cadastrada.</p>
            </div>
          )}
          {reviews.map((r) => (
            <div key={r.id} className={`bg-card border rounded-xl p-4 ${!r.is_visible ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{r.guest_name}</p>
                    <span className="text-xs text-muted-foreground">{r.source}</span>
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{r.text}"</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleVisibility(r)} className="p-2 rounded-lg hover:bg-muted" title={r.is_visible ? "Ocultar" : "Mostrar"}>
                    {r.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(r); setIsNew(false); }} className="p-2 rounded-lg hover:bg-muted">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(r)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
