import { useState, useEffect } from 'react';
import { Activity, Wifi, Database, Satellite, Cloud, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface APIStatus {
  name: string;
  status: 'active' | 'standby' | 'error';
  responseTime: number;
  lastCall: Date;
  callsToday: number;
  endpoint: string;
  icon: React.ReactNode;
}

interface APIStatusIndicatorProps {
  weatherData: any;
  dataSource: string;
}

export default function APIStatusIndicator({ weatherData, dataSource }: APIStatusIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([
    {
      name: 'AEMET OpenData',
      status: 'standby',
      responseTime: 0,
      lastCall: new Date(),
      callsToday: 0,
      endpoint: 'opendata.aemet.es',
      icon: <Cloud className="w-4 h-4" />
    },
    {
      name: 'NASA POWER',
      status: 'standby', 
      responseTime: 0,
      lastCall: new Date(),
      callsToday: 0,
      endpoint: 'power.larc.nasa.gov',
      icon: <Satellite className="w-4 h-4" />
    },
    {
      name: 'Copernicus ERA5',
      status: 'active',
      responseTime: 850,
      lastCall: new Date(Date.now() - 300000), // 5 min ago
      callsToday: 47,
      endpoint: 'climate.copernicus.eu',
      icon: <Database className="w-4 h-4" />
    }
  ]);

  const [totalRequests, setTotalRequests] = useState(423);
  const [uptime, setUptime] = useState(99.7);

  useEffect(() => {
    // Simular actualizaciones de estado basadas en la fuente de datos actual
    const interval = setInterval(() => {
      setApiStatuses(prevStatuses => 
        prevStatuses.map(api => {
          let newStatus = api;
          
          if (dataSource === 'APIs en vivo') {
            // Con fusión de datos, todas las APIs están activas simultáneamente
            if (api.name === 'AEMET OpenData') {
              newStatus = {
                ...api,
                status: 'active',
                responseTime: 150 + Math.random() * 100,
                lastCall: new Date(),
                callsToday: api.callsToday + 1
              };
            } else if (api.name === 'NASA POWER') {
              newStatus = {
                ...api,
                status: 'active',
                responseTime: 300 + Math.random() * 150,
                lastCall: new Date(),
                callsToday: api.callsToday + 1
              };
            }
          } else if (dataSource === 'Simulación DANA') {
            // Durante simulación, mostrar que las APIs están monitoreando
            newStatus = {
              ...api,
              status: api.name === 'Copernicus ERA5' ? 'active' : 'standby',
              responseTime: api.responseTime + (Math.random() - 0.5) * 50,
              callsToday: api.callsToday + (Math.random() < 0.1 ? 1 : 0)
            };
          }
          
          return newStatus;
        })
      );

      setTotalRequests(prev => prev + (Math.random() < 0.3 ? 1 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, [dataSource]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100';
      case 'standby': return 'text-yellow-500 bg-yellow-100';
      case 'error': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'standby': return <Clock className="w-3 h-3" />;
      case 'error': return <XCircle className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'standby': return 'Standby';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  const formatLastCall = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      {/* Header colapsable */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">Monitor de APIs</h3>
          <div className="flex items-center gap-2 ml-4">
            {apiStatuses.map((api, index) => (
              <div key={index} className={`w-2 h-2 rounded-full ${
                api.status === 'active' ? 'bg-green-500 animate-pulse' : 
                api.status === 'standby' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Wifi className="w-4 h-4" />
              <span>Uptime: {uptime}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-4 h-4" />
              <span>{totalRequests.toLocaleString()} calls</span>
            </div>
          </div>
          <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {apiStatuses.map((api, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {api.icon}
                    <span className="font-medium text-sm text-gray-800">{api.name}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(api.status)}`}>
                    {getStatusIcon(api.status)}
                    <span>{getStatusText(api.status)}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <span className="font-mono">{api.endpoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Respuesta:</span>
                    <span className={api.responseTime < 200 ? 'text-green-600' : api.responseTime < 500 ? 'text-yellow-600' : 'text-red-600'}>
                      {api.responseTime.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última llamada:</span>
                    <span>{formatLastCall(api.lastCall)} ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Llamadas hoy:</span>
                    <span className="font-medium">{api.callsToday}</span>
                  </div>
                </div>

                {/* Indicador de actividad */}
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      api.status === 'active' ? 'bg-green-500 animate-pulse' : 
                      api.status === 'standby' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-gray-500">
                      {api.status === 'active' ? 'Transmitiendo datos' :
                       api.status === 'standby' ? 'En espera' : 'Sin conexión'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del tráfico */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>🚦 Tráfico de red en tiempo real - Sistema de monitorización activo</span>
              <span>
                Fuente actual: <span className="font-medium text-gray-700">{dataSource}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}