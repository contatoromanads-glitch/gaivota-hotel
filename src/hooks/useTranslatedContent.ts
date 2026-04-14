import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = "gaivota_translations";

interface CacheEntry {
  text: string;
  timestamp: number;
}

type TranslationCache = Record<string, CacheEntry>;

const getCache = (): TranslationCache => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
};

const setCache = (cache: TranslationCache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage full, clear old entries
    localStorage.removeItem(CACHE_KEY);
  }
};

const getCacheKey = (text: string, lang: string) => `v2:${lang}:${text.substring(0, 50)}`;

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useTranslatedContent = (texts: string[]): string[] => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.substring(0, 2) || "pt";
  const [translated, setTranslated] = useState<string[]>(texts);

  const translateTexts = useCallback(async () => {
    if (lang === "pt" || texts.length === 0) {
      setTranslated(texts);
      return;
    }

    const cache = getCache();
    const now = Date.now();
    const results: string[] = [...texts];
    const toTranslate: { index: number; text: string }[] = [];

    // Check cache first
    texts.forEach((text, i) => {
      if (!text) return;
      const key = getCacheKey(text, lang);
      const cached = cache[key];
      if (cached && now - cached.timestamp < CACHE_TTL) {
        results[i] = cached.text;
      } else {
        toTranslate.push({ index: i, text });
      }
    });

    if (toTranslate.length === 0) {
      setTranslated(results);
      return;
    }

    // Batch translate via edge function
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: {
          texts: toTranslate.map((t) => t.text),
          targetLang: lang === "en" ? "English" : lang === "zh" ? "Chinese (Mandarin)" : "Spanish",
        },
      });

      if (!error && data?.translations) {
        const newCache = { ...cache };
        toTranslate.forEach((item, i) => {
          const translatedText = data.translations[i] || item.text;
          results[item.index] = translatedText;
          newCache[getCacheKey(item.text, lang)] = { text: translatedText, timestamp: now };
        });
        setCache(newCache);
      }
    } catch {
      // Fallback: use original text
    }

    setTranslated(results);
  }, [texts.join("|"), lang]);

  useEffect(() => {
    translateTexts();
  }, [translateTexts]);

  return translated;
};

/** Translate a single string */
export const useTranslatedText = (text: string): string => {
  const result = useTranslatedContent([text]);
  return result[0] || text;
};
