"use client";

import { useEffect, useState } from "react";

const CONFETTI_COLORS = ["#ffb000", "#05b96e", "#ef476f", "#118ab2", "#f6bd14", "#8e44ff"];

type Piece = {
  color: string;
  delay: number;
  drift: number;
  duration: number;
  height: number;
  left: number;
  spin: number;
  width: number;
};

function buildPieces(count: number): Piece[] {
  return Array.from({ length: count }, () => {
    const width = 6 + Math.random() * 7;
    return {
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 220,
      duration: 2.6 + Math.random() * 1.6,
      height: width * (0.5 + Math.random()),
      left: Math.random() * 100,
      spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
      width,
    };
  });
}

/**
 * Chuva de confete em CSS puro para celebrar a conclusão de um fluxo.
 * Renderiza só depois de montar (evita mismatch de hidratação), toca uma vez
 * e se auto-remove ao terminar. Respeita prefers-reduced-motion via globals.css.
 */
export function Celebration({ count = 46, durationMs = 4200 }: { count?: number; durationMs?: number }) {
  const [pieces, setPieces] = useState<Piece[] | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- gera o confete só no cliente, após a hidratação, para o servidor não emitir marcação aleatória divergente
    setPieces(buildPieces(count));
    const timeout = window.setTimeout(() => setPieces(null), durationMs);

    return () => window.clearTimeout(timeout);
  }, [count, durationMs]);

  if (!pieces) {
    return null;
  }

  return (
    <div aria-hidden="true" className="confetti-layer">
      {pieces.map((piece, index) => (
        <span
          className="confetti-piece"
          key={index}
          style={
            {
              "--c": piece.color,
              "--delay": `${piece.delay}s`,
              "--drift": `${piece.drift}px`,
              "--dur": `${piece.duration}s`,
              "--h": `${piece.height}px`,
              "--spin": `${piece.spin}deg`,
              "--w": `${piece.width}px`,
              "--x": `${piece.left}%`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
