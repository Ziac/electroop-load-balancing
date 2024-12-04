import { v4 as uuidv4 } from 'uuid';

export const MOCK_CHARGING_STATIONS = [
  {
    id: uuidv4(),
    name: 'Ultra-Fast DC Station 1',
    maxPower: 350,
    currentPower: 280,
    status: 'Charging',
    type: 'Ultra-Fast DC',
    connectedTime: Date.now() - 1800000, // 30 minutes ago
    voltage: 800,
    current: 350
  },
  {
    id: uuidv4(),
    name: 'Fast DC Station 1',
    maxPower: 150,
    currentPower: 120,
    status: 'Charging',
    type: 'Fast DC',
    connectedTime: Date.now() - 3600000, // 1 hour ago
    voltage: 600,
    current: 200
  },
  {
    id: uuidv4(),
    name: 'Standard DC Station 1',
    maxPower: 50,
    currentPower: 45,
    status: 'Charging',
    type: 'Standard DC',
    connectedTime: Date.now() - 7200000, // 2 hours ago
    voltage: 400,
    current: 112.5
  }
];

export const MOCK_BATTERY_PROFILES = {
  charging: {
    initialCharge: 0.3, // 30% initial charge
    targetCharge: 0.9, // 90% target charge
    chargingRate: 50 // kW
  },
  discharging: {
    initialCharge: 0.9, // 90% initial charge
    targetCharge: 0.2, // 20% target charge
    dischargingRate: 50 // kW
  }
};

export const MOCK_LOAD_PROFILES = [
  { hour: 0, load: 0.3 }, // 30% load at midnight
  { hour: 4, load: 0.2 }, // 20% load at 4 AM
  { hour: 8, load: 0.7 }, // 70% load at 8 AM
  { hour: 12, load: 0.9 }, // 90% load at noon
  { hour: 16, load: 0.85 }, // 85% load at 4 PM
  { hour: 20, load: 0.6 }, // 60% load at 8 PM
  { hour: 23, load: 0.4 } // 40% load at 11 PM
];

export const MOCK_GRID_CONDITIONS = {
  normal: {
    maxPower: 350,
    powerQuality: 0.98,
    frequency: 50,
    voltageLevel: 1.0
  },
  peak: {
    maxPower: 280,
    powerQuality: 0.95,
    frequency: 49.8,
    voltageLevel: 0.98
  },
  lowDemand: {
    maxPower: 350,
    powerQuality: 0.99,
    frequency: 50.2,
    voltageLevel: 1.02
  }
};

export const MOCK_WEATHER_CONDITIONS = [
  {
    condition: 'sunny',
    solarPowerAvailable: true,
    temperature: 25,
    impact: 1.0
  },
  {
    condition: 'cloudy',
    solarPowerAvailable: true,
    temperature: 20,
    impact: 0.7
  },
  {
    condition: 'rainy',
    solarPowerAvailable: false,
    temperature: 15,
    impact: 0.5
  }
];