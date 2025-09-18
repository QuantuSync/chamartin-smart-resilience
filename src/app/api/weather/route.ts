import { NextResponse } from 'next/server';

const CHAMARTIN_LAT = 40.4729;
const CHAMARTIN_LON = -3.6797;

async function fetchNASAData() {
  try {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0].replace(/-/g, '');
    };

    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,T2M_MAX,T2M_MIN,WS2M,RH2M,PS&community=RE&longitude=${CHAMARTIN_LON}&latitude=${CHAMARTIN_LAT}&start=${formatDate(startDate)}&end=${formatDate(endDate)}&format=JSON`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }
    
    const data = await response.json();
    const properties = data.properties.parameter;
    const dates = Object.keys(properties.T2M_MAX);
    const latestDate = dates[dates.length - 1];
    
    const temp = properties.T2M_MAX[latestDate];
    const humidity = properties.RH2M[latestDate];
    
    if (temp === -999 || humidity === -999) {
      throw new Error('NASA data not available (-999)');
    }
    
    return {
      timestamp: new Date().toISOString(),
      temperature: temp,
      humidity: humidity,
      precipitation: Math.max(0, properties.PRECTOTCORR[latestDate] || 0),
      windSpeed: properties.WS2M[latestDate] || 5,
      windDirection: 180,
      pressure: properties.PS[latestDate] || 1013,
      source: 'NASA'
    };
  } catch (error) {
    console.error('NASA API failed:', error);
    return null;
  }
}

async function fetchAEMETData() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_AEMET_API_KEY;
    if (!apiKey) {
      throw new Error('AEMET API key not found');
    }

    const stationId = '3195';
    const observationUrl = `https://opendata.aemet.es/opendata/api/observacion/convencional/datos/estacion/${stationId}`;
    
    const obsResponse = await fetch(observationUrl, {
      headers: {
        'api_key': apiKey
      }
    });

    if (!obsResponse.ok) {
      throw new Error(`AEMET API error: ${obsResponse.status}`);
    }

    const obsData = await obsResponse.json();
    
    if (obsData.estado === 200 && obsData.datos) {
      const dataResponse = await fetch(obsData.datos);
      const weatherArray = await dataResponse.json();
      
      if (weatherArray && weatherArray.length > 0) {
        const latest = weatherArray[weatherArray.length - 1];
        
        return {
          timestamp: new Date().toISOString(),
          temperature: parseFloat(latest.ta) || 20,
          humidity: parseFloat(latest.hr) || 60,
          precipitation: parseFloat(latest.prec) || 0,
          windSpeed: parseFloat(latest.vv) || 5,
          windDirection: parseFloat(latest.dv) || 180,
          pressure: parseFloat(latest.pres) || 1013,
          source: 'AEMET'
        };
      }
    }
    
    throw new Error('No AEMET data available');
  } catch (error) {
    console.error('AEMET API failed:', error);
    return null;
  }
}

export async function GET() {
  try {
    // Intentar AEMET primero
    let weatherData = await fetchAEMETData();
    if (weatherData) {
      return NextResponse.json(weatherData);
    }
    
    // Si AEMET falla, intentar NASA
    weatherData = await fetchNASAData();
    if (weatherData) {
      return NextResponse.json(weatherData);
    }
    
    // Fallback con datos realistas
    const fallbackData = {
      timestamp: new Date().toISOString(),
      temperature: 18 + Math.random() * 8,
      humidity: 50 + Math.random() * 30,
      precipitation: Math.random() * 3,
      windSpeed: 3 + Math.random() * 12,
      windDirection: Math.random() * 360,
      pressure: 1010 + Math.random() * 10,
      source: 'Fallback'
    };
    
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error('Weather API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}