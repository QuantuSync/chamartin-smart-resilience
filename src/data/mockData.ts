import { Platform, WeatherData, Alert } from '@/types';

export const platforms: Platform[] = [
  { id: 'P1', name: 'Andén 1', isRoofed: true, riskScore: 25, exposure: 0.2 },
  { id: 'P2', name: 'Andén 2', isRoofed: true, riskScore: 30, exposure: 0.3 },
  { id: 'P3', name: 'Andén 3', isRoofed: false, riskScore: 65, exposure: 0.8 },
  { id: 'P4', name: 'Andén 4', isRoofed: false, riskScore: 70, exposure: 0.9 },
  { id: 'P5', name: 'Andén 5', isRoofed: true, riskScore: 20, exposure: 0.1 },
  { id: 'P6', name: 'Andén 6', isRoofed: false, riskScore: 45, exposure: 0.6 },
  { id: 'P7', name: 'Andén 7', isRoofed: true, riskScore: 35, exposure: 0.4 },
  { id: 'P8', name: 'Andén 8', isRoofed: false, riskScore: 55, exposure: 0.7 },
];

export const currentWeather: WeatherData = {
  timestamp: new Date().toISOString(),
  temperature: 18.5,
  humidity: 75,
  precipitation: 2.3,
  windSpeed: 12,
  windDirection: 225,
  pressure: 1013.2,
};

export const alerts: Alert[] = [
  {
    id: 'A1',
    platformId: 'P4',
    severity: 'high',
    message: 'Fuertes rachas de viento previstas en 30 min',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'A2',
    platformId: 'P3',
    severity: 'medium',
    message: 'Incremento de precipitación esperado',
    timestamp: new Date().toISOString(),
  },
];