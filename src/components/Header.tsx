import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Phone } from "lucide-react";
import logoGaivota from "@/assets/logo-gaivota.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useSiteContacts } from "@/hooks/useSiteContacts";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { waUrl } = useSiteContacts();

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.quartos"), path: "/quartos" },
    { label: t("nav.estrutura"), path: "/estrutura" },
    { label: t("nav.contatos"), path: "/contatos" },
    { label: t("nav.politica"), path: "/politica-e-privacidade-de-reservas" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoGaivota} alt="Gaivota Hotel" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-accent ${
                location.pathname === item.path ? "text-accent" : "text-primary-foreground/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <a
            href={waUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pulse flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold"
          >
            <Phone className="w-4 h-4" />
            {t("nav.reservar")}
          </a>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button onClick={() => setIsOpen(!isOpen)} className="text-primary-foreground">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="md:hidden bg-foreground border-t border-border/20 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors hover:text-accent ${
                location.pathname === item.path ? "text-accent" : "text-primary-foreground/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="px-6 pt-2">
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-md text-sm font-semibold"
            >
              <Phone className="w-4 h-4" />
              {t("nav.reservarAgora")}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;