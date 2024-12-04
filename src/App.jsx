import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import ChargingStations from './components/ChargingStations';
import PowerDistributionChart from './components/PowerDistributionChart';
import SystemMetrics from './components/SystemMetrics';
import BatteryStatus from './components/BatteryStatus';
import { useLoadBalancer } from './hooks/useLoadBalancer';

function App() {
  const {
    stations,
    totalPower,
    availablePower,
    addStation,
    removeStation,
    updateStationPower,
    rebalancePower,
    battery,
    batteryMode,
    setBatteryOperationMode,
    maxSystemPower
  } = useLoadBalancer();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          EV Charging Load Balancer Simulation
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <SystemMetrics
            totalStations={stations.length}
            totalPower={totalPower}
            availablePower={availablePower}
            onAddStation={addStation}
            onRebalance={rebalancePower}
            maxSystemPower={maxSystemPower}
          />
        </Paper>

        <BatteryStatus
          battery={battery}
          mode={batteryMode}
          onModeChange={setBatteryOperationMode}
        />

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 600px' }}>
            <ChargingStations
              stations={stations}
              onUpdatePower={updateStationPower}
              onRemoveStation={removeStation}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 400px' }}>
            <PowerDistributionChart stations={stations} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;