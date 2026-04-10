export type WeatherCondition =
  | 'clear'
  | 'mainly_clear'
  | 'partly_cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy_rain'
  | 'snow'
  | 'showers'
  | 'thunderstorm';

export interface WeatherAsset {
  condition: WeatherCondition;
  labelJa: string;
  icon: string;
  /** Fallback gradient while photo loads (top → mid → bottom) */
  gradientColors: [string, string, string];
  /** Primary Unsplash photo URL */
  photoUrl: string;
  /** 0 = none, 1 = light, 2 = moderate, 3 = heavy */
  rainIntensity: 0 | 1 | 2 | 3;
  /** 0 = none, 1 = light, 2 = heavy */
  snowIntensity: 0 | 1 | 2;
  hasLightning: boolean;
  hasFog: boolean;
  darkText: boolean;
}

const UPX = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1080&q=85`;

const WMO_TO_CONDITION: Record<number, WeatherCondition> = {
  0: 'clear',
  1: 'mainly_clear',
  2: 'partly_cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  56: 'drizzle',
  57: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'heavy_rain',
  66: 'rain',
  67: 'heavy_rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'showers',
  81: 'showers',
  82: 'heavy_rain',
  85: 'snow',
  86: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};

const ASSETS: Record<WeatherCondition, WeatherAsset> = {
  clear: {
    condition: 'clear',
    labelJa: '快晴',
    icon: '☀️',
    gradientColors: ['#FDE68A', '#38BDF8', '#0284C7'],
    photoUrl: UPX('1470252649378-9c29740c9fa8'),
    rainIntensity: 0,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: false,
    darkText: false,
  },
  mainly_clear: {
    condition: 'mainly_clear',
    labelJa: '晴れ',
    icon: '🌤️',
    gradientColors: ['#BAE6FD', '#38BDF8', '#0369A1'],
    photoUrl: UPX('1504608524841-42584120d693'),
    rainIntensity: 0,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: false,
    darkText: false,
  },
  partly_cloudy: {
    condition: 'partly_cloudy',
    labelJa: '曇り時々晴れ',
    icon: '⛅',
    gradientColors: ['#CBD5E1', '#94A3B8', '#60A5FA'],
    photoUrl: UPX('1534088568595-a066f410bcda'),
    rainIntensity: 0,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: false,
    darkText: false,
  },
  overcast: {
    condition: 'overcast',
    labelJa: '曇り',
    icon: '☁️',
    gradientColors: ['#94A3B8', '#64748B', '#475569'],
    photoUrl: UPX('1483729558449-99ef09a8c325'),
    rainIntensity: 0,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: false,
    darkText: false,
  },
  fog: {
    condition: 'fog',
    labelJa: '霧',
    icon: '🌫️',
    gradientColors: ['#E2E8F0', '#CBD5E1', '#94A3B8'],
    photoUrl: UPX('1542272604-787c3835535d'),
    rainIntensity: 0,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: true,
    darkText: true,
  },
  drizzle: {
    condition: 'drizzle',
    labelJa: '霧雨',
    icon: '🌦️',
    gradientColors: ['#94A3B8', '#64748B', '#475569'],
    photoUrl: UPX('1519692933481-e162a57d6721'),
    rainIntensity: 1,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: false,
    darkText: false,
  },
  rain: {
    condition: 'rain',
    labelJa: '雨',
    icon: '🌧️',
    gradientColors: ['#475569', '#334155', '#1E293B'],
    photoUrl: UPX('1428592953211-078f628ca8c3'),
    rainIntensity: 2,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: false,
    darkText: false,
  },
  heavy_rain: {
    condition: 'heavy_rain',
    labelJa: '大雨',
    icon: '🌧️',
    gradientColors: ['#1E293B', '#0F172A', '#020617'],
    photoUrl: UPX('1468581264429-2548ef9eb732'),
    rainIntensity: 3,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: false,
    darkText: false,
  },
  showers: {
    condition: 'showers',
    labelJa: 'にわか雨',
    icon: '🌦️',
    gradientColors: ['#64748B', '#475569', '#334155'],
    photoUrl: UPX('1476820865390-c52aeebb9891'),
    rainIntensity: 2,
    snowIntensity: 0,
    hasLightning: false,
    hasFog: false,
    darkText: false,
  },
  snow: {
    condition: 'snow',
    labelJa: '雪',
    icon: '🌨️',
    gradientColors: ['#DBEAFE', '#BFDBFE', '#93C5FD'],
    photoUrl: UPX('1491002052546-bf20f0a694ee'),
    rainIntensity: 0,
    snowIntensity: 1,
    hasLightning: false,
    hasFog: false,
    darkText: true,
  },
  thunderstorm: {
    condition: 'thunderstorm',
    labelJa: '雷雨',
    icon: '⛈️',
    gradientColors: ['#1E1B4B', '#3B0764', '#0F172A'],
    photoUrl: UPX('1605727216801-e27ce1d0cc28'),
    rainIntensity: 3,
    snowIntensity: 0,
    hasLightning: true,
    hasFog: false,
    darkText: false,
  },
};

export function getWeatherAsset(weatherCode: number): WeatherAsset {
  const condition = WMO_TO_CONDITION[weatherCode] ?? 'overcast';
  return ASSETS[condition];
}

/** 時間帯に応じた大気オーバーレイの色を返す (rgba文字列) */
export function getTimeOverlay(hour: number): string {
  if (hour >= 0 && hour < 5)  return 'rgba(10, 20, 50, 0.58)';   // 深夜
  if (hour >= 5 && hour < 7)  return 'rgba(120, 60, 20, 0.30)';  // 夜明け
  if (hour >= 7 && hour < 9)  return 'rgba(255, 160, 60, 0.15)'; // 朝
  if (hour >= 18 && hour < 20) return 'rgba(200, 80, 20, 0.22)'; // 夕方
  if (hour >= 20 && hour < 22) return 'rgba(30, 20, 60, 0.40)';  // 薄暮
  if (hour >= 22)              return 'rgba(10, 20, 50, 0.55)';   // 夜
  return 'rgba(0, 0, 0, 0)';                                       // 昼間
}

/** Deterministic drop positions (avoids hydration mismatch with Math.random) */
function makeDeterministicDrops(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    delay: ((i * 17 + 3) % 20) / 10,
    duration: 0.45 + ((i * 7) % 5) / 10,
    opacity: 0.5 + ((i * 13) % 5) / 10,
    width: 1 + ((i * 3) % 2),
    size: 3 + ((i * 5) % 4),
    drift: ((i * 11) % 20) - 10,
  }));
}

export const DROP_SETS = {
  light: makeDeterministicDrops(25),
  moderate: makeDeterministicDrops(55),
  heavy: makeDeterministicDrops(100),
  snow_light: makeDeterministicDrops(40),
  snow_heavy: makeDeterministicDrops(80),
} as const;
