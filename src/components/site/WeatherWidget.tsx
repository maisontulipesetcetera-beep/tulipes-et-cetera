"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      setError(true);
      return;
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Waldighoffen,FR&units=metric&lang=fr&appid=${apiKey}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setWeather({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      })
      .catch(() => setError(true));
  }, []);

  if (error || !weather) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white shadow-sm">
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
        alt={weather.description}
        width={32}
        height={32}
        className="shrink-0"
      />
      <span className="font-body text-sm font-semibold">{weather.temp}°C</span>
      <span className="font-body text-sm text-white/80 capitalize hidden sm:inline">
        {weather.description}
      </span>
    </div>
  );
}
