import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ContactSettings {
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

const defaults: ContactSettings = {
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

let cached: ContactSettings | null = null;

export function useSiteContacts() {
  const [contacts, setContacts] = useState<ContactSettings>(cached ?? defaults);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contacts")
      .maybeSingle()
      .then(({ data }) => {
        const merged = data?.value
          ? { ...defaults, ...(data.value as unknown as ContactSettings) }
          : defaults;
        cached = merged;
        setContacts(merged);
        setLoading(false);
      });
  }, []);

  const waUrl = (msg?: string) =>
    `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(
      msg ?? "Vim do site, gostaria de fazer uma reserva direta!"
    )}`;

  return { contacts, loading, waUrl };
}