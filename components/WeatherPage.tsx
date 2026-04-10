'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWeather, WeatherData } from '@/lib/weather';
import { reverseGeocode, LocationInfo } from '@/lib/geocoding';
import { getWeatherAsset } from '@/lib/weatherAssets';
import WeatherHero from './WeatherHero';
import TimeAxis from './TimeAxis';
import WeatherIcon from './WeatherIcon';

type Status = 'loading' | 'denied' | 'ready' | 'error';

const PLAYBACK_INTERVAL_MS = 1800;
const PLAYBACK_HOURS_AHEAD = 8;

export default function WeatherPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackEnd, setPlaybackEnd] = useState(0);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (lat: number, lon: number) => {
    try {
      const [weatherData, locationData] = await Promise.all([
        fetchWeather(lat, lon),
        reverseGeocode(lat, lon).catch(() => ({ city: '現在地' })),
      ]);
      setWeather(weatherData);
      setLocation(locationData);
      setDisplayIndex(weatherData.currentHourIndex);
      setPlaybackEnd(
        Math.min(
          weatherData.currentHourIndex + PLAYBACK_HOURS_AHEAD,
          weatherData.hourly.length - 1
        )
      );
      setStatus('ready');
    } catch {
      setErrorMessage('天気データの取得に失敗しました');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMessage('位置情報がサポートされていません');
      setStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => load(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
        } else {
          setErrorMessage('位置情報を取得できませんでした');
          setStatus('error');
        }
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [load]);

  // Playback engine
  useEffect(() => {
    if (isPlaying && weather) {
      playIntervalRef.current = setInterval(() => {
        setDisplayIndex((prev) => {
          if (prev >= playbackEnd) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, PLAYBACK_INTERVAL_MS);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, weather, playbackEnd]);

  const handleTap = useCallback(() => {
    if (!weather) return;
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    // If at the end, restart from current hour
    if (displayIndex >= playbackEnd) {
      setDisplayIndex(weather.currentHourIndex);
    }
    setIsPlaying(true);
  }, [isPlaying, weather, displayIndex, playbackEnd]);

  const handleSelectHour = useCallback(
    (index: number) => {
      setIsPlaying(false);
      setDisplayIndex(index);
    },
    []
  );

  // ─── Render states ────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-sky-400 to-sky-700">
        <div className="text-center text-white">
          <div className="text-5xl mb-4 animate-pulse">🌍</div>
          <p className="text-sm opacity-80">位置情報を取得中...</p>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-slate-600 to-slate-800 px-8">
        <div className="text-center text-white">
          <div className="text-5xl mb-4">📍</div>
          <h2 className="text-lg font-semibold mb-2">位置情報が必要です</h2>
          <p className="text-sm opacity-70 leading-relaxed">
            天気を取得するには、ブラウザの設定から位置情報のアクセスを許可してください。
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-slate-600 to-slate-800 px-8">
        <div className="text-center text-white">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-sm opacity-80">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const activeHour = weather.hourly[displayIndex];
  const asset = getWeatherAsset(activeHour.weatherCode);
  const textClass = asset.darkText ? 'text-gray-800' : 'text-white';
  const subTextClass = asset.darkText ? 'text-gray-600' : 'text-white/70';

  const now = new Date();
  const dateStr = now.toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const isAtEnd = displayIndex >= playbackEnd;
  const playbackLabel = isPlaying
    ? '一時停止'
    : isAtEnd
    ? 'もう一度再生'
    : '今後の天気を再生';

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${asset.gradientColors[0]}, ${asset.gradientColors[2]})`,
        transition: 'background 1.2s ease',
      }}
    >
      {/* ── Weather Hero（画面最上部まで拡張） ───────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <WeatherHero
          asset={asset}
          hour={activeHour.hour}
          isPlaying={isPlaying}
          onTap={handleTap}
          playbackLabel={playbackLabel}
        />

        {/* 地点情報・日時 — 上部オーバーレイ */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          <div className="px-5 pt-4 pb-8">
            <div className="flex items-center gap-1 text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" />
              </svg>
              <span className="text-base font-bold" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {location?.district
                  ? `${location.district}、${location.city}`
                  : location?.city ?? '現在地'}
              </span>
            </div>
            <p className="text-xs mt-0.5 text-white/70 pl-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              {dateStr}
            </p>
          </div>
        </div>

        {/* 時間軸 — 下部オーバーレイ */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)' }}
        >
          <div className="pointer-events-auto pb-3 pt-6">
            <TimeAxis
              hourly={weather.hourly}
              activeIndex={displayIndex}
              currentIndex={weather.currentHourIndex}
              onSelectHour={handleSelectHour}
            />
          </div>
        </div>
      </div>

      {/* ── Info panel ───────────────────────────────────────────────── */}
      <div className="flex-none px-5 pt-4 pb-6 bg-white">
        <div className="flex items-center justify-between">
          {/* Left: weather icon */}
          <WeatherIcon condition={asset.condition} size={96} variant="dark" />

          {/* Right: temperature + precipitation */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-col items-end">
              <div className={`text-xs font-semibold tracking-wider text-gray-400`}>気温</div>
              <div className="text-3xl font-semibold leading-tight text-gray-800">
                {activeHour.temperature}°
              </div>
              <div className={`text-xs text-gray-400`}>体感 {activeHour.feelsLike}°</div>
            </div>
            <div className="flex flex-col items-end">
              <div className={`text-xs font-semibold tracking-wider text-gray-400`}>降水量</div>
              <div className="text-3xl font-semibold leading-tight text-gray-800">
                {activeHour.precipitation > 0 ? `${activeHour.precipitation}` : '−'}
              </div>
              <div className={`text-xs text-gray-400`}>
                {activeHour.precipitation > 0 ? 'mm / 時間' : '　'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
