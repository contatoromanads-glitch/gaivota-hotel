import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { VisaLogo, AmexLogo, BoletoLogo, BrazilFlag } from "./PaymentLogos";
import logoGaivota from "@/assets/logo-gaivota.png";
import logoElo from "@/assets/logo-elo.png";
import logoPix from "@/assets/logo-pix.png";
import logoHipercard from "@/assets/logo-hipercard.png";
import logoMastercard from "@/assets/logo-mastercard.png";
import { useSiteContacts } from "@/hooks/useSiteContacts";

const Footer = () => {
  const { t } = useTranslation();
  const { contacts, waUrl } = useSiteContacts();

  return (
    <footer className="bg-foreground text-primary-foreground/80 text-base">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* Brand */}
          <div className="flex flex-col items-center">
            <Link to="/" className="inline-block mb-3">
              <img src={logoGaivota} alt="Gaivota Hotel" className="h-16 w-auto" />
            </Link>
            <p className="text-base leading-relaxed mb-4">{t("footer.tagline")}</p>
            <a
              href={contacts.instagram_url || "https://www.instagram.com/gaivotahotel_eldorado/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-base"
            >
              <Instagram className="w-4 h-4" />
              {contacts.instagram || "@gaivotahotel_eldorado"}
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">{t("footer.navegacao")}</h4>
            <nav className="flex flex-col items-center gap-2 text-base">
              <Link to="/" className="hover:text-accent transition-colors">{t("nav.home")}</Link>
              <Link to="/quartos" className="hover:text-accent transition-colors">{t("nav.quartos")}</Link>
              <Link to="/estrutura" className="hover:text-accent transition-colors">{t("nav.estrutura")}</Link>
              <Link to="/contatos" className="hover:text-accent transition-colors">{t("nav.contatos")}</Link>
              <Link to="/politica-e-privacidade-de-reservas" className="hover:text-accent transition-colors">{t("footer.politicaCancelamento")}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center">
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">{t("footer.contato")}</h4>
            <div className="flex flex-col items-center gap-3 text-base">
              <a href={`tel:+${contacts.whatsapp}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent" />
                {contacts.phone}
              </a>
              <a href={`mailto:${contacts.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4 text-accent" />
                {contacts.email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>
                  {contacts.address}<br />
                  {contacts.city}, {contacts.state}<br />
                  CEP {contacts.cep}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods & bottom */}
        <div className="mt-10 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-sm uppercase tracking-wider mr-1 text-primary-foreground/50">{t("footer.formasPagamento")}</span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><VisaLogo className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><img src={logoMastercard} alt="Mastercard" className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><img src={logoElo} alt="Elo" className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><img src={logoPix} alt="Pix" className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><img src={logoHipercard} alt="Hipercard" className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><AmexLogo className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><BoletoLogo className="h-5 w-auto" /></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BrazilFlag className="h-4 w-auto" />
              <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
            </div>
          </div>
          <p className="text-center text-sm mt-4 text-primary-foreground/50">{t("footer.faturamento")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;