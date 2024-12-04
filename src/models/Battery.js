export class Battery {
  constructor(capacity = 200, initialCharge = 0.7) {
    this.capacity = capacity; // kW
    this.currentCharge = capacity * initialCharge;
    this.chargingRate = 50; // kW per interval
    this.dischargingRate = 50; // kW per interval
    this.efficiency = 0.95; // 95% charging/discharging efficiency
  }

  getChargePercentage() {
    return (this.currentCharge / this.capacity) * 100;
  }

  charge(power) {
    const actualPower = Math.min(power, this.chargingRate);
    const energyToAdd = actualPower * this.efficiency;
    const availableCapacity = this.capacity - this.currentCharge;
    const actualEnergy = Math.min(energyToAdd, availableCapacity);
    
    this.currentCharge += actualEnergy;
    return actualEnergy;
  }

  discharge(power) {
    const actualPower = Math.min(power, this.dischargingRate);
    const energyToRemove = actualPower / this.efficiency;
    const actualEnergy = Math.min(energyToRemove, this.currentCharge);
    
    this.currentCharge -= actualEnergy;
    return actualEnergy * this.efficiency;
  }
}