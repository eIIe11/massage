"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

type Lang = { code: string; label: string };

const langs: Lang[] = [
  { code: "en", label: "English" },
  { code: "th", label: "ไทย" },
  { code: "zh-CN", label: "中文" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: unknown;
  }
}

function setCookie(name: string, value: string) {
  const host = window.location.hostname;
  document.cookie = `${name}=${value};path=/`;
  document.cookie = `${name}=${value};path=/;domain=.${host}`;
}

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const [current, setCurrent] = useState<Lang>(langs[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Load the Google Translate library once.
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      const g = window.google as
        | { translate?: { TranslateElement: new (o: object, el: string) => void } }
        | undefined;
      if (g?.translate) {
        new g.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: langs.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // Reflect current language from cookie on mount.
  useEffect(() => {
    const m = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (m) {
      const found = langs.find((l) => l.code === m[1]);
      if (found) setCurrent(found);
    }
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const choose = (lang: Lang) => {
    setCurrent(lang);
    setOpen(false);
    if (lang.code === "en") {
      setCookie("googtrans", "");
      // Clearing the translation requires a reload to restore the source page.
      window.location.reload();
      return;
    }
    setCookie("googtrans", `/en/${lang.code}`);
    // Drive the hidden Google combo if it's ready; otherwise reload with cookie.
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = lang.code;
      combo.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  return (
    <div ref={ref} className="relative notranslate" translate="no">
      <div id="google_translate_element" className="hidden" />
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose language"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition ${
          dark
            ? "border-black/10 text-ink hover:bg-luxe-50"
            : "border-cream/30 text-cream/90 hover:bg-white/10"
        }`}
      >
        <Globe className="h-4 w-4" />
        <span>{current.label}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-luxe">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => choose(l)}
              className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-luxe-50 ${
                current.code === l.code ? "font-semibold text-luxe-700" : "text-ink"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
