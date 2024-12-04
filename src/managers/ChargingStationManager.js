import { v4 as uuidv4 } from 'uuid';

export class ChargingStationManager {
  constructor() {
    this.stations = new Map();
    this.stationStatus = new Map();
  }

  addStation(stationId, websocket) {
    this.stations.set(stationId, websocket);
    this.stationStatus.set(stationId, 'Available');
  }

  removeStation(stationId) {
    this.stations.delete(stationId);
    this.stationStatus.delete(stationId);
  }

  updateStationStatus(stationId, status) {
    this.stationStatus.set(stationId, status);
  }

  getAllStations() {
    return Array.from(this.stations.keys()).map(stationId => ({
      id: stationId,
      status: this.stationStatus.get(stationId)
    }));
  }

  async setChargingProfile(stationId, profile) {
    const messageId = uuidv4();
    const request = {
      connectorId: 0,
      csChargingProfiles: profile
    };

    return new Promise((resolve, reject) => {
      const ws = this.stations.get(stationId);
      if (!ws) {
        reject(new Error(`Station ${stationId} not found`));
        return;
      }

      ws.send(JSON.stringify([2, messageId, 'SetChargingProfile', request]));
      resolve();
    });
  }

  sendMessage(stationId, message) {
    const ws = this.stations.get(stationId);
    if (ws) {
      ws.send(JSON.stringify(message));
    }
  }
}