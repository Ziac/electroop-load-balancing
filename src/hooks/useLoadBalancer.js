import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Battery } from '../models/Battery';
import { MOCK_CHARGING_STATIONS, MOCK_LOAD_PROFILES } from '../utils/mockData';
import { MAX_SYSTEM_POWER, POWER_FLUCTUATION_INTERVAL, STATION_TYPES } from '../utils/constants';
import { simulatePowerFluctuation, calculatePowerDistribution } from '../utils/powerCalculations';

export function useLoadBalancer() {
  const [stations, setStations] = useState(MOCK_CHARGING_STATIONS);
  const [stationIdCounter, setStationIdCounter] = useState(MOCK_CHARGING_STATIONS.length + 1);
  const [battery, setBattery] = useState(new Battery());
  const [batteryMode, setBatteryMode] = useState('auto');
  const [currentLoadProfile, setCurrentLoadProfile] = useState(0);

  const calculateTotalPower = useCallback(() => {
    return stations.reduce((sum, station) => sum + station.currentPower, 0);
  }, [stations]);

  const addStation = useCallback(() => {
    const stationType = STATION_TYPES[Math.floor(Math.random() * STATION_TYPES.length)];
    const newStation = {
      id: uuidv4(),
      name: `${stationType.name} Station ${stationIdCounter}`,
      maxPower: stationType.power,
      currentPower: stationType.power * 0.8,
      status: 'Charging',
      type: stationType.name,
      connectedTime: Date.now(),
      voltage: stationType.power === 350 ? 800 : stationType.power === 150 ? 600 : 400,
      current: (stationType.power * 0.8 * 1000) / (stationType.power === 350 ? 800 : stationType.power === 150 ? 600 : 400)
    };

    setStations(prev => [...prev, newStation]);
    setStationIdCounter(prev => prev + 1);
  }, [stationIdCounter]);

  const removeStation = useCallback((stationId) => {
    setStations(prev => prev.filter(station => station.id !== stationId));
  }, []);

  const updateStationPower = useCallback((stationId, newPower) => {
    setStations(prev => prev.map(station => {
      if (station.id === stationId) {
        return {
          ...station,
          currentPower: newPower,
          current: (newPower * 1000) / station.voltage
        };
      }
      return station;
    }));
  }, []);

  const rebalancePower = useCallback(() => {
    setStations(prev => calculatePowerDistribution(prev, MAX_SYSTEM_POWER));
  }, []);

  const setBatteryOperationMode = useCallback((mode) => {
    setBatteryMode(mode);
  }, []);

  // Simulate real-world power fluctuations and battery behavior
  useEffect(() => {
    const interval = setInterval(() => {
      // Update load profile based on time
      const hour = new Date().getHours();
      const profile = MOCK_LOAD_PROFILES.find(p => p.hour <= hour) || MOCK_LOAD_PROFILES[0];
      setCurrentLoadProfile(profile.load);

      // Update stations with power fluctuations
      setStations(prev => prev.map(station => simulatePowerFluctuation(station)));

      // Battery management
      setBattery(prev => {
        const newBattery = new Battery(prev.capacity, prev.currentCharge / prev.capacity);
        const totalPower = calculateTotalPower();
        
        if (batteryMode === 'auto') {
          if (totalPower > MAX_SYSTEM_POWER * currentLoadProfile) {
            const excess = totalPower - (MAX_SYSTEM_POWER * currentLoadProfile);
            newBattery.charge(excess);
          } else if (totalPower < MAX_SYSTEM_POWER * 0.4 && newBattery.getChargePercentage() > 20) {
            const deficit = (MAX_SYSTEM_POWER * 0.4) - totalPower;
            newBattery.discharge(deficit);
          }
        } else if (batteryMode === 'charge' && newBattery.getChargePercentage() < 95) {
          newBattery.charge(30);
        } else if (batteryMode === 'discharge' && newBattery.getChargePercentage() > 5) {
          newBattery.discharge(30);
        }
        
        return newBattery;
      });
    }, POWER_FLUCTUATION_INTERVAL);

    return () => clearInterval(interval);
  }, [batteryMode, currentLoadProfile, calculateTotalPower]);

  return {
    stations,
    totalPower: calculateTotalPower(),
    availablePower: MAX_SYSTEM_POWER - calculateTotalPower(),
    addStation,
    removeStation,
    updateStationPower,
    rebalancePower,
    maxSystemPower: MAX_SYSTEM_POWER,
    battery,
    batteryMode,
    setBatteryOperationMode,
    currentLoadProfile
  };
}