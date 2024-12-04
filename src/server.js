import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { ChargingStationManager } from './managers/ChargingStationManager.js';
import { LoadBalancer } from './services/LoadBalancer.js';
import { SmartChargingProfile } from './models/SmartChargingProfile.js';

const server = createServer();
const wss = new WebSocketServer({ server });
const chargingStationManager = new ChargingStationManager();
const loadBalancer = new LoadBalancer();

wss.on('connection', (ws, req) => {
  const stationId = req.url.split('/')[1];
  console.log(`Charging station ${stationId} connected`);

  chargingStationManager.addStation(stationId, ws);

  ws.on('message', async (message) => {
    try {
      const [messageType, messageId, action, payload] = JSON.parse(message);
      
      switch (action) {
        case 'BootNotification':
          await handleBootNotification(stationId, messageId, payload);
          break;
        case 'MeterValues':
          await handleMeterValues(stationId, messageId, payload);
          break;
        case 'StatusNotification':
          await handleStatusNotification(stationId, messageId, payload);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    chargingStationManager.removeStation(stationId);
    console.log(`Charging station ${stationId} disconnected`);
  });
});

async function handleBootNotification(stationId, messageId, payload) {
  const response = {
    status: 'Accepted',
    currentTime: new Date().toISOString(),
    interval: 300
  };
  
  chargingStationManager.sendMessage(stationId, [3, messageId, response]);
  await applySmartChargingProfile(stationId);
}

async function handleMeterValues(stationId, messageId, payload) {
  loadBalancer.updateStationMetrics(stationId, payload);
  const response = {};
  chargingStationManager.sendMessage(stationId, [3, messageId, response]);
  
  // Trigger load balancing if needed
  if (loadBalancer.shouldRebalance()) {
    await rebalanceLoad();
  }
}

async function handleStatusNotification(stationId, messageId, payload) {
  chargingStationManager.updateStationStatus(stationId, payload.status);
  const response = {};
  chargingStationManager.sendMessage(stationId, [3, messageId, response]);
}

async function applySmartChargingProfile(stationId) {
  const profile = new SmartChargingProfile({
    chargingProfileId: Date.now(),
    stackLevel: 0,
    chargingProfilePurpose: 'TxDefaultProfile',
    chargingProfileKind: 'Relative',
    chargingSchedule: {
      duration: 86400,
      startSchedule: new Date().toISOString(),
      chargingRateUnit: 'A',
      chargingSchedulePeriod: [
        { startPeriod: 0, limit: 32 }
      ]
    }
  });

  await chargingStationManager.setChargingProfile(stationId, profile);
}

async function rebalanceLoad() {
  const stations = chargingStationManager.getAllStations();
  const newProfiles = loadBalancer.calculateOptimalDistribution(stations);
  
  for (const [stationId, profile] of Object.entries(newProfiles)) {
    await chargingStationManager.setChargingProfile(stationId, profile);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`OCPP Server running on port ${PORT}`);
});