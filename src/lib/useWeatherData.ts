'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherData, Platform } from '@/types';
import { fetchWeatherData } from './weatherAPI';
import { platforms as initialPlatforms } from '@/data/mockData';

export function useWeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [originalWeatherData, setOriginalWeatherData] = useState<WeatherData | null>(null);

  const calculateRiskScore = useCallback((weather: WeatherData, platform: Platform): number => {
    let score = 0;
    
    // Factor lluvia (30%)
    const rainFactor = weather.precipitation > 5 ? 100 : 
                      weather.precipitation > 0.5 ? 50 : 0;
    score += rainFactor * 0.30;
    
    // Factor viento (25%)
    const windFactor = weather.windSpeed > 14 ? 100 :
                      weather.windSpeed > 8 ? 60 : 0;
    score += windFactor * 0.25;
    
    // Factor exposición del andén (15%)
    const exposureFactor = platform.isRoofed ? 0 : platform.exposure * 100;
    score += exposureFactor * 0.15;
    
    // Factor humedad alta (10%)
    const humidityFactor = weather.humidity > 85 ? 50 : 0;
    score += humidityFactor * 0.10;
    
    // Factor temperatura extrema (10%)
    const tempFactor = (weather.temperature > 35 || weather.temperature < 0) ? 70 : 0;
    score += tempFactor * 0.10;
    
    // Factor presión (10%)
    const pressureFactor = weather.pressure < 1000 ? 30 : 0;
    score += pressureFactor * 0.10;
    
    return Math.min(Math.round(score), 100);
  }, []);

  const updatePlatformScores = useCallback((weather: WeatherData) => {
    const updatedPlatforms = initialPlatforms.map(platform => ({
      ...platform,
      riskScore: calculateRiskScore(weather, platform)
    }));
    setPlatforms(updatedPlatforms);
  }, [calculateRiskScore]);

  const updateWeatherData = useCallback(async () => {
    if (isSimulating) return;
    
    setLoading(true);
    try {
      const newWeatherData = await fetchWeatherData();
      
      if (newWeatherData) {
        setWeatherData(newWeatherData);
        setDataSource('APIs en vivo');
        updatePlatformScores(newWeatherData);
        setLastUpdate(new Date());
        
        if (!originalWeatherData) {
          setOriginalWeatherData(newWeatherData);
        }
      }
    } catch (error) {
      console.error('Error updating weather data:', error);
    } finally {
      setLoading(false);
    }
  }, [isSimulating, originalWeatherData, updatePlatformScores]);

  const simulateWeather = (simulatedData: WeatherData) => {
    setIsSimulating(true);
    setWeatherData(simulatedData);
    setDataSource('Simulación DANA');
    updatePlatformScores(simulatedData);
    setLastUpdate(new Date());
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    if (originalWeatherData) {
      setWeatherData(originalWeatherData);
      setDataSource('APIs en vivo');
      updatePlatformScores(originalWeatherData);
      setLastUpdate(new Date());
    } else {
      updateWeatherData();
    }
  };

  useEffect(() => {
    updateWeatherData();
    const interval = setInterval(updateWeatherData, 900000);
    return () => clearInterval(interval);
  }, [updateWeatherData]);

  return {
    weatherData,
    platforms,
    loading,
    lastUpdate,
    dataSource,
    isSimulating,
    refreshData: updateWeatherData,
    simulateWeather,
    resetSimulation
  };
}