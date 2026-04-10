import { WeatherCondition } from '@/lib/weatherAssets';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  /** 'light' = white strokes (on photo), 'dark' = dark strokes (on white bg) */
  variant?: 'light' | 'dark';
  className?: string;
}

const COLOR = {
  light: {
    sun: '#FDE68A',
    cloud: '#FFFFFF',
    rain: '#93C5FD',
    snow: '#FFFFFF',
    lightning: '#FDE68A',
    fog: '#FFFFFF',
    stroke: '#FFFFFF',
  },
  dark: {
    sun: '#F59E0B',
    cloud: '#64748B',
    rain: '#60A5FA',
    snow: '#93C5FD',
    lightning: '#FBBF24',
    fog: '#94A3B8',
    stroke: '#475569',
  },
};

// ─── Shape primitives ──────────────────────────────────────────────────────

/** 丸みのある雲 */
function Cloud({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <path
      d="M11 20H6a5 5 0 0 1-.5-9.97A7 7 0 1 1 19 14h-2a5 5 0 0 1-6 6z"
      fill={c.cloud}
    />
  );
}

/** 小さい雲（右下オフセット） */
function SmallCloud({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <path
      d="M15 22H10.5A4 4 0 0 1 10 14.08a5.5 5.5 0 0 1 10.92 1.42H22a3 3 0 0 1-2 5.5z"
      fill={c.cloud}
    />
  );
}

/** 太陽（円 + 光線） */
function Sun({ c, cx = 12, cy = 12, r = 4 }: { c: ReturnType<typeof getColors>; cx?: number; cy?: number; r?: number }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  const inner = r + 2.5;
  const outer = r + 5;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={c.sun} />
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * inner;
        const y1 = cy + Math.sin(rad) * inner;
        const x2 = cx + Math.cos(rad) * outer;
        const y2 = cy + Math.sin(rad) * outer;
        return (
          <line
            key={deg}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={c.sun} strokeWidth="1.8" strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

/** 雨粒（縦線） */
function RainDrops({ c, count = 3, startX = 7, gapX = 3.5, y1 = 20, y2 = 23 }: {
  c: ReturnType<typeof getColors>;
  count?: number;
  startX?: number;
  gapX?: number;
  y1?: number;
  y2?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <line
          key={i}
          x1={startX + i * gapX} y1={y1}
          x2={startX - 1 + i * gapX} y2={y2}
          stroke={c.rain} strokeWidth="1.8" strokeLinecap="round"
        />
      ))}
    </>
  );
}

/** 雪の結晶（＊型） */
function SnowFlakes({ c, positions }: { c: ReturnType<typeof getColors>; positions: [number, number][] }) {
  return (
    <>
      {positions.map(([cx, cy], i) => (
        <g key={i}>
          <line x1={cx - 2.5} y1={cy} x2={cx + 2.5} y2={cy} stroke={c.snow} strokeWidth="1.6" strokeLinecap="round" />
          <line x1={cx} y1={cy - 2.5} x2={cx} y2={cy + 2.5} stroke={c.snow} strokeWidth="1.6" strokeLinecap="round" />
          <line x1={cx - 1.8} y1={cy - 1.8} x2={cx + 1.8} y2={cy + 1.8} stroke={c.snow} strokeWidth="1.6" strokeLinecap="round" />
          <line x1={cx + 1.8} y1={cy - 1.8} x2={cx - 1.8} y2={cy + 1.8} stroke={c.snow} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
    </>
  );
}

/** 霧の水平線 */
function FogLines({ c }: { c: ReturnType<typeof getColors> }) {
  const lines = [
    { x1: 3, x2: 21, y: 12 },
    { x1: 5, x2: 19, y: 15.5 },
    { x1: 3, x2: 21, y: 19 },
  ];
  return (
    <>
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y} x2={l.x2} y2={l.y}
          stroke={c.fog} strokeWidth="2" strokeLinecap="round"
          opacity={i === 1 ? 0.7 : 1}
        />
      ))}
    </>
  );
}

function getColors(variant: 'light' | 'dark') {
  return COLOR[variant];
}

// ─── Icon definitions ──────────────────────────────────────────────────────

function IconClear({ c }: { c: ReturnType<typeof getColors> }) {
  return <Sun c={c} cx={12} cy={12} r={5} />;
}

function IconMainlyClear({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <Sun c={c} cx={9} cy={9} r={3.5} />
      <SmallCloud c={c} />
    </>
  );
}

function IconPartlyCloudy({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <Sun c={c} cx={8} cy={8.5} r={3.5} />
      <path
        d="M12 19H7.5A4.5 4.5 0 0 1 7 10.1a6.5 6.5 0 0 1 12.4 1.4H21a3 3 0 0 1-2 5.5z"
        fill={c.cloud}
      />
    </>
  );
}

function IconOvercast({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <path
        d="M9 18H6A5 5 0 0 1 5.5 8.1a7 7 0 0 1 13 2A4 4 0 0 1 20 18h-2"
        fill={c.cloud} opacity={0.6}
      />
      <Cloud c={c} />
    </>
  );
}

function IconFog({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <path
        d="M12 6H8A5 5 0 0 0 7.5 16H12"
        fill="none" stroke={c.fog} strokeWidth="1.5"
      />
      <FogLines c={c} />
    </>
  );
}

function IconDrizzle({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <Cloud c={c} />
      <RainDrops c={c} count={2} startX={8.5} gapX={4.5} y1={20} y2={22.5} />
    </>
  );
}

function IconRain({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <Cloud c={c} />
      <RainDrops c={c} count={3} startX={7} gapX={3.5} y1={20} y2={23} />
    </>
  );
}

function IconHeavyRain({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <Cloud c={c} />
      <RainDrops c={c} count={4} startX={5.5} gapX={3.2} y1={20} y2={23.5} />
    </>
  );
}

function IconShowers({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <Sun c={c} cx={8} cy={7} r={3} />
      <path
        d="M13 17H9.5A4 4 0 0 1 9 9.1a5.5 5.5 0 0 1 10.5 1.5H21a3 3 0 0 1-2 6.4z"
        fill={c.cloud}
      />
      <RainDrops c={c} count={3} startX={8} gapX={3.5} y1={20} y2={23} />
    </>
  );
}

function IconSnow({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <Cloud c={c} />
      <SnowFlakes c={c} positions={[[8, 22], [12.5, 22], [17, 22]]} />
    </>
  );
}

function IconThunderstorm({ c }: { c: ReturnType<typeof getColors> }) {
  return (
    <>
      <Cloud c={c} />
      {/* lightning bolt */}
      <path
        d="M13 20l-2 4h4l-2 4"
        stroke={c.lightning} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <RainDrops c={c} count={2} startX={7} gapX={8} y1={20} y2={23} />
    </>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────

const ICON_MAP: Record<WeatherCondition, (props: { c: ReturnType<typeof getColors> }) => React.ReactElement> = {
  clear: IconClear,
  mainly_clear: IconMainlyClear,
  partly_cloudy: IconPartlyCloudy,
  overcast: IconOvercast,
  fog: IconFog,
  drizzle: IconDrizzle,
  rain: IconRain,
  heavy_rain: IconHeavyRain,
  showers: IconShowers,
  snow: IconSnow,
  thunderstorm: IconThunderstorm,
};

export default function WeatherIcon({ condition, size = 24, variant = 'dark', className }: WeatherIconProps) {
  const c = getColors(variant);
  const Icon = ICON_MAP[condition];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <Icon c={c} />
    </svg>
  );
}
