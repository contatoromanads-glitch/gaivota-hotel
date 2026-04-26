import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Star, Eye, EyeOff, CheckCircle, XCircle, Clock, Bell } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"approved" | "pending">("approved");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("reviews").select("*").order("display_order");
    if (data) setReviews(data as Review[]);
  }, []);

  useEffect(() => {
    load();

    // Realtime subscription for new reviews
    const channel = supabase
      .channel("admin-reviews-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        (payload) => {
          const newReview = payload.new as Review;
          const status = (newReview as any).status || "approved";
          setReviews((prev) => [...prev, { ...newReview, status }]);
          if (status === "pending") {
            toast.info(`Nova avaliação de ${newReview.guest_name} aguarda aprovação!`, {
              icon: "🔔",
              duration: 6000,
              action: {
                label: "Ver pendentes",
                onClick: () => setActiveTab("pending"),
              },
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "reviews" },
        (payload) => {
          const updated = payload.new as Review;
          setReviews((prev) =>
            prev.map((r) => r.id === updated.id ? { ...r, ...(updated as any) } : r)
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "reviews" },
        (payload) => {
          setReviews((prev) => prev.filter((r) => r.id !== (payload.old as any).id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const approved = reviews.filter((r) => r.is_visible);
  const pending = reviews.filter((r) => !r.is_visible);
  const displayed = activeTab === "approved" ? approved : pending;

  const handleSave = async () => {
    if (!editing?.guest_name || !editing?.text) { toast.error("Nome e texto são obrigatórios"); return; }
    const payload: any = {
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
    setEditing(null); setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setConfirmDelete(null);
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { toast.error(error.message); load(); return; }
    toast.success("Avaliação removida do site.");
  };

  const toggleVisibility = async (review: Review) => {
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, is_visible: !r.is_visible } : r));
    await supabase.from("reviews").update({ is_visible: !review.is_visible }).eq("id", review.id);
    toast.success(review.is_visible ? "Avaliação oculta do site." : "Avaliação publicada no site.");
  };

  const handleApprove = async (review: Review) => {
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, is_visible: true } : r));
    await supabase.from("reviews").update({ is_visible: true }).eq("id", review.id);
    toast.success("Avaliação aprovada e publicada no site!");
  };

  const handleReject = async (review: Review) => {
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, is_visible: false } : r));
    await supabase.from("reviews").update({ is_visible: false }).eq("id", review.id);
    toast.success("Avaliação rejeitada e ocultada do site.");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Avaliações de Hóspedes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie e modere as avaliações.
              <span className="inline-flex items-center gap-1 ml-2 text-green-600">
                <Bell className="w-3 h-3" /> Atualizações em tempo real
              </span>
            </p>
          </div>
          <button onClick={() => { setEditing(emptyReview()); setIsNew(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 shadow-sm">
            <Plus className="w-4 h-4" /> Nova avaliação
          </button>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground/80">
          <strong>Dica:</strong> avaliações enviadas pelos hóspedes pelo site ficam em "Pendentes" até você aprovar. Use o ícone olho para esconder temporariamente.
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("approved")}
            className={"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors " + (activeTab === "approved" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}
          >
            <CheckCircle className="w-4 h-4" /> Aprovadas ({approved.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={"relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors " + (activeTab === "pending" ? "bg-orange-500 text-white" : "bg-muted hover:bg-muted/80")}
          >
            <Clock className="w-4 h-4" /> Pendentes
            {pending.length > 0 && (
              <span className={"text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold " + (activeTab === "pending" ? "bg-white text-orange-500" : "bg-orange-500 text-white")}>
                {pending.length}
              </span>
            )}
          </button>
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
                      <option>Site Gaivota</option>
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

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-3"><Trash2 className="w-6 h-6 text-destructive" /></div>
              <h3 className="font-display font-bold text-lg text-center mb-2">Excluir esta avaliação?</h3>
              <p className="text-sm text-muted-foreground text-center mb-5">A avaliação de <strong>{confirmDelete.name}</strong> será removida permanentemente. Para ocultar temporariamente, use o botão de olho.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-md border text-sm font-semibold hover:bg-muted">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete.id)} className="flex-1 py-2.5 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">Sim, excluir</button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {displayed.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{activeTab === "pending" ? "Nenhuma avaliação pendente de aprovação." : "Nenhuma avaliação aprovada ainda."}</p>
            </div>
          )}
          {displayed.map((r) => (
            <div key={r.id} className={"bg-card border rounded-xl p-4 " + (!r.is_visible ? "opacity-60" : "")}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{r.guest_name}</p>
                    <span className="text-xs text-muted-foreground">{r.source}</span>
                    <div className="flex">{Array.from({ length: r.rating }).map((_, i) => (<Star key={i} className="w-3 h-3 fill-accent text-accent" />))}</div>
                    {!r.is_visible && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Oculta</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.text}</p>
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <>
                      <button onClick={() => handleApprove(r)} className="p-2 rounded-lg hover:bg-green-50 text-green-600" title="Aprovar e publicar">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleReject(r)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Rejeitar">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button onClick={() => toggleVisibility(r)} className="p-2 rounded-lg hover:bg-muted" title={r.is_visible ? "Ocultar" : "Mostrar"}>
                    {r.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(r); setIsNew(false); }} className="p-2 rounded-lg hover:bg-muted">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setConfirmDelete({ id: r.id, name: r.guest_name })} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" title="Excluir">
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