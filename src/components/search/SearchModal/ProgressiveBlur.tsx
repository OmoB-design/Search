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
// Each layer has a gradient mask that determines its visible band; combined,
// they produce a smooth blur ramp from transparent at the top to fully blurred
// at the bottom — identical to the multi-stop blur effect in Figma.
const LAYER_CONFIG = [
  { blurRatio: 0.04, maskFrom:  0, maskTo: 22 },
  { blurRatio: 0.14, maskFrom: 15, maskTo: 42 },
  { blurRatio: 0.32, maskFrom: 32, maskTo: 62 },
  { blurRatio: 0.62, maskFrom: 52, maskTo: 82 },
  { blurRatio: 1.0,  maskFrom: 68, maskTo: 100 },
] as const;

export function ProgressiveBlur({
  height,
  maxBlur,
  saturation,
  brightness,
  tintColor,
  tintOpacity,
}: ProgressiveBlurProps) {
  return (
    <div
      className="absolute left-0 right-0 bottom-0 pointer-events-none z-10"
      style={{ height }}
    >
      {LAYER_CONFIG.map(({ blurRatio, maskFrom, maskTo }, i) => {
        const blur = maxBlur * blurRatio;
        const filter = `blur(${blur.toFixed(2)}px) saturate(${saturation}) brightness(${brightness})`;
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

      {/* Tint overlay — gives the frosted glass surface color */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, transparent 10%, ${tintColor} 100%)`,
          opacity: tintOpacity,
        }}
      />
    </div>
  );
}
