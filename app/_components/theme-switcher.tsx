"use client";

import { useEffect, useState } from "react";
import { Check, Leaf, Monitor, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STORAGE_KEY = "suwave:lojista:theme";

type ThemeId = "auto" | "classic" | "fresh" | "night";

const themeOptions: Array<{
  description: string;
  icon: LucideIcon;
  id: ThemeId;
  label: string;
  swatches: [string, string, string];
}> = [
  {
    description: "Claro, padrão Suwave",
    icon: Sun,
    id: "classic",
    label: "Classic",
    swatches: ["#ffffff", "#ffb000", "#111317"],
  },
  {
    description: "Escuro, descanso visual",
    icon: Moon,
    id: "night",
    label: "Night",
    swatches: ["#14171c", "#ffb000", "#f4f6f8"],
  },
  {
    description: "Claro, verde-mercado",
    icon: Leaf,
    id: "fresh",
    label: "Fresh",
    swatches: ["#f2f7f3", "#f6bd14", "#0e2b1a"],
  },
  {
    description: "Acompanha o sistema",
    icon: Monitor,
    id: "auto",
    label: "Automático",
    swatches: ["#ffffff", "#14171c", "#ffb000"],
  },
];

function applyTheme(id: ThemeId) {
  const resolved =
    id === "auto"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "night"
        : "classic"
      : id;

  if (resolved === "classic") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = resolved;
  }
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("classic");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && themeOptions.some((option) => option.id === stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura do localStorage só após a hidratação, para o servidor e o cliente renderizarem igual
        setTheme(stored as ThemeId);
      }
    } catch {
      // Local storage pode estar indisponivel em navegadores restritos.
    }
  }, []);

  function selectTheme(id: ThemeId) {
    setTheme(id);
    applyTheme(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Local storage pode estar indisponivel em navegadores restritos.
    }
  }

  return (
    <section className="anim-rise anim-d3 mt-5 rounded-[8px] border border-line bg-surface p-3">
      <h2 className="text-[15px] font-black">Tema do app</h2>
      <p className="mt-1 text-xs font-bold text-ink-3">
        A escolha vale para todas as telas e fica salva neste aparelho.
      </p>
      <div className="stagger mt-3 grid grid-cols-2 gap-2">
        {themeOptions.map(({ description, icon: Icon, id, label, swatches }) => {
          const active = theme === id;

          return (
            <button
              aria-pressed={active}
              className={`press hover-lift grid gap-2 rounded-[10px] border p-3 text-left ${
                active ? "border-brand bg-brand-soft" : "border-line bg-surface"
              }`}
              key={id}
              onClick={() => selectTheme(id)}
              type="button"
            >
              <span className="flex items-center justify-between">
                <Icon
                  aria-hidden="true"
                  className={`h-[18px] w-[18px] ${active ? "text-brand" : "text-ink-3"}`}
                  strokeWidth={2.2}
                />
                {active ? (
                  <span className="anim-pop grid h-5 w-5 place-items-center rounded-full bg-brand text-[#050505]">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                ) : null}
              </span>
              <span className="text-sm font-black text-ink">{label}</span>
              <span className="text-[11px] font-bold leading-tight text-ink-3">{description}</span>
              <span className="flex gap-1.5">
                {swatches.map((swatch) => (
                  <span
                    className="h-4 w-4 rounded-full border border-line-strong"
                    key={swatch}
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
