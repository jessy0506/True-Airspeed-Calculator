import React, { useState, useCallback } from 'react';
import { Plane, Wind, Navigation } from 'lucide-react';

interface WindTriangle {
  trueAirspeed: number;
  windCorrection: number;
  groundSpeed: number;
}

function calculateWindTriangle(
  groundSpeed: number,
  trueHeading: number,
  windSpeed: number,
  windDirection: number
): WindTriangle {
  // Convert angles to radians
  const headingRad = (trueHeading * Math.PI) / 180;
  const windDirRad = (windDirection * Math.PI) / 180;

  // Calculate ground vector components
  const groundX = groundSpeed * Math.sin(headingRad);
  const groundY = groundSpeed * Math.cos(headingRad);

  // Calculate wind vector components (direction wind is coming FROM)
  const windX = -windSpeed * Math.sin(windDirRad);
  const windY = -windSpeed * Math.cos(windDirRad);

  // Calculate true airspeed components (ground - wind)
  const tasX = groundX - windX;
  const tasY = groundY - windY;

  // Calculate true airspeed magnitude
  const trueAirspeed = Math.round(Math.sqrt(tasX * tasX + tasY * tasY));

  // Calculate wind correction angle
  let windCorrection = Math.round(
    ((Math.atan2(tasX, tasY) * 180) / Math.PI - trueHeading + 360) % 360
  );

  // Normalize wind correction angle to be between -180 and 180
  if (windCorrection > 180) {
    windCorrection -= 360;
  }

  return {
    trueAirspeed,
    windCorrection,
    groundSpeed
  };
}

function App() {
  const [groundSpeed, setGroundSpeed] = useState<number>(458);
  const [trueHeading, setTrueHeading] = useState<number>(97.7);
  const [windSpeed, setWindSpeed] = useState<number>(23);
  const [windDirection, setWindDirection] = useState<number>(247);

  const result = calculateWindTriangle(groundSpeed, trueHeading, windSpeed, windDirection);

  const handleInputChange = useCallback((setter: (value: number) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setter(value);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Plane className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">True Airspeed Calculator</h1>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Navigation className="w-5 h-5" /> Aircraft Data
              </h2>
              
              <label className="block">
                <span className="text-gray-700 font-medium">Ground Speed (knots)</span>
                <input
                  type="number"
                  value={groundSpeed}
                  onChange={handleInputChange(setGroundSpeed)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 
                           bg-gray-50 p-2 border"
                  min="0"
                  step="1"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium">True Heading (degrees)</span>
                <input
                  type="number"
                  value={trueHeading}
                  onChange={handleInputChange(setTrueHeading)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 
                           bg-gray-50 p-2 border"
                  min="0"
                  max="360"
                  step="0.1"
                />
              </label>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Wind className="w-5 h-5" /> Wind Data
              </h2>
              
              <label className="block">
                <span className="text-gray-700 font-medium">Wind Speed (knots)</span>
                <input
                  type="number"
                  value={windSpeed}
                  onChange={handleInputChange(setWindSpeed)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 
                           bg-gray-50 p-2 border"
                  min="0"
                  step="1"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium">Wind Direction (degrees)</span>
                <input
                  type="number"
                  value={windDirection}
                  onChange={handleInputChange(setWindDirection)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 
                           bg-gray-50 p-2 border"
                  min="0"
                  max="360"
                  step="1"
                />
              </label>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">True Airspeed</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {result.trueAirspeed} <span className="text-xl">knots</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Wind Correction Angle</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {Math.abs(result.windCorrection)}° <span className="text-xl">{result.windCorrection > 0 ? 'right' : 'left'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-medium mb-2">About Wind Triangle Calculations</h3>
            <p>
              This calculator uses the wind triangle (also known as vector triangle) method to determine true airspeed (TAS) 
              based on ground speed, true heading, and wind data. The wind correction angle shows how much the aircraft needs 
              to "crab" into the wind to maintain the desired ground track. A positive correction means the aircraft needs to 
              point right of the desired track, while a negative correction means pointing left.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;