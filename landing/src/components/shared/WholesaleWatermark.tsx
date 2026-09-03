"use client";

import { useMemo } from "react";

interface WholesaleWatermarkProps {
  userUid: string;
  className?: string;
}

/**
 * Dynamic watermark overlay for wholesale-only product images.
 * Renders a subtle diagonal text pattern with the user's UID
 * to discourage unauthorized screenshots.
 */
export function WholesaleWatermark({ userUid, className }: WholesaleWatermarkProps) {
  const shortUid = useMemo(() => userUid.slice(-8).toUpperCase(), [userUid]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-20 ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
        <span
          className="font-nav text-[10px] tracking-[0.2em] text-white whitespace-nowrap rotate-[-25deg]"
          style={{
            textShadow: "0 0 2px rgba(0,0,0,0.8)",
          }}
        >
          EXCLUSIVO MAYORISTA · ID {shortUid} · VOUS
        </span>
      </div>
      {/* Repeat pattern */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0 opacity-[0.08]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <span className="font-nav text-[9px] tracking-[0.15em] text-white rotate-[-25deg]">
              MAYORISTA {shortUid}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
