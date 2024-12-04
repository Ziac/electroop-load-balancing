import React from 'react';
import { Paper, Typography } from '@mui/material';
import ChargingStation from './ChargingStation';
import ChargingProfileAnimation from './ChargingProfileAnimation';
import OcppLogs from './OcppLogs';

function ChargingStations({ stations, onUpdatePower, onRemoveStation }) {
  const [previousPowers, setPreviousPowers] = React.useState(
    Object.fromEntries(stations.map(s => [s.id, s.currentPower]))
  );

  React.useEffect(() => {
    stations.forEach(station => {
      if (station.currentPower !== previousPowers[station.id]) {
        setPreviousPowers(prev => ({
          ...prev,
          [station.id]: station.currentPower
        }));
      }
    });
  }, [stations]);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Charging Stations
      </Typography>
      
      {stations.map(station => (
        <React.Fragment key={station.id}>
          <ChargingProfileAnimation station={station} />
          <OcppLogs 
            station={station} 
            previousPower={previousPowers[station.id]} 
          />
          <ChargingStation
            station={station}
            onUpdatePower={onUpdatePower}
            onRemoveStation={onRemoveStation}
          />
        </React.Fragment>
      ))}

      {stations.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          No charging stations available. Add some stations to begin.
        </Typography>
      )}
    </Paper>
  );
}

export default ChargingStations;