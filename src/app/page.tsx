'use client';

import PlatformCard from '@/components/PlatformCard';
import { useWeatherData } from '@/lib/useWeatherData';
import { RefreshCw, Cloud, Thermometer, Droplets } from 'lucide-react';

export default function Home() {
  const { weatherData, platforms, loading, lastUpdate, refreshData } = useWeatherData();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Chamartín Smart Resilience
              </h1>
              <p className="text-xl text-gray-600">
                Sistema de monitorización y predicción climática en tiempo real
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {weatherData && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Condiciones Actuales</h2>
                {lastUpdate && (
                  <span className="text-sm text-gray-500">
                    Última actualización: {formatTime(lastUpdate)}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="text-lg font-medium">{weatherData.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="text-lg font-medium">{weatherData.humidity.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-gray-500" />
                  <span className="text-lg font-medium">{weatherData.precipitation.toFixed(1)} mm/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-medium">{weatherData.windSpeed.toFixed(1)} m/s</span>
                </div>
              </div>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </main>
  );
}