'use client';

import { useEffect, useRef } from 'react';
import { HourlyWeather } from '@/lib/weather';

interface TimeAxisProps {
  hourly: HourlyWeather[];
  activeIndex: number;
  currentIndex: number;
  onSelectHour: (index: number) => void;
}

export default function TimeAxis({
  hourly,
  activeIndex,
  currentIndex,
  onSelectHour,
}: TimeAxisProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll to keep active hour visible
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const containerLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const elLeft = el.offsetLeft;
      const elWidth = el.clientWidth;

      const targetScroll = elLeft - containerWidth / 2 + elWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto gap-1 px-3 py-2 scrollbar-hide"
      style={{ scrollbarWidth: 'none' }}
    >
      {hourly.map((h, i) => {
        const isActive = i === activeIndex;
        const isCurrent = i === currentIndex;

        return (
          <button
            key={h.time}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelectHour(i)}
            className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-white/90 shadow-md scale-105'
                : 'bg-white/20 hover:bg-white/35 active:scale-95'
            }`}
            style={{ minWidth: '48px', height: '44px' }}
          >
            <span
              className={`text-sm font-semibold ${
                isActive ? 'text-gray-800' : 'text-white/80'
              }`}
            >
              {isCurrent && !isActive ? '今' : `${h.hour}時`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
