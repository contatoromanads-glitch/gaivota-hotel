import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { Clock, Baby, CreditCard, PawPrint, CalendarCheck, AlertCircle } from "lucide-react";

const Politica = () => {
  const { t } = useTranslation();

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
            <ScrollReveal delay={0}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarCheck className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.cancelamentoTitle")}</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span dangerouslySetInnerHTML={{ __html: t("politica.cancelamento1") }} />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    {t("politica.cancelamento2")}
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.checkinTitle")}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-warm rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground">{t("politica.checkinLabel")}</p>
                    <p className="text-2xl font-display font-bold text-primary">14:00</p>
                  </div>
                  <div className="bg-warm rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground">{t("politica.checkoutLabel")}</p>
                    <p className="text-2xl font-display font-bold text-primary">12:00</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Baby className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.criancasTitle")}</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span>{t("politica.crianca1")}</li>
                  <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span><span dangerouslySetInnerHTML={{ __html: t("politica.crianca2") }} /></li>
                  <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span><span dangerouslySetInnerHTML={{ __html: t("politica.crianca3") }} /></li>
                  <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span>{t("politica.crianca4")}</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <PawPrint className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.petsTitle")}</h2>
                </div>
                <div className="flex items-center gap-3 bg-primary/5 rounded-md p-4">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("politica.petsMsg") }} />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="bg-card rounded-lg border p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-xl font-semibold">{t("politica.pagamentoTitle")}</h2>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {["Dinheiro", "Visa", "Mastercard", "Elo", "Pix", "Hiper", "American Express"].map((m) => (
                    <span key={m} className="bg-warm text-foreground text-sm px-3 py-1.5 rounded-md font-medium">{m}</span>
                  ))}
                </div>
                <div className="bg-secondary/10 rounded-md p-4 mt-4">
                  <p className="text-sm font-semibold text-secondary">{t("politica.faturamentoTitle")}</p>
                  <p className="text-sm text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: t("politica.faturamentoDesc") }} />
                </div>
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
