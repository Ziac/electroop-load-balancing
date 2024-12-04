export class SmartChargingProfile {
  constructor({
    chargingProfileId,
    stackLevel,
    chargingProfilePurpose,
    chargingProfileKind,
    chargingSchedule
  }) {
    this.chargingProfileId = chargingProfileId;
    this.stackLevel = stackLevel;
    this.chargingProfilePurpose = chargingProfilePurpose;
    this.chargingProfileKind = chargingProfileKind;
    this.chargingSchedule = chargingSchedule;
    this.validate();
  }

  validate() {
    if (!this.chargingProfileId) {
      throw new Error('Charging profile ID is required');
    }

    if (!['ChargePointMaxProfile', 'TxDefaultProfile', 'TxProfile'].includes(this.chargingProfilePurpose)) {
      throw new Error('Invalid charging profile purpose');
    }

    if (!['Absolute', 'Recurring', 'Relative'].includes(this.chargingProfileKind)) {
      throw new Error('Invalid charging profile kind');
    }

    if (!this.chargingSchedule || !Array.isArray(this.chargingSchedule.chargingSchedulePeriod)) {
      throw new Error('Invalid charging schedule');
    }
  }

  toJSON() {
    return {
      chargingProfileId: this.chargingProfileId,
      stackLevel: this.stackLevel,
      chargingProfilePurpose: this.chargingProfilePurpose,
      chargingProfileKind: this.chargingProfileKind,
      chargingSchedule: this.chargingSchedule
    };
  }
}