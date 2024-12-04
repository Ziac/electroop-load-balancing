import React from 'react';
import { Typography, Slider, IconButton, Box, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EvStationIcon from '@mui/icons-material/EvStation';
import BoltIcon from '@mui/icons-material/Bolt';

function ChargingStation({ station, onUpdatePower, onRemoveStation }) {
  const getStatusColor = () => {
    if (station.status === 'Charging') {
      return station.currentPower > station.maxPower * 0.8 ? 'success' : 'warning';
    }
    return 'default';
  };

  const formatDuration = (startTime) => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 3,
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        backgroundColor: '#fff',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EvStationIcon color="primary" />
          <Typography variant="subtitle1">
            {station.name}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<BoltIcon />}
            label={`${station.currentPower}kW`}
            color={getStatusColor()}
            size="small"
          />
          <IconButton
            onClick={() => onRemoveStation(station.id)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ px: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Voltage: {station.voltage}V
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current: {(station.current || 0).toFixed(1)}A
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Slider
            value={station.currentPower}
            onChange={(_, value) => onUpdatePower(station.id, value)}
            min={0}
            max={station.maxPower}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${value}kW`}
            sx={{
              '& .MuiSlider-thumb': {
                transition: 'left 0.3s ease'
              },
              '& .MuiSlider-track': {
                transition: 'width 0.3s ease'
              }
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Connected: {formatDuration(station.connectedTime)}
        </Typography>
      </Box>
    </Box>
  );
}

export default ChargingStation;