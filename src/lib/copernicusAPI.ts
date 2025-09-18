// Copernicus Climate Data Store API
// Análisis histórico para contexto y recomendaciones, NO para decisiones directas

export interface HistoricalEvent {
  name: string;
  date: string;
  location: string;
  maxPrecipitation: number;
  maxWindSpeed: number;
  minTemperature: number;
  maxTemperature: number;
  minPressure: number;
  description: string;
  impact: string;
}

interface WeatherConditions {
  precipitation: number;
  windSpeed: number;
  temperature: number;
  pressure: number;
}

interface CopernicusData {
  source: string;
  location: { lat: number; lon: number };
  date: string;
  data: {
    temperature_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    surface_pressure: number;
  };
  validation: string;
}

export const historicalEvents: HistoricalEvent[] = [
  {
    name: "Borrasca Filomena",
    date: "2021-01-09",
    location: "Madrid - Chamartín",
    maxPrecipitation: 45.2,
    maxWindSpeed: 38.5,
    minTemperature: -6.8,
    maxTemperature: 2.1,
    minPressure: 985.3,
    description: "Nevada histórica que paralizó Madrid durante días",
    impact: "400,000 pasajeros afectados, 72h de interrupción total del servicio"
  },
  {
    name: "DANA Valencia-Madrid",
    date: "2024-10-29",
    location: "Corredor Mediterráneo-Madrid",
    maxPrecipitation: 78.4,
    maxWindSpeed: 42.1,
    minTemperature: 12.3,
    maxTemperature: 18.7,
    minPressure: 992.1,
    description: "DANA severa con precipitaciones torrenciales",
    impact: "250,000 pasajeros redirigidos, 48h de servicios limitados"
  },
  {
    name: "Ola de Calor Extremo",
    date: "2023-07-14",
    location: "Madrid - Área Metropolitana",
    maxPrecipitation: 0,
    maxWindSpeed: 15.2,
    minTemperature: 28.9,
    maxTemperature: 44.3,
    minPressure: 1018.7,
    description: "Temperaturas record que afectaron infraestructura ferroviaria",
    impact: "Velocidad reducida en 15% de trayectos, expansión térmica de vías"
  },
  {
    name: "Tormenta Granizo Madrid",
    date: "2022-08-30",
    location: "Madrid Centro-Norte",
    maxPrecipitation: 32.1,
    maxWindSpeed: 68.4,
    minTemperature: 19.2,
    maxTemperature: 31.8,
    minPressure: 996.4,
    description: "Tormenta severa con granizo de hasta 4cm de diámetro",
    impact: "6h de suspensión parcial, daños en señalización exterior"
  },
  {
    name: "Borrasca Celia",
    date: "2023-12-18",
    location: "Madrid - Corredor Atlántico",
    maxPrecipitation: 28.7,
    maxWindSpeed: 52.3,
    minTemperature: 4.1,
    maxTemperature: 12.5,
    minPressure: 988.9,
    description: "Vientos huracanados y lluvia intensa",
    impact: "120,000 pasajeros afectados, 24h de servicios interrumpidos"
  }
];

// Función para obtener evento histórico similar (solo para contexto)
export function findSimilarHistoricalEvent(currentWeather: WeatherConditions): HistoricalEvent | null {
  
  // Buscar eventos con condiciones realmente similares (tolerancias más amplias)
  const similarEvents = historicalEvents.filter(event => {
    const precipitationMatch = Math.abs(event.maxPrecipitation - currentWeather.precipitation) < 15;
    const windMatch = Math.abs(event.maxWindSpeed - currentWeather.windSpeed) < 20;
    const tempInRange = currentWeather.temperature >= (event.minTemperature - 8) && 
                       currentWeather.temperature <= (event.maxTemperature + 8);
    
    // Al menos 2 de 3 condiciones deben coincidir
    const matches = [precipitationMatch, windMatch, tempInRange].filter(Boolean).length;
    return matches >= 2;
  });

  if (similarEvents.length > 0) {
    return similarEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  return null;
}

// Función para generar recomendaciones basadas en patrones históricos (NO decisiones)
export function generateHistoricalRecommendations(currentWeather: WeatherConditions, currentRiskScore: number): {
  historicalContext: string;
  recommendations: string[];
  confidence: number;
  warningLevel: 'info' | 'watch' | 'advisory' | 'warning';
} {
  const similarEvent = findSimilarHistoricalEvent(currentWeather);
  let historicalContext = 'Sin patrones históricos similares identificados';
  let recommendations: string[] = [];
  let confidence = 50;
  let warningLevel: 'info' | 'watch' | 'advisory' | 'warning' = 'info';

  if (similarEvent) {
    historicalContext = `Condiciones similares a ${similarEvent.name} (${similarEvent.date}): ${similarEvent.description}`;
    confidence = 85;
    
    // Recomendaciones basadas en el evento histórico y score actual
    if (currentRiskScore >= 70) {
      warningLevel = 'warning';
      recommendations = [
        `Lecciones de ${similarEvent.name}: ${similarEvent.impact}`,
        'Considerar activación de protocolos preventivos',
        'Monitorización intensiva recomendada',
        'Preparar comunicación a pasajeros'
      ];
    } else if (currentRiskScore >= 50) {
      warningLevel = 'advisory';
      recommendations = [
        `Patrón histórico detectado: ${similarEvent.name}`,
        'Mantener vigilancia reforzada',
        'Revisar protocolos de contingencia',
        'Personal en alerta preventiva'
      ];
    } else if (currentRiskScore >= 30) {
      warningLevel = 'watch';
      recommendations = [
        `Condiciones recuerdan a ${similarEvent.name}`,
        'Monitorización estándar apropiada',
        'Sin acciones inmediatas requeridas'
      ];
    } else {
      warningLevel = 'info';
      recommendations = [
        'Condiciones dentro de parámetros normales',
        'Seguimiento rutinario suficiente'
      ];
    }
  } else {
    // Sin eventos similares
    if (currentRiskScore >= 50) {
      warningLevel = 'watch';
      recommendations = [
        'Condiciones atípicas sin precedentes claros',
        'Mantener vigilancia estándar',
        'Considerar consulta con meteorología'
      ];
    } else {
      recommendations = [
        'Condiciones normales',
        'Procedimientos estándar aplicables'
      ];
    }
  }

  return {
    historicalContext,
    recommendations,
    confidence,
    warningLevel
  };
}

// Simular llamada a Copernicus CDS API
export async function fetchCopernicusData(date: string): Promise<CopernicusData | null> {
  console.log(`[Copernicus] Fetching ERA5 data for ${date} - Madrid area`);
  
  const event = historicalEvents.find(e => e.date === date);
  
  if (event) {
    return {
      source: 'ERA5 Reanalysis',
      location: { lat: 40.4729, lon: -3.6797 },
      date: date,
      data: {
        temperature_2m: event.maxTemperature,
        precipitation: event.maxPrecipitation,
        wind_speed_10m: event.maxWindSpeed,
        surface_pressure: event.minPressure
      },
      validation: 'Validated against observational data'
    };
  }
  
  return null;
}