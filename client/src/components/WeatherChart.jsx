import React, { useState, useEffect } from 'react';

const apiUrl = "https://api.openweathermap.org/data/2.5/onecall";
const apiKey = "e7638d2370dd1bc2bf75db44bab71b8e";

export default function WeatherChart({ latLng }) {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the weather data for Vancouver by default
    async function getWeatherData() {
      try {
        const res = await fetch(`${apiUrl}?lat=${latLng.lat}&lon=${latLng.lng}&exclude=hourly,minutely&units=metric&appid=${apiKey}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      }
    }

    // Fetch weather data only if latLng is available
    if (latLng) {
      getWeatherData();
    }
  }, [latLng]);

  return (
    <div>
      {error && <p>Error fetching weather data: {error}</p>}
      {weatherData && (
        <>
          <p>Vancouver, {weatherData.current.temp}&#176;C, {weatherData.current.weather[0].description}</p>
          {/* Display more weather information if needed */}
        </>
      )}
    </div>
  );
}
