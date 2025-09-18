'use client';

import { useEffect, useState } from 'react';
import { History, TrendingUp, AlertCircle, CheckCircle, Clock, MapPin, Info } from 'lucide-react';
import { generateHistoricalRecommendations, historicalEvents, HistoricalEvent } from '@/lib/copernicusAPI';
import { WeatherData } from '@/types';

interface HistoricalAnalysisProps {
  weatherData: WeatherData | null;
  currentRiskScore: number;
}

interface HistoricalRecommendations {
  historicalContext: string;
  recommendations: string[];
  confidence: number;
  warningLevel: 'info' | 'watch' | 'advisory' | 'warning';
}

export default function HistoricalAnalysis({ weatherData, currentRiskScore }: HistoricalAnalysisProps) {
  const [analysis, setAnalysis] = useState<HistoricalRecommendations | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);

  useEffect(() => {
    if (weatherData) {
      const recommendations = generateHistoricalRecommendations({
        precipitation: weatherData.precipitation,
        windSpeed: weatherData.windSpeed,
        temperature: weatherData.temperature,
        pressure: weatherData.pressure
      }, currentRiskScore);
      setAnalysis(recommendations);
    }
  }, [weatherData, currentRiskScore]);

  const getWarningColor = (level: string) => {
    switch (level) {
      case 'warning': return 'text-red-600 bg-red-50 border-red-200';
      case 'advisory': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'watch': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getWarningIcon = (level: string) => {
    switch (level) {
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'advisory': return <TrendingUp className="w-5 h-5" />;
      case 'watch': return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getWarningLabel = (level: string) => {
    switch (level) {
      case 'warning': return 'Alerta Histórica';
      case 'advisory': return 'Aviso Histórico';
      case 'watch': return 'Vigilancia';
      default: return 'Información';
    }
  };

  if (!analysis) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Panel de Análisis Histórico */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Análisis Histórico (Copernicus ERA5)</h2>
        </div>

        <div className={`border rounded-lg p-4 mb-4 ${getWarningColor(analysis.warningLevel)}`}>
          <div className="flex items-center gap-2 mb-2">
            {getWarningIcon(analysis.warningLevel)}
            <span className="font-semibold text-lg">
              {getWarningLabel(analysis.warningLevel)}
            </span>
            <span className="text-sm">
              (Confianza: {analysis.confidence}%)
            </span>
          </div>
          <p className="text-sm mb-3">{analysis.historicalContext}</p>
          <div className="text-xs opacity-75">
            Score de riesgo actual: {currentRiskScore}/100
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Recomendaciones Históricas</h3>
          <div className="space-y-2">
            {analysis.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 <strong>Nota:</strong> Las recomendaciones históricas complementan, no reemplazan, las decisiones operativas en tiempo real.
          </p>
        </div>
      </div>

      {/* Panel de Eventos Históricos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-800">Eventos Históricos</h2>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {historicalEvents.map((event, index) => (
            <div 
              key={index}
              className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedEvent?.name === event.name ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedEvent(selectedEvent?.name === event.name ? null : event)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">{event.name}</h3>
                <span className="text-xs text-gray-500">{event.date}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                <div>💧 {event.maxPrecipitation} mm/h</div>
                <div>💨 {event.maxWindSpeed} m/s</div>
                <div>🌡️ {event.minTemperature}°C - {event.maxTemperature}°C</div>
                <div>📊 {event.minPressure} hPa</div>
              </div>

              {selectedEvent?.name === event.name && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{event.description}</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-xs text-red-800">
                      <strong>Impacto histórico:</strong> {event.impact}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            📊 Datos validados con Copernicus ERA5 Reanalysis (1979-presente)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            🎯 Patrones calibrados con eventos históricos de Madrid
          </p>
        </div>
      </div>
    </div>
  );
}