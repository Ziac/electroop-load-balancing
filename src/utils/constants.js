export const MAX_SYSTEM_POWER = 350; // kW for high-power DC charging
export const DEFAULT_STATION_POWER = 150; // kW default for DC fast charging
export const POWER_FLUCTUATION_INTERVAL = 2000; // 2 seconds
export const STATION_TYPES = [
  { power: 350, name: 'Ultra-Fast DC' },
  { power: 150, name: 'Fast DC' },
  { power: 50, name: 'Standard DC' }
];