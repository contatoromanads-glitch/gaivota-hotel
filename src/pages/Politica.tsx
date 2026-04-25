import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Baby, CreditCard, PawPrint, CalendarCheck, AlertCircle, AlertTriangle } from "lucide-react";

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

const defaultPolicy: PolicyContent = {
  cancelamento_titulo: "Cancelamento de Reservas",
  cancelamento_prazo: "Cancelamentos devem ser realizados com minimo de 24 horas de antecedencia antes do check-in (14h), conforme o Codigo de Defesa do Consumidor (Art. 49). Reservas nao canceladas dentro desse prazo estao sujeitas a cobranca de 1 (uma) diaria.",
  cancelamento_texto: "Apos confirmacao da reserva, o hospede tem ate 24 horas antes do check-in para cancelar sem custo adicional.",
  checkin_hora: "14:00",
  checkout_hora: "12:00",
  criancas_texto: "Criancas ate 5 anos nao pagam, utilizando a cama dos pais. Criancas de 6 a 12 anos pagam 50% da diaria. Acima de 12 anos, tarifa normal. Bercos sob disponibilidade e solicitacao previa.",
  pets_texto: "O Gaivota Hotel nao aceita animais de estimacao em suas dependencias.",
  pagamento_texto: "Aceitamos dinheiro, cartoes Visa, Mastercard, Elo, Hipercard e American Express, Pix e boleto bancario.",
  faturamento_texto: "Aceitamos faturamento para empresas mediante apresentacao de contrato ou nota de empenho.",
};

const Politica = () => {
  const { t } = useTranslation();
  const [policy, setPolicy] = useState<PolicyContent>(defaultPolicy);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page_slug", "politica")
        .eq("section_key", "main")
        .single();
      if (data?.content) {
        setPolicy({ ...defaultPolicy, ...(data.content as Partial<PolicyContent>) });
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <section className="relative h-[40vh] min-h-[250px] flex items-center justify-center bg-foreground">
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3 animate-fade-in-up">
            {t("politica.heroTitle")}
          </h1>
          <p className="text-white/85 text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>{t("politica.heroSubtitle")}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <ScrollReveal>
            <p className="text-muted-foreground leading-relaxed mb-10 text-center">{t("politica.intro")}</p>
          </ScrollReveal>

          <div className="space-y-8">
            {/* Cancelamento */}
            <ScrollReveal delay={0}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarCheck className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-xl font-semibold">{policy.cancelamento_titulo}</h2>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 mb-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 leading-relaxed">{policy.cancelamento_prazo}</p>
                </div>
                {policy.cancelamento_texto && (
                  <p className="text-muted-foreground text-sm leading-relaxed">{policy.cancelamento_texto}</p>
                )}
              </div>
            </ScrollReveal>

            {/* Check-in / Check-out */}
            <ScrollReveal delay={0.1}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.checkinTitle")}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-warm rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground">{t("politica.checkinLabel")}</p>
                    <p className="text-2xl font-display font-bold text-primary">{policy.checkin_hora}</p>
                  </div>
                  <div className="bg-warm rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground">{t("politica.checkoutLabel")}</p>
                    <p className="text-2xl font-display font-bold text-primary">{policy.checkout_hora}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Criancas */}
            <ScrollReveal delay={0.2}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Baby className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.criancasTitle")}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{policy.criancas_texto}</p>
              </div>
            </ScrollReveal>

            {/* Pets */}
            <ScrollReveal delay={0.3}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <PawPrint className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.petsTitle")}</h2>
                </div>
                <div className="flex items-center gap-3 bg-primary/5 rounded-md p-4">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-muted-foreground">{policy.pets_texto}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Pagamento */}
            <ScrollReveal delay={0.4}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.pagamentoTitle")}</h2>
                </div>
                <p className="text-muted-foreground mb-4">{policy.pagamento_texto}</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {["Dinheiro", "Visa", "Mastercard", "Elo", "Pix", "Hiper", "American Express"].map((m) => (
                    <span key={m} className="bg-warm text-foreground text-sm px-3 py-1.5 rounded-md font-medium">{m}</span>
                  ))}
                </div>
                {policy.faturamento_texto && (
                  <div className="bg-secondary/10 rounded-md p-4 mt-4">
                    <p className="text-sm font-semibold text-secondary">{t("politica.faturamentoTitle")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{policy.faturamento_texto}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ReviewsCarousel />
    </Layout>
  );
};

export default Politica;