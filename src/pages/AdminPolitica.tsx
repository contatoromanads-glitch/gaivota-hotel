import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Save, Info } from "lucide-react";
import { toast } from "sonner";

interface PolicyContent {
  cancelamento_titulo: string;
  cancelamento_prazo: string;
  cancelamento_texto: string;
  checkin_hora: string;
  checkout_hora: string;
  criancas_texto: string;
  pets_texto: string;
  pagamento_texto: string;
  faturamento_texto: string;
}

const defaults: PolicyContent = {
  cancelamento_titulo: "Cancelamento de Reservas",
  cancelamento_prazo: "Cancelamentos devem ser realizados com minimo de 24 horas de antecedencia antes do check-in (14h), conforme o Codigo de Defesa do Consumidor (Art. 49). Reservas nao canceladas dentro desse prazo estao sujeitas a cobranca de 1 (uma) diaria.",
  cancelamento_texto: "Apos confirmacao da reserva, o hospede tem ate 24 horas antes do check-in para cancelar sem custo adicional. Cancelamentos feitos pelo WhatsApp ou e-mail serao confirmados em ate 2 horas uteis.",
  checkin_hora: "14:00",
  checkout_hora: "12:00",
  criancas_texto: "Criancas ate 5 anos nao pagam, utilizando a cama dos pais. Criancas de 6 a 12 anos pagam 50% da diaria. Acima de 12 anos, tarifa normal. Bercos sob disponibilidade e solicitacao previa.",
  pets_texto: "O Gaivota Hotel nao aceita animais de estimacao em suas dependencias.",
  pagamento_texto: "Aceitamos dinheiro, cartoes Visa, Mastercard, Elo, Hipercard e American Express, Pix e boleto bancario. O pagamento pode ser realizado no check-in ou com antecedencia mediante solicitacao.",
  faturamento_texto: "Aceitamos faturamento para empresas mediante apresentacao de contrato ou nota de empenho. Consulte nossa equipe pelo WhatsApp para mais informacoes.",
};

const AdminPolitica = () => {
  const [content, setContent] = useState<PolicyContent>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_slug", "politica")
        .eq("section_key", "main")
        .single();
      if (data && data.content) {
        setContent({ ...defaults, ...(data.content as Partial<PolicyContent>) });
        setRecordId(data.id);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload = { page_slug: "politica", section_key: "main", content: content as any };
    let error;
    if (recordId) {
      const res = await supabase.from("page_content").update({ content: content as any }).eq("id", recordId);
      error = res.error;
    } else {
      const res = await supabase.from("page_content").insert(payload).select().single();
      error = res.error;
      if (res.data) setRecordId(res.data.id);
    }
    setSaving(false);
    if (error) { toast.error("Erro ao salvar: " + error.message); return; }
    toast.success("Politica de reservas atualizada com sucesso!");
  };

  if (loading) {
    return <AdminLayout><div className="flex items-center justify-center h-64 text-muted-foreground">Carregando...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-primary" /> Politica de Reservas</h2>
            <p className="text-sm text-muted-foreground mt-1">Edite os textos que aparecem na pagina de Politica do site.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 shadow-sm disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar alteracoes"}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Importante:</strong> as alteracoes salvas aqui refletem imediatamente na pagina publica de Politica de Reservas do site.
          </div>
        </div>

        <div className="space-y-6">
          {/* Cancelamento */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Cancelamento de Reservas</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">Titulo da secao</label>
                <input value={content.cancelamento_titulo} onChange={(e) => setContent({ ...content, cancelamento_titulo: e.target.value })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Regra de prazo (24h) — exibida em destaque</label>
                <textarea value={content.cancelamento_prazo} onChange={(e) => setContent({ ...content, cancelamento_prazo: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Texto adicional de cancelamento</label>
                <textarea value={content.cancelamento_texto} onChange={(e) => setContent({ ...content, cancelamento_texto: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Check-in / Check-out */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Horarios de Check-in e Check-out</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold block mb-1">Horario de Check-in</label>
                <input value={content.checkin_hora} onChange={(e) => setContent({ ...content, checkin_hora: e.target.value })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="14:00" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Horario de Check-out</label>
                <input value={content.checkout_hora} onChange={(e) => setContent({ ...content, checkout_hora: e.target.value })} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="12:00" />
              </div>
            </div>
          </div>

          {/* Criancas */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Politica para Criancas</h3>
            <textarea value={content.criancas_texto} onChange={(e) => setContent({ ...content, criancas_texto: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-md border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none" />
          </div>

          {/* Pets */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Politica para Animais de Estimacao</h3>
            <textarea value={content.pets_texto} onChange={(e) => setContent({ ...content, pets_texto: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-md border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none" />
          </div>

          {/* Pagamento */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Formas de Pagamento</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">Texto sobre pagamento</label>
                <textarea value={content.pagamento_texto} onChange={(e) => setContent({ ...content, pagamento_texto: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Texto sobre faturamento</label>
                <textarea value={content.faturamento_texto} onChange={(e) => setContent({ ...content, faturamento_texto: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-md border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar alteracoes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPolitica;