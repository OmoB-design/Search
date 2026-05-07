'use client';

interface ProgressiveBlurProps {
  height: number;
  maxBlur: number;
  saturation: number;
  brightness: number;
  tintColor: string;
  tintOpacity: number;
}

// 5-layer progressive blur that mirrors Figma's layered blur compositor.
// Each layer covers an overlapping vertical band; combined they produce a
// smooth exponential blur ramp identical to multi-stop blur in Figma.
// Layers are ordered from lightest (top) to heaviest (bottom).
const LAYER_CONFIG = [
  { blurRatio: 0.02, maskFrom:  0, maskTo: 20 },
  { blurRatio: 0.10, maskFrom: 10, maskTo: 40 },
  { blurRatio: 0.26, maskFrom: 28, maskTo: 60 },
  { blurRatio: 0.56, maskFrom: 48, maskTo: 80 },
  { blurRatio: 1.00, maskFrom: 65, maskTo: 100 },
] as const;

export function ProgressiveBlur({
  height,
  maxBlur,
  saturation,
  brightness,
  tintColor,
  tintOpacity,
}: ProgressiveBlurProps) {
  if (!height || !maxBlur) return null;

  return (
    <div
      className="absolute left-0 right-0 bottom-0 pointer-events-none z-10"
      style={{ height }}
    >
      {LAYER_CONFIG.map(({ blurRatio, maskFrom, maskTo }, i) => {
        const blur = maxBlur * blurRatio;
        // saturation=0 means no change (saturate(1)), positive values boost saturation
        const filter = `blur(${blur.toFixed(2)}px) saturate(${(1 + saturation).toFixed(2)}) brightness(${brightness})`;
        const mask = `linear-gradient(to bottom, transparent ${maskFrom}%, black ${maskTo}%)`;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backdropFilter: filter,
              WebkitBackdropFilter: filter,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}

      {/* Tint overlay — frosted glass surface color */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, transparent 0%, ${tintColor} 100%)`,
          opacity: tintOpacity,
        }}
      />
    </div>
  );
}
