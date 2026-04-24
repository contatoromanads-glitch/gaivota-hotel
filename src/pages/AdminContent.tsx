import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Save, FileText, ChevronDown, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContentBlock {
  id?: string;
  page_slug: string;
  section_key: string;
  content: Record<string, string>;
}

const sections = [
  { page_slug: "home", section_key: "hero", label: "Banner principal", description: "Texto grande no topo da Home", fields: ["title", "subtitle"] },
  { page_slug: "home", section_key: "about", label: "Sobre o Hotel", description: "Apresentação do hotel na Home", fields: ["title", "text1", "text2"] },
  { page_slug: "quartos", section_key: "intro", label: "Introdução de Quartos", description: "Texto explicativo no topo da página de quartos", fields: ["title", "subtitle", "text"] },
  { page_slug: "estrutura", section_key: "hero", label: "Banner de Estrutura", description: "Topo da página de estrutura", fields: ["title", "subtitle"] },
  { page_slug: "estrutura", section_key: "services", label: "Serviços Anexos", description: "Bloco de serviços oferecidos", fields: ["title", "text"] },
  { page_slug: "contatos", section_key: "hero", label: "Banner de Contatos", description: "Topo da página de contato", fields: ["title", "subtitle"] },
  { page_slug: "politica", section_key: "intro", label: "Introdução da Política", description: "Texto inicial da página", fields: ["text"] },
  { page_slug: "politica", section_key: "cancelamento", label: "Política de Cancelamento", description: "Regras sobre cancelamento", fields: ["text1", "text2"] },
  { page_slug: "politica", section_key: "checkin", label: "Check-in / Check-out", description: "Horários", fields: ["checkin", "checkout"] },
  { page_slug: "politica", section_key: "criancas", label: "Política para Crianças", description: "", fields: ["text"] },
  { page_slug: "politica", section_key: "pets", label: "Política de Pets", description: "", fields: ["text"] },
  { page_slug: "politica", section_key: "pagamento", label: "Formas de Pagamento", description: "", fields: ["methods", "corporate_text"] },
];

const pageLabels: Record<string, string> = {
  home: "🏠 Página Inicial (Home)",
  quartos: "🛏️ Quartos",
  estrutura: "🏨 Estrutura",
  contatos: "📞 Contatos",
  politica: "📜 Política e Reservas",
};

const fieldLabels: Record<string, string> = {
  title: "Título", subtitle: "Subtítulo", text: "Texto", text1: "Primeiro parágrafo", text2: "Segundo parágrafo",
  checkin: "Horário de check-in", checkout: "Horário de check-out", methods: "Métodos aceitos",
  corporate_text: "Texto sobre faturamento (empresas)",
};

const AdminContent = () => {
  const [blocks, setBlocks] = useState<Record<string, ContentBlock>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [openPage, setOpenPage] = useState<string>("home");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("page_content").select("*");
      if (data) {
        const map: Record<string, ContentBlock> = {};
        data.forEach((d) => {
          map[`${d.page_slug}:${d.section_key}`] = {
            id: d.id,
            page_slug: d.page_slug,
            section_key: d.section_key,
            content: d.content as unknown as Record<string, string>,
          };
        });
        setBlocks(map);
      }
    };
    load();
  }, []);

  const getBlock = (pageSlug: string, sectionKey: string): ContentBlock => {
    const key = `${pageSlug}:${sectionKey}`;
    return blocks[key] || { page_slug: pageSlug, section_key: sectionKey, content: {} };
  };

  const updateField = (pageSlug: string, sectionKey: string, field: string, value: string) => {
    const key = `${pageSlug}:${sectionKey}`;
    const block = getBlock(pageSlug, sectionKey);
    setBlocks({ ...blocks, [key]: { ...block, content: { ...block.content, [field]: value } } });
  };

  const saveBlock = async (pageSlug: string, sectionKey: string) => {
    const key = `${pageSlug}:${sectionKey}`;
    setSaving(key);
    const block = getBlock(pageSlug, sectionKey);

    const jsonContent = JSON.parse(JSON.stringify(block.content));
    if (block.id) {
      const { error } = await supabase.from("page_content").update({ content: jsonContent }).eq("id", block.id);
      if (error) { toast.error(error.message); setSaving(null); return; }
    } else {
      const { error, data } = await supabase.from("page_content").insert([{
        page_slug: pageSlug,
        section_key: sectionKey,
        content: jsonContent,
      }]).select().single();
      if (error) { toast.error(error.message); setSaving(null); return; }
      if (data) setBlocks({ ...blocks, [key]: { ...block, id: data.id } });
    }

    toast.success("Texto atualizado no site!");
    setSaving(null);
  };

  // Group sections by page
  const grouped = sections.reduce((acc, sec) => {
    if (!acc[sec.page_slug]) acc[sec.page_slug] = [];
    acc[sec.page_slug].push(sec);
    return acc;
  }, {} as Record<string, typeof sections>);

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-1">Textos das Páginas</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Edite títulos, parágrafos e demais textos espalhados pelas páginas do site.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80">
            Clique em uma <strong>página</strong> para abrir suas seções editáveis. Deixe um campo
            em branco para usar o texto padrão original.
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(grouped).map(([pageSlug, secs]) => {
            const isOpen = openPage === pageSlug;
            return (
              <div key={pageSlug} className="bg-card border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenPage(isOpen ? "" : pageSlug)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="font-display font-bold">{pageLabels[pageSlug] || pageSlug}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {secs.length} seções
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="border-t p-4 space-y-4 bg-muted/10">
                    {secs.map((sec) => {
                      const block = getBlock(sec.page_slug, sec.section_key);
                      const key = `${sec.page_slug}:${sec.section_key}`;
                      return (
                        <div key={key} className="bg-card border rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-sm">{sec.label}</h3>
                          </div>
                          {sec.description && <p className="text-xs text-muted-foreground mb-3">{sec.description}</p>}
                          <div className="space-y-3">
                            {sec.fields.map((field) => (
                              <div key={field}>
                                <label className="text-xs font-semibold text-foreground/70">{fieldLabels[field] || field}</label>
                                {field.includes("text") || field === "corporate_text" ? (
                                  <textarea
                                    value={block.content[field] || ""}
                                    onChange={(e) => updateField(sec.page_slug, sec.section_key, field, e.target.value)}
                                    rows={3}
                                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                                  />
                                ) : (
                                  <input
                                    value={block.content[field] || ""}
                                    onChange={(e) => updateField(sec.page_slug, sec.section_key, field, e.target.value)}
                                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => saveBlock(sec.page_slug, sec.section_key)}
                            disabled={saving === key}
                            className="mt-3 flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
                          >
                            {saving === key ? <><Loader2 className="w-3 h-3 animate-spin" /> Salvando…</> : <><Save className="w-3 h-3" /> Salvar</>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
