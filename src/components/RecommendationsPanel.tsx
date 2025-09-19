import { WeatherData, Platform } from '@/types';
import { AlertTriangle, Users, Shield, Umbrella, CheckCircle, Info } from 'lucide-react';

interface RecommendationsPanelProps {
  weatherData: WeatherData;
  platforms: Platform[];
}

interface Recommendation {
  type: 'critical' | 'medium' | 'preventive';
  title: string;
  description: string;
  action: string;
  platforms?: string[];
  passengerImpact?: number;
}

export default function RecommendationsPanel({ weatherData, platforms }: RecommendationsPanelProps) {
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    const mediumRiskPlatforms = platforms.filter(p => p.riskScore >= 50 && p.riskScore < 70);

    // CRÍTICAS: Solo para situaciones realmente peligrosas
    if (weatherData.precipitation > 10) {
      const highRiskPlatforms = platforms.filter(p => p.riskScore >= 70);
      recommendations.push({
        type: 'critical',
        title: 'Lluvia Torrencial - Riesgo de Inundación',
        description: `Precipitación extrema de ${weatherData.precipitation.toFixed(1)} mm/h`,
        action: 'Suspender servicios en andenes descubiertos y evacuar si es necesario',
        platforms: platforms.filter(p => !p.isRoofed && p.riskScore >= 70).map(p => p.name),
        passengerImpact: platforms.filter(p => !p.isRoofed && p.riskScore >= 70).length * 150
      });
    }

    if (weatherData.windSpeed > 20) {
      const highRiskPlatforms = platforms.filter(p => p.riskScore >= 70);
      recommendations.push({
        type: 'critical',
        title: 'Vientos Extremos - Peligro para Pasajeros',
        description: `Viento de ${weatherData.windSpeed.toFixed(1)} m/s supera límites de seguridad`,
        action: 'Suspender operaciones en andenes expuestos inmediatamente',
        platforms: platforms.filter(p => !p.isRoofed).map(p => p.name),
        passengerImpact: platforms.filter(p => !p.isRoofed).length * 150
      });
    }

    // MEDIAS: Requieren vigilancia pero no pánico
    if (weatherData.precipitation > 2 && weatherData.precipitation <= 10) {
      recommendations.push({
        type: 'medium',
        title: 'Lluvia Intensa - Vigilancia Necesaria',
        description: `Lluvia de ${weatherData.precipitation.toFixed(1)} mm/h puede afectar andenes descubiertos`,
        action: 'Reforzar personal de limpieza y colocar señalización de precaución',
        platforms: mediumRiskPlatforms.filter(p => !p.isRoofed).map(p => p.name),
        passengerImpact: mediumRiskPlatforms.filter(p => !p.isRoofed).length * 100
      });
    }

    if (weatherData.windSpeed > 12 && weatherData.windSpeed <= 20) {
      recommendations.push({
        type: 'medium',
        title: 'Viento Fuerte - Precaución',
        description: `Viento de ${weatherData.windSpeed.toFixed(1)} m/s requiere supervisión`,
        action: 'Aumentar vigilancia en andenes expuestos y alertar a pasajeros',
        platforms: mediumRiskPlatforms.filter(p => !p.isRoofed).map(p => p.name)
      });
    }

    if (weatherData.temperature < -2) {
      recommendations.push({
        type: 'medium',
        title: 'Temperaturas Bajo Cero - Riesgo de Hielo',
        description: `${weatherData.temperature.toFixed(1)}°C puede generar superficies resbaladizas`,
        action: 'Activar protocolo antihielo y aumentar señalización de seguridad'
      });
    }

    if (weatherData.temperature > 38) {
      recommendations.push({
        type: 'medium',
        title: 'Temperatura Extrema - Riesgo para Pasajeros',
        description: `${weatherData.temperature.toFixed(1)}°C puede causar malestar en andenes expuestos`,
        action: 'Habilitar áreas de sombra adicionales y aumentar disponibilidad de agua'
      });
    }

    // PREVENTIVAS: Información útil sin alarmar
    if (weatherData.pressure < 995 && weatherData.pressure >= 990) {
      recommendations.push({
        type: 'preventive',
        title: 'Presión Baja - Posible Cambio Meteorológico',
        description: `Presión de ${weatherData.pressure.toFixed(0)} hPa sugiere condiciones cambiantes`,
        action: 'Revisar pronóstico extendido y preparar equipos si se prevé empeoramiento'
      });
    }

    if (weatherData.humidity > 90 && weatherData.temperature > 20) {
      recommendations.push({
        type: 'preventive',
        title: 'Alta Humedad - Posible Reducción de Visibilidad',
        description: `Humedad del ${weatherData.humidity.toFixed(0)}% puede generar condensación`,
        action: 'Verificar sistemas de ventilación y mejorar iluminación si es necesario'
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'preventive':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <Shield className="w-5 h-5 text-orange-600" />;
      case 'preventive':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Recomendaciones del Sistema
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-medium">Condiciones meteorológicas normales</p>
          <p className="text-green-600 text-sm">Continuar con operación estándar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Recomendaciones Operativas
        </h2>
        <div className="text-sm text-gray-500">
          {recommendations.length} recomendación{recommendations.length !== 1 ? 'es' : ''} activa{recommendations.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className={`rounded-lg border p-4 ${getRecommendationStyle(recommendation.type)}`}
          >
            <div className="flex items-start gap-3">
              {getRecommendationIcon(recommendation.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{recommendation.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50 capitalize">
                    {recommendation.type === 'critical' ? 'Crítico' : 
                     recommendation.type === 'medium' ? 'Medio' : 'Informativo'}
                  </span>
                </div>
                
                <p className="text-sm mb-3 opacity-90">{recommendation.description}</p>
                
                <div className="bg-white/50 rounded-lg p-3 mb-3">
                  <p className="font-medium text-sm mb-1">Acción sugerida:</p>
                  <p className="text-sm">{recommendation.action}</p>
                </div>

                {recommendation.platforms && recommendation.platforms.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <Umbrella className="w-4 h-4" />
                    <span className="text-sm font-medium">Andenes:</span>
                    <span className="text-sm">{recommendation.platforms.join(', ')}</span>
                  </div>
                )}

                {recommendation.passengerImpact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Impacto estimado:</span>
                    <span>~{recommendation.passengerImpact.toLocaleString()} pasajeros</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de acciones por tipo */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-red-800 font-bold text-lg">
              {recommendations.filter(r => r.type === 'critical').length}
            </p>
            <p className="text-red-600 text-sm">Acciones Urgentes</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-orange-800 font-bold text-lg">
              {recommendations.filter(r => r.type === 'medium').length}
            </p>
            <p className="text-orange-600 text-sm">Precauciones</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-800 font-bold text-lg">
              {recommendations.filter(r => r.type === 'preventive').length}
            </p>
            <p className="text-blue-600 text-sm">Información</p>
          </div>
        </div>
      </div>
    </div>
  );
}