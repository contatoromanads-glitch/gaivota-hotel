import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import {
  VisaLogo, MastercardLogo, EloLogo, PixLogo,
  HipercardLogo, AmexLogo, BoletoLogo, BrazilFlag,
} from "./PaymentLogos";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-3">
              Gaivota <span className="text-accent">Hotel</span>
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Conforto, natureza e hospitalidade no coração da Amazônia Paraense.
            </p>
            <a
              href="https://www.instagram.com/gaivotahotel_eldorado/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm"
            >
              <Instagram className="w-4 h-4" />
              @gaivotahotel_eldorado
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Navegação</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <Link to="/quartos" className="hover:text-accent transition-colors">Quartos</Link>
              <Link to="/estrutura" className="hover:text-accent transition-colors">Estrutura</Link>
              <Link to="/contatos" className="hover:text-accent transition-colors">Contatos</Link>
              <Link to="/politica-e-privacidade-de-reservas" className="hover:text-accent transition-colors">Política de Cancelamento</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Contato</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+5594992854456" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent" />
                (94) 99285-4456
              </a>
              <a href="mailto:gaivotahotelpara@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4 text-accent" />
                gaivotahotelpara@gmail.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Av. São Geraldo n. 4, Centro<br />Eldorado dos Carajás, PA<br />CEP 68524-000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods & bottom */}
        <div className="mt-10 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-xs uppercase tracking-wider mr-1 text-primary-foreground/50">Formas de pagamento:</span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><VisaLogo className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><MastercardLogo className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><EloLogo className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><PixLogo className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><HipercardLogo className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><AmexLogo className="h-5 w-auto" /></div>
                <div className="bg-white rounded px-2 py-1 flex items-center justify-center"><BoletoLogo className="h-5 w-auto" /></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <BrazilFlag className="h-4 w-auto" />
              <span>© {new Date().getFullYear()} Gaivota Hotel. Todos os direitos reservados.</span>
            </div>
          </div>
          <p className="text-center text-xs mt-4 text-primary-foreground/50">
            Faturamento para empresas disponível via boleto bancário.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
