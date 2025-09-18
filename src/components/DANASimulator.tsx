'use client';

import { useState } from 'react';
import { Cloud, CloudRain, Wind, AlertTriangle, Play, RotateCcw } from 'lucide-react';

interface DANASimulatorProps {
  onSimulate: (weatherData: any) => void;
  onReset: () => void;
}

export default function DANASimulator({ onSimulate, onReset }: DANASimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState(0);

  const danaScenarios = [
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
      }
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
      }
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
      }
    }
  ];

  const simulateDANA = async (scenario: any) => {
    setIsSimulating(true);
    setSimulationPhase(0);

    // Fase 1: Detección inicial
    setTimeout(() => setSimulationPhase(1), 500);
    
    // Fase 2: Escalada de condiciones
    setTimeout(() => {
      setSimulationPhase(2);
      onSimulate(scenario.data);
    }, 1500);
    
    // Fase 3: Condiciones críticas
    setTimeout(() => setSimulationPhase(3), 3000);
    
    // Finalizar simulación
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationPhase(0);
    }, 5000);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationPhase(0);
    onReset();
  };

  const getPhaseMessage = () => {
    switch (simulationPhase) {
      case 1: return "🌡️ Detectando cambios atmosféricos...";
      case 2: return "⚠️ Escalada de condiciones - Alertas activadas";
      case 3: return "🚨 CONDICIONES CRÍTICAS - Protocolos de emergencia";
      default: return "";
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

      {isSimulating && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-800 font-medium">{getPhaseMessage()}</span>
          </div>
          <div className="mt-2 bg-orange-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(simulationPhase / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

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
              Simular
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}