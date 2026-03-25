import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  instagram: string;
  instagram_url: string;
  maps_embed_url: string;
}

const defaultContacts: ContactSettings = {
  phone: "(94) 99285-4456",
  whatsapp: "5594992854456",
  email: "gaivotahotelpara@gmail.com",
  address: "Av. São Geraldo n. 4, Centro",
  city: "Eldorado dos Carajás",
  state: "PA",
  cep: "68524-000",
  instagram: "@gaivotahotel_eldorado",
  instagram_url: "https://www.instagram.com/gaivotahotel_eldorado/",
  maps_embed_url: "",
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactSettings>(defaultContacts);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("key", "contacts").maybeSingle();
      if (data?.value) setContacts(data.value as unknown as ContactSettings);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", "contacts").maybeSingle();
    
    if (existing) {
      const { error } = await supabase.from("site_settings").update({ value: contacts as unknown as Record<string, unknown> }).eq("key", "contacts");
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("site_settings").insert({ key: "contacts", value: contacts as unknown as Record<string, unknown> });
      if (error) { toast.error(error.message); setSaving(false); return; }
    }
    
    toast.success("Contatos atualizados!");
    setSaving(false);
  };

  const Field = ({ label, field, placeholder, type = "text" }: { label: string; field: keyof ContactSettings; placeholder?: string; type?: string }) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={contacts[field]}
        onChange={(e) => setContacts({ ...contacts, [field]: e.target.value })}
        className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-6">Informações de Contato</h2>
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefone" field="phone" placeholder="(94) 99285-4456" />
            <Field label="WhatsApp (só números)" field="whatsapp" placeholder="5594992854456" />
          </div>
          <Field label="E-mail" field="email" type="email" />
          <Field label="Endereço" field="address" />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Cidade" field="city" />
            <Field label="Estado" field="state" />
            <Field label="CEP" field="cep" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Instagram (@)" field="instagram" />
            <Field label="URL Instagram" field="instagram_url" />
          </div>
          <div>
            <label className="text-sm font-medium">URL do Mapa (Google Maps embed)</label>
            <textarea
              value={contacts.maps_embed_url}
              onChange={(e) => setContacts({ ...contacts, maps_embed_url: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background resize-none text-xs"
              rows={3}
              placeholder="Cole a URL do iframe do Google Maps aqui"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
