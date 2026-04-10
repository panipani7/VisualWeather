export interface HourlyWeather {
  time: string;      // "2024-01-01T09:00"
  hour: number;      // 0–23
  temperature: number;
  feelsLike: number;
  precipitation: number;
  weatherCode: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: HourlyWeather[];
  currentHourIndex: number;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}` +
    `&hourly=temperature_2m,apparent_temperature,precipitation,weather_code` +
    `&timezone=auto&forecast_days=1`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const data = await res.json();

  const now = new Date();
  const currentHour = now.getHours();

  const hourly: HourlyWeather[] = (data.hourly.time as string[]).map(
    (time: string, i: number) => ({
      time,
      hour: parseInt(time.split('T')[1].split(':')[0], 10),
      temperature: Math.round(data.hourly.temperature_2m[i]),
      feelsLike: Math.round(data.hourly.apparent_temperature[i]),
      precipitation: Math.round(data.hourly.precipitation[i] * 10) / 10,
      weatherCode: data.hourly.weather_code[i] as number,
    })
  );

  const currentHourIndex = hourly.findIndex((h) => h.hour === currentHour);

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    hourly,
    currentHourIndex: currentHourIndex >= 0 ? currentHourIndex : 0,
  };
}
