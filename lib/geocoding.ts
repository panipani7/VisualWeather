export interface LocationInfo {
  city: string;
  district?: string;
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationInfo> {
  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?lat=${lat.toFixed(6)}&lon=${lon.toFixed(6)}&format=json&accept-language=ja`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'VisualWeatherApp/1.0 (MVP)' },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);

  const data = await res.json();
  const addr = data.address ?? {};

  const city =
    addr.city ??
    addr.town ??
    addr.village ??
    addr.municipality ??
    addr.county ??
    '現在地';

  const district =
    addr.suburb ??
    addr.neighbourhood ??
    addr.quarter ??
    addr.city_district ??
    undefined;

  return { city, district };
}
