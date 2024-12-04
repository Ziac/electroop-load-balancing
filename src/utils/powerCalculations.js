export const calculatePowerDistribution = (stations, maxPower) => {
  const totalStations = stations.length;
  if (totalStations === 0) return [];
  
  const powerPerStation = maxPower / totalStations;
  return stations.map(station => ({
    ...station,
    currentPower: Math.min(station.maxPower, powerPerStation),
    status: 'Charging'
  }));
};

export const calculateTotalPower = (stations) => {
  return stations.reduce((sum, station) => sum + station.currentPower, 0);
};

export const simulatePowerFluctuation = (station) => {
  if (station.status !== 'Charging') return station;
  
  const fluctuation = (Math.random() - 0.5) * 5; // ±2.5kW variation
  const newPower = Math.min(
    Math.max(station.currentPower + fluctuation, 0),
    station.maxPower
  );
  
  return {
    ...station,
    currentPower: Number(newPower.toFixed(1)),
    current: (newPower * 1000) / station.voltage
  };
};