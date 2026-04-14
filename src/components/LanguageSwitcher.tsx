import { useTranslation } from "react-i18next";
import flagBR from "@/assets/flag-br.png";
import flagUS from "@/assets/flag-us.png";
import flagES from "@/assets/flag-es.png";
import flagCN from "@/assets/flag-cn.png";

const languages = [
  { code: "pt", flag: flagBR, label: "Português" },
  { code: "en", flag: flagUS, label: "English" },
  { code: "es", flag: flagES, label: "Español" },
  { code: "zh", flag: flagCN, label: "中文" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.substring(0, 2) || "pt";

  return (
    <div className="flex items-center gap-1.5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          title={lang.label}
          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
            currentLang === lang.code
              ? "border-white scale-110 shadow-md"
              : "border-white/40 opacity-60 hover:opacity-100 hover:border-white/70"
          }`}
        >
          <img
            src={lang.flag}
            alt={lang.label}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
