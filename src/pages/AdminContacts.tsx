import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Save, Phone, Mail, MapPin, Instagram, MessageCircle, Map, Info } from "lucide-react";
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
      if (data?.value) setContacts({ ...defaultContacts, ...(data.value as unknown as ContactSettings) });
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", "contacts").maybeSingle();
    const jsonValue = JSON.parse(JSON.stringify(contacts));

    if (existing) {
      const { error } = await supabase.from("site_settings").update({ value: jsonValue }).eq("key", "contacts");
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("site_settings").insert([{ key: "contacts", value: jsonValue }]);
      if (error) { toast.error(error.message); setSaving(false); return; }
    }

    toast.success("Contatos atualizados! Já estão visíveis no site.");
    setSaving(false);
  };

  const update = (field: keyof ContactSettings, value: string) =>
    setContacts({ ...contacts, [field]: value });

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-1">Informações de Contato</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Esses dados aparecem no rodapé, na página de contato e no botão de WhatsApp.
        </p>

        <div className="bg-card border rounded-2xl p-6 space-y-5">
          {/* Telefones */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Telefone</label>
              <p className="text-xs text-muted-foreground mb-1">Como aparece no site para clientes ligarem.</p>
              <input value={contacts.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="(94) 99285-4456" />
            </div>
            <div>
              <label className="text-sm font-semibold flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</label>
              <p className="text-xs text-muted-foreground mb-1">Apenas números, com código do país (55).</p>
              <input value={contacts.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" placeholder="5594992854456" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> E-mail</label>
            <input type="email" value={contacts.email} onChange={(e) => update("email", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
          </div>

          {/* Endereço */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
            <p className="text-sm font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Endereço do hotel</p>
            <div>
              <label className="text-xs text-muted-foreground">Rua e número</label>
              <input value={contacts.address} onChange={(e) => update("address", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Cidade</label>
                <input value={contacts.city} onChange={(e) => update("city", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Estado</label>
                <input value={contacts.state} onChange={(e) => update("state", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">CEP</label>
                <input value={contacts.cep} onChange={(e) => update("cep", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5" /> Instagram (@)</label>
              <input value={contacts.instagram} onChange={(e) => update("instagram", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Link completo do Instagram</label>
              <input value={contacts.instagram_url} onChange={(e) => update("instagram_url", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none" />
            </div>
          </div>

          {/* Maps */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-1.5"><Map className="w-3.5 h-3.5" /> Mapa do Google</label>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 my-2 flex gap-2 text-xs">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                Vá no <strong>Google Maps</strong>, busque seu hotel, clique em <em>Compartilhar → Incorporar um mapa</em>,
                copie o link que está dentro de <code className="bg-muted px-1 rounded">src="..."</code> e cole aqui.
              </div>
            </div>
            <textarea
              value={contacts.maps_embed_url}
              onChange={(e) => update("maps_embed_url", e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-background resize-none text-xs font-mono focus:ring-2 focus:ring-primary/30 focus:outline-none"
              rows={3}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>

          <div className="flex justify-end pt-3 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity shadow-sm"
            >
              <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
