export class LoadBalancer {
  constructor() {
    this.stationMetrics = new Map();
    this.lastRebalance = Date.now();
    this.REBALANCE_INTERVAL = 5 * 60 * 1000; // 5 minutes
  }

  updateStationMetrics(stationId, meterValues) {
    this.stationMetrics.set(stationId, {
      timestamp: Date.now(),
      currentPower: this.extractPowerValue(meterValues),
      voltage: this.extractVoltageValue(meterValues)
    });
  }

  shouldRebalance() {
    return Date.now() - this.lastRebalance >= this.REBALANCE_INTERVAL;
  }

  calculateOptimalDistribution(stations) {
    const profiles = new Map();
    const totalStations = stations.length;
    const baseLimit = 32; // Base amperage limit
    
    // Calculate total system capacity and current usage
    const totalCapacity = totalStations * baseLimit;
    let totalCurrentUsage = 0;
    
    for (const station of stations) {
      const metrics = this.stationMetrics.get(station.id);
      if (metrics) {
        totalCurrentUsage += metrics.currentPower;
      }
    }

    // Distribute available capacity among active stations
    const activeStations = stations.filter(s => s.status === 'Charging');
    const availableCapacityPerStation = totalCapacity / (activeStations.length || 1);

    for (const station of stations) {
      const profile = {
        chargingProfileId: Date.now(),
        stackLevel: 0,
        chargingProfilePurpose: 'TxDefaultProfile',
        chargingProfileKind: 'Relative',
        chargingSchedule: {
          duration: 86400,
          startSchedule: new Date().toISOString(),
          chargingRateUnit: 'A',
          chargingSchedulePeriod: [
            {
              startPeriod: 0,
              limit: station.status === 'Charging' ? 
                Math.min(baseLimit, availableCapacityPerStation) : baseLimit
            }
          ]
        }
      };

      profiles.set(station.id, profile);
    }

    this.lastRebalance = Date.now();
    return profiles;
  }

  extractPowerValue(meterValues) {
    // Extract power value from meter values
    const powerSample = meterValues.meterValue?.[0]?.sampledValue?.find(
      sv => sv.measurand === 'Power.Active.Import'
    );
    return powerSample ? parseFloat(powerSample.value) : 0;
  }

  extractVoltageValue(meterValues) {
    // Extract voltage value from meter values
    const voltageSample = meterValues.meterValue?.[0]?.sampledValue?.find(
      sv => sv.measurand === 'Voltage'
    );
    return voltageSample ? parseFloat(voltageSample.value) : 230;
  }
}