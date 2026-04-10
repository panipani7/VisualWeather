'use client';

import { WeatherAsset, DROP_SETS, getTimeOverlay } from '@/lib/weatherAssets';
import WeatherIcon from './WeatherIcon';
import { useEffect, useRef, useState } from 'react';

// ─── Weather effect layers ────────────────────────────────────────────────

function RainLayer({ intensity }: { intensity: 1 | 2 | 3 }) {
  const drops =
    intensity === 1
      ? DROP_SETS.light
      : intensity === 2
      ? DROP_SETS.moderate
      : DROP_SETS.heavy;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute rain-drop"
          style={{
            left: `${d.left}%`,
            top: '-10%',
            width: `${d.width}px`,
            height: intensity === 1 ? '12px' : intensity === 2 ? '18px' : '24px',
            background: 'rgba(180,210,255,0.7)',
            borderRadius: '1px',
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
            transform: 'rotate(15deg)',
          }}
        />
      ))}
    </div>
  );
}

function SnowLayer({ intensity }: { intensity: 1 | 2 }) {
  const drops = intensity === 1 ? DROP_SETS.snow_light : DROP_SETS.snow_heavy;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute snow-flake"
          style={{
            left: `${d.left}%`,
            top: '-5%',
            width: `${d.size}px`,
            height: `${d.size}px`,
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '50%',
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration * 3 + 2}s`,
            opacity: d.opacity,
            '--drift': `${d.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function FogLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 fog-layer" style={{ background: 'rgba(226,232,240,0.45)' }} />
      <div className="absolute inset-0 fog-layer-2" style={{ background: 'rgba(203,213,225,0.3)' }} />
    </div>
  );
}

function LightningLayer() {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const schedule = () =>
      setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 180);
        schedule();
      }, 3500 + ((Date.now() % 7000)));
    const id = schedule();
    return () => clearTimeout(id);
  }, []);
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-100"
      style={{ background: '#7C3AED', opacity: flash ? 0.4 : 0 }}
    />
  );
}

function SunGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none flex justify-center">
      <div
        className="sun-glow rounded-full mt-16"
        style={{
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(253,224,71,0.55) 0%, rgba(253,224,71,0) 70%)',
        }}
      />
    </div>
  );
}

// ─── Photo background with crossfade ─────────────────────────────────────

interface PhotoBgProps {
  photoUrl: string;
  gradientColors: [string, string, string];
}

function PhotoBackground({ photoUrl, gradientColors }: PhotoBgProps) {
  const [shownUrl, setShownUrl] = useState(photoUrl);
  const [prevUrl, setPrevUrl] = useState('');
  const [frontOpacity, setFrontOpacity] = useState(1);
  const [photoFailed, setPhotoFailed] = useState(false);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (photoUrl === shownUrl) return;

    // Fade out current → swap → fade in new
    setFrontOpacity(0);
    if (transitionRef.current) clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => {
      setPrevUrl(shownUrl);
      setShownUrl(photoUrl);
      setPhotoFailed(false);
      // Next frame: fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFrontOpacity(1));
      });
    }, 500);

    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, [photoUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const gradient = `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[2]})`;

  return (
    <div className="absolute inset-0" style={{ background: gradient }}>
      {/* Previous photo (stays visible during crossfade) */}
      {prevUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={prevUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 1 }}
        />
      )}
      {/* Current photo fades in */}
      {!photoFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={shownUrl}
          src={shownUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: frontOpacity,
            transition: 'opacity 0.9s ease',
          }}
          onLoad={() => setFrontOpacity(1)}
          onError={() => setPhotoFailed(true)}
        />
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────

interface WeatherHeroProps {
  asset: WeatherAsset;
  hour: number;
  isPlaying: boolean;
  onTap: () => void;
  playbackLabel: string;
}

export default function WeatherHero({
  asset,
  hour,
  isPlaying,
  onTap,
  playbackLabel,
}: WeatherHeroProps) {
  const timeOverlay = getTimeOverlay(hour);
  const isNight = hour < 6 || hour >= 21;
  const textClass = asset.darkText && !isNight ? 'text-gray-900' : 'text-white';

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-pointer select-none"
      onClick={onTap}
    >
      {/* Layer 1: Real photo + gradient fallback */}
      <PhotoBackground
        photoUrl={asset.photoUrl}
        gradientColors={asset.gradientColors}
      />

      {/* Layer 2: Time-of-day atmospheric overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-[2000ms]"
        style={{ background: timeOverlay }}
      />

      {/* Layer 3: Weather effects */}
      {asset.condition === 'clear' && !isNight && <SunGlow />}
      {asset.hasFog && <FogLayer />}
      {asset.rainIntensity > 0 && (
        <RainLayer intensity={asset.rainIntensity as 1 | 2 | 3} />
      )}
      {asset.snowIntensity > 0 && (
        <SnowLayer intensity={asset.snowIntensity as 1 | 2} />
      )}
      {asset.hasLightning && <LightningLayer />}

      {/* Layer 4: Play / pause button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black/25 border border-white/30 backdrop-blur-sm">
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="4" width="4" height="16" rx="1" fill="white" />
              <rect x="14" y="4" width="4" height="16" rx="1" fill="white" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: 'translateX(2px)' }}>
              <path d="M8 5L19 12L8 19V5Z" fill="white" />
            </svg>
          )}
        </div>
        <span
          className="text-xs font-medium tracking-wide text-white opacity-80"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
        >
          {playbackLabel}
        </span>
      </div>

      {/* Layer 5: Condition badge */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-sm"
        >
          <WeatherIcon condition={asset.condition} size={14} variant="light" />
          <span className="text-xs font-semibold text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {asset.labelJa}
          </span>
        </div>
      </div>
    </div>
  );
}
