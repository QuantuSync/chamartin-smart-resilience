'use client';

import PlatformCard from '@/components/PlatformCard';
import DANASimulator from '@/components/DANASimulator';
import { useWeatherData } from '@/lib/useWeatherData';
import { RefreshCw, Cloud, Thermometer, Droplets, Activity } from 'lucide-react';

export default function Home() {
  const { 
    weatherData, 
    platforms, 
    loading, 
    lastUpdate, 
    dataSource, 
    isSimulating,
    refreshData,
    simulateWeather,
    resetSimulation 
  } = useWeatherData();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getHighRiskPlatforms = () => {
    return platforms.filter(p => p.riskScore >= 70).length;
  };

  const getMediumRiskPlatforms = () => {
    return platforms.filter(p => p.riskScore >= 50 && p.riskScore < 70).length;
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
            <div className="flex items-center gap-4">
              {isSimulating && (
                <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="font-medium">Simulación Activa</span>
                </div>
              )}
              <button
                onClick={refreshData}
                disabled={loading || isSimulating}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>

          {weatherData && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Condiciones Actuales</h2>
                <div className="text-right">
                  {lastUpdate && (
                    <span className="text-sm text-gray-500 block">
                      Última actualización: {formatTime(lastUpdate)}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isSimulating ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {dataSource}
                  </span>
                </div>
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

          {/* Resumen de riesgos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold">Riesgo Alto</h3>
              <p className="text-2xl font-bold text-red-600">{getHighRiskPlatforms()}</p>
              <p className="text-sm text-red-600">andenes afectados</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-semibold">Riesgo Medio</h3>
              <p className="text-2xl font-bold text-yellow-600">{getMediumRiskPlatforms()}</p>
              <p className="text-sm text-yellow-600">andenes en alerta</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold">Operativo Normal</h3>
              <p className="text-2xl font-bold text-green-600">{8 - getHighRiskPlatforms() - getMediumRiskPlatforms()}</p>
              <p className="text-sm text-green-600">andenes seguros</p>
            </div>
          </div>
        </header>

        {/* Simulador DANA */}
        <DANASimulator 
          onSimulate={simulateWeather}
          onReset={resetSimulation}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </main>
  );
}