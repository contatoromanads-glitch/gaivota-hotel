import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Save, FileText } from "lucide-react";
import { toast } from "sonner";

interface ContentBlock {
  id?: string;
  page_slug: string;
  section_key: string;
  content: Record<string, string>;
}

const sections = [
  { page_slug: "home", section_key: "hero", label: "Home — Hero", fields: ["title", "subtitle"] },
  { page_slug: "home", section_key: "about", label: "Home — Sobre o Hotel", fields: ["title", "text1", "text2"] },
  { page_slug: "quartos", section_key: "intro", label: "Quartos — Introdução", fields: ["title", "subtitle", "text"] },
  { page_slug: "estrutura", section_key: "hero", label: "Estrutura — Hero", fields: ["title", "subtitle"] },
  { page_slug: "estrutura", section_key: "services", label: "Estrutura — Serviços Anexos", fields: ["title", "text"] },
  { page_slug: "contatos", section_key: "hero", label: "Contatos — Hero", fields: ["title", "subtitle"] },
  { page_slug: "politica", section_key: "intro", label: "Política — Introdução", fields: ["text"] },
  { page_slug: "politica", section_key: "cancelamento", label: "Política — Cancelamento", fields: ["text1", "text2"] },
  { page_slug: "politica", section_key: "checkin", label: "Política — Check-in/out", fields: ["checkin", "checkout"] },
  { page_slug: "politica", section_key: "criancas", label: "Política — Crianças", fields: ["text"] },
  { page_slug: "politica", section_key: "pets", label: "Política — Pets", fields: ["text"] },
  { page_slug: "politica", section_key: "pagamento", label: "Política — Pagamento", fields: ["methods", "corporate_text"] },
];

const fieldLabels: Record<string, string> = {
  title: "Título", subtitle: "Subtítulo", text: "Texto", text1: "Texto 1", text2: "Texto 2",
  checkin: "Horário check-in", checkout: "Horário check-out", methods: "Métodos de pagamento",
  corporate_text: "Texto faturamento empresas",
};

const AdminContent = () => {
  const [blocks, setBlocks] = useState<Record<string, ContentBlock>>({});
  const [saving, setSaving] = useState<string | null>(null);

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

    toast.success("Salvo!");
    setSaving(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-6">Conteúdo das Páginas</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Edite os textos que aparecem em cada seção do site. Deixe em branco para usar o texto padrão.
        </p>

        <div className="space-y-4">
          {sections.map((sec) => {
            const block = getBlock(sec.page_slug, sec.section_key);
            const key = `${sec.page_slug}:${sec.section_key}`;
            return (
              <div key={key} className="bg-card border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">{sec.label}</h3>
                </div>
                <div className="space-y-3">
                  {sec.fields.map((field) => (
                    <div key={field}>
                      <label className="text-xs font-medium text-muted-foreground">{fieldLabels[field] || field}</label>
                      {field.includes("text") || field === "corporate_text" ? (
                        <textarea
                          value={block.content[field] || ""}
                          onChange={(e) => updateField(sec.page_slug, sec.section_key, field, e.target.value)}
                          rows={2}
                          className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm resize-none"
                        />
                      ) : (
                        <input
                          value={block.content[field] || ""}
                          onChange={(e) => updateField(sec.page_slug, sec.section_key, field, e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => saveBlock(sec.page_slug, sec.section_key)}
                  disabled={saving === key}
                  className="mt-3 flex items-center gap-1 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-medium disabled:opacity-50"
                >
                  <Save className="w-3 h-3" /> {saving === key ? "Salvando..." : "Salvar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
