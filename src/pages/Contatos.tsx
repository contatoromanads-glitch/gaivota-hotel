import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Phone, Mail, MapPin, Instagram, Send } from "lucide-react";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteContacts } from "@/hooks/useSiteContacts";

const Contatos = () => {
  const { t } = useTranslation();
  const { contacts, waUrl } = useSiteContacts();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" });

  const faqData = Array.from({ length: 6 }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      t("contatos.whatsappMsg", { nome: form.nome, email: form.email, telefone: form.telefone, mensagem: form.mensagem })
    );
    window.open(`https://wa.me/${contacts.whatsapp}?text=${msg}`, "_blank");
  };

  const mapsUrl =
    contacts.maps_embed_url ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.123!2d-49.319!3d-6.342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGaivota+Hotel!5e0!3m2!1spt-BR!2sbr!4v1600000000000";

  return (
    <Layout>
      <section className="relative h-[40vh] min-h-[250px] flex items-center justify-center bg-foreground">
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3 animate-fade-in-up">
            {t("contatos.heroTitle")}
          </h1>
          <p className="text-white/85 text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>{t("contatos.heroSubtitle")}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <h2 className="font-display text-2xl font-bold mb-6">{t("contatos.infoTitle")}</h2>
              <div className="space-y-5">
                <a href={`tel:+${contacts.whatsapp}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("contatos.reservasWhatsapp")}</p>
                    <p className="font-semibold">{contacts.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${contacts.email}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("contatos.email")}</p>
                    <p className="font-semibold">{contacts.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("contatos.endereco")}</p>
                    <p className="font-semibold">{contacts.address}</p>
                    <p className="text-sm text-muted-foreground">{contacts.city}, {contacts.state} — CEP {contacts.cep}</p>
                  </div>
                </div>
                <a
                  href={contacts.instagram_url || "https://www.instagram.com/gaivotahotel_eldorado/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Instagram className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("contatos.instagram")}</p>
                    <p className="font-semibold">{contacts.instagram || "@gaivotahotel_eldorado"}</p>
                  </div>
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <h2 className="font-display text-2xl font-bold mb-6">{t("contatos.enviarTitle")}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder={t("contatos.placeholderNome")} required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                <input type="email" placeholder={t("contatos.placeholderEmail")} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                <input type="tel" placeholder={t("contatos.placeholderTelefone")} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" />
                <textarea placeholder={t("contatos.placeholderMensagem")} rows={4} required value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-shadow" />
                <button type="submit" className="cta-pulse flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold">
                  <Send className="w-4 h-4" />
                  {t("contatos.enviarBtn")}
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ReviewsCarousel />

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">{t("faq.title")}</h2>
          </ScrollReveal>
          <ScrollReveal>
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-5 shadow-sm">
                  <AccordionTrigger className="text-left text-sm md:text-base font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px]">
        <iframe
          title="Localização Gaivota Hotel"
          src={mapsUrl}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </Layout>
  );
};

export default Contatos;