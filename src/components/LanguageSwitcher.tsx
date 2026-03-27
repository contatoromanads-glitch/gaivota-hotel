import { useTranslation } from "react-i18next";

const languages = [
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.substring(0, 2) || "pt";

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          title={lang.label}
          className={`text-lg leading-none w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            currentLang === lang.code
              ? "bg-primary/20 scale-110 ring-2 ring-accent"
              : "hover:bg-primary-foreground/10 opacity-70 hover:opacity-100"
          }`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
