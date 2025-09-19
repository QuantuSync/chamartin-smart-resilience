'use client';

import { useState } from 'react';
import { Cloud, CloudRain, Wind, AlertTriangle, Play, RotateCcw, Clock, TrendingUp } from 'lucide-react';
import { WeatherData } from '@/types';

interface DANASimulatorProps {
  onSimulate: (weatherData: WeatherData) => void;
  onReset: () => void;
}

interface TimelinePhase {
  time: string;
  label: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  precipitation: number;
  windSpeed: number;
  temperature: number;
  actions: string[];
}

interface DANAScenario {
  name: string;
  description: string;
  display: {
    precipitation: number;
    windSpeed: number;
    temperature: number;
  };
  data: WeatherData;
  timeline: TimelinePhase[];
}

export default function DANASimulator({ onSimulate, onReset }: DANASimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<DANAScenario | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const danaScenarios: DANAScenario[] = [
    {
      name: "DANA Severa",
      description: "Precipitación intensa (15-25 mm/h) + vientos fuertes",
      display: {
        precipitation: 22.3,
        windSpeed: 24.7,
        temperature: 18.4
      },
      data: {
        timestamp: new Date().toISOString(),
        temperature: 18.4,
        humidity: 92,
        precipitation: 22.3,
        windSpeed: 24.7,
        windDirection: 235,
        pressure: 998,
      },
      timeline: [
        {
          time: "T-60 min",
          label: "Detección Inicial",
          riskLevel: 'low',
          description: "Presión atmosférica descendiendo, primeras señales",
          precipitation: 0.2,
          windSpeed: 8.5,
          temperature: 19.2,
          actions: ["Revisar pronóstico extendido", "Preparar equipos preventivos"]
        },
        {
          time: "T-30 min",
          label: "Escalada Moderada",
          riskLevel: 'medium',
          description: "Intensificación de precipitación y viento",
          precipitation: 5.8,
          windSpeed: 15.3,
          temperature: 18.9,
          actions: ["Activar vigilancia reforzada", "Alertar personal operativo", "Preparar señalización"]
        },
        {
          time: "T-15 min",
          label: "Condiciones Críticas",
          riskLevel: 'high',
          description: "Riesgo alto - Ventana de actuación crítica",
          precipitation: 12.4,
          windSpeed: 20.1,
          temperature: 18.6,
          actions: ["Cerrar andenes expuestos", "Evacuar zonas de riesgo", "Activar protocolos"]
        },
        {
          time: "T-0 min",
          label: "Pico del Evento",
          riskLevel: 'critical',
          description: "Condiciones extremas - Máximo impacto",
          precipitation: 22.3,
          windSpeed: 24.7,
          temperature: 18.4,
          actions: ["Suspender operaciones", "Protocolo emergencia total", "Comunicación crisis"]
        }
      ]
    },
    {
      name: "Tormenta Extrema",
      description: "Condiciones críticas similares a Filomena",
      display: {
        precipitation: 32.8,
        windSpeed: 31.2,
        temperature: 3.7
      },
      data: {
        timestamp: new Date().toISOString(),
        temperature: 3.7,
        humidity: 95,
        precipitation: 32.8,
        windSpeed: 31.2,
        windDirection: 210,
        pressure: 992,
      },
      timeline: [
        {
          time: "T-60 min",
          label: "Alerta Temprana",
          riskLevel: 'low',
          description: "Temperatura bajando, presión cayendo rápidamente",
          precipitation: 1.2,
          windSpeed: 12.3,
          temperature: 8.1,
          actions: ["Monitoreo intensivo", "Pre-posicionar equipos antihielo"]
        },
        {
          time: "T-30 min",
          label: "Deterioro Acelerado",
          riskLevel: 'medium',
          description: "Precipitación mixta, vientos en aumento",
          precipitation: 8.7,
          windSpeed: 22.5,
          temperature: 5.2,
          actions: ["Activar calefacción andenes", "Desplegar equipos emergencia"]
        },
        {
          time: "T-15 min",
          label: "Crisis Inminente",
          riskLevel: 'high',
          description: "Precipitación torrencial, formación de hielo",
          precipitation: 18.9,
          windSpeed: 28.4,
          temperature: 4.1,
          actions: ["Cerrar estación parcialmente", "Evacuar andenes exteriores"]
        },
        {
          time: "T-0 min",
          label: "Evento Extremo",
          riskLevel: 'critical',
          description: "Condiciones tipo Filomena - Peligro máximo",
          precipitation: 32.8,
          windSpeed: 31.2,
          temperature: 3.7,
          actions: ["Cierre total temporal", "Refugio pasajeros", "Emergencias activadas"]
        }
      ]
    },
    {
      name: "Calor Extremo",
      description: "Altas temperaturas + baja humedad",
      display: {
        precipitation: 0,
        windSpeed: 14.3,
        temperature: 41.2
      },
      data: {
        timestamp: new Date().toISOString(),
        temperature: 41.2,
        humidity: 32,
        precipitation: 0,
        windSpeed: 14.3,
        windDirection: 180,
        pressure: 1025,
      },
      timeline: [
        {
          time: "T-60 min",
          label: "Calor Creciente",
          riskLevel: 'low',
          description: "Temperatura subiendo, humedad bajando",
          precipitation: 0,
          windSpeed: 8.2,
          temperature: 35.6,
          actions: ["Verificar climatización", "Preparar hidratación extra"]
        },
        {
          time: "T-30 min",
          label: "Estrés Térmico",
          riskLevel: 'medium',
          description: "Calor intenso, riesgo para grupos vulnerables",
          precipitation: 0,
          windSpeed: 11.7,
          temperature: 38.9,
          actions: ["Abrir zonas de sombra", "Reforzar personal médico"]
        },
        {
          time: "T-15 min",
          label: "Temperatura Peligrosa",
          riskLevel: 'high',
          description: "Riesgo de golpe de calor en andenes expuestos",
          precipitation: 0,
          windSpeed: 13.1,
          temperature: 40.2,
          actions: ["Evacuar andenes soleados", "Activar nebulizadores"]
        },
        {
          time: "T-0 min",
          label: "Calor Extremo",
          riskLevel: 'critical',
          description: "Temperatura peligrosa para la salud",
          precipitation: 0,
          windSpeed: 14.3,
          temperature: 41.2,
          actions: ["Refugio obligatorio", "Atención médica preventiva", "Comunicación salud"]
        }
      ]
    }
  ];

  const simulateDANA = async (scenario: DANAScenario) => {
    setSelectedScenario(scenario);
    setShowTimeline(true);
    setIsSimulating(true);
    setSimulationPhase(0);

    // Simular la evolución temporal con timing pausado
    for (let phase = 0; phase < scenario.timeline.length; phase++) {
      setTimeout(() => {
        setSimulationPhase(phase);
        if (phase === scenario.timeline.length - 1) {
          // Al final, aplicar los datos del escenario
          onSimulate(scenario.data);
        }
      }, phase * 8000); // 8 segundos por fase
    }
    
    // Finalizar simulación
    setTimeout(() => {
      setIsSimulating(false);
    }, scenario.timeline.length * 8000 + 2000);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationPhase(0);
    setSelectedScenario(null);
    setShowTimeline(false);
    onReset();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Simulador de Eventos Extremos
          </h2>
          <p className="text-sm text-gray-600">
            Simula condiciones DANA y evalúa respuesta del sistema
          </p>
        </div>
        <button
          onClick={resetSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Timeline de Evolución */}
      {showTimeline && selectedScenario && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">
              Evolución Temporal: {selectedScenario.name}
            </h3>
            {isSimulating && (
              <span className="text-sm text-blue-600 animate-pulse">
                Simulando fase {simulationPhase + 1} de {selectedScenario.timeline.length}...
              </span>
            )}
          </div>

          <div className="space-y-3">
            {selectedScenario.timeline.map((phase, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-all duration-500 ${
                  isSimulating && index === simulationPhase
                    ? `${getRiskBgColor(phase.riskLevel)} ring-2 ring-blue-300 transform scale-[1.02]`
                    : index <= simulationPhase 
                    ? getRiskBgColor(phase.riskLevel)
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(phase.riskLevel)} ${
                      isSimulating && index === simulationPhase ? 'animate-pulse' : ''
                    }`}></div>
                    <span className="font-semibold">{phase.time}</span>
                    <span className="text-sm">{phase.label}</span>
                  </div>
                  {isSimulating && index === simulationPhase && (
                    <TrendingUp className="w-4 h-4 animate-bounce" />
                  )}
                </div>

                <p className="text-sm mb-3">{phase.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                  <div>💧 {phase.precipitation.toFixed(1)} mm/h</div>
                  <div>💨 {phase.windSpeed.toFixed(1)} m/s</div>
                  <div>🌡️ {phase.temperature.toFixed(1)}°C</div>
                </div>

                <div>
                  <p className="text-xs font-medium mb-1">Acciones recomendadas:</p>
                  <ul className="text-xs space-y-1">
                    {phase.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escenarios disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {danaScenarios.map((scenario, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              {scenario.name.includes('DANA') && <CloudRain className="w-5 h-5 text-blue-500" />}
              {scenario.name.includes('Tormenta') && <Cloud className="w-5 h-5 text-gray-600" />}
              {scenario.name.includes('Calor') && <Wind className="w-5 h-5 text-red-500" />}
              <h3 className="font-semibold text-gray-800">{scenario.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
            <div className="text-xs text-gray-500 mb-3">
              <div>💧 {scenario.display.precipitation.toFixed(1)} mm/h</div>
              <div>💨 {scenario.display.windSpeed.toFixed(1)} m/s</div>
              <div>🌡️ {scenario.display.temperature.toFixed(1)}°C</div>
            </div>
            <button
              onClick={() => simulateDANA(scenario)}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              {isSimulating && selectedScenario?.name === scenario.name ? 'Simulando...' : 'Simular'}
            </button>
          </div>
        ))}
      </div>

      {/* Explicación del valor preventivo */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Valor de la Anticipación
        </h4>
        <p className="text-sm text-blue-700">
          El sistema detecta condiciones peligrosas hasta <strong>60 minutos antes</strong> del evento crítico, 
          permitiendo tomar decisiones preventivas cuando aún hay tiempo para proteger vidas y minimizar daños.
        </p>
      </div>
    </div>
  );
}