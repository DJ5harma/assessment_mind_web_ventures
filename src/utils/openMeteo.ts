// Utility to fetch temperature_2m from Open-Meteo API for a given lat/lon and time range
export async function fetchTemperature(lat: number, lon: number, start: string, end: string) {
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch Open-Meteo data');
  const data = await res.json();
  return data.hourly?.temperature_2m || [];
}
