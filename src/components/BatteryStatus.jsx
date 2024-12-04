import React from 'react';
import { Paper, Typography, Box, Button, LinearProgress, ButtonGroup } from '@mui/material';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import PowerIcon from '@mui/icons-material/Power';

function BatteryStatus({ battery, mode, onModeChange }) {
  const chargePercentage = battery.getChargePercentage();
  
  const getBatteryColor = () => {
    if (chargePercentage > 80) return 'success';
    if (chargePercentage > 20) return 'warning';
    return 'error';
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BatteryFullIcon />
          Battery Storage System
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button
            onClick={() => onModeChange('auto')}
            variant={mode === 'auto' ? 'contained' : 'outlined'}
          >
            Auto
          </Button>
          <Button
            onClick={() => onModeChange('charge')}
            variant={mode === 'charge' ? 'contained' : 'outlined'}
            startIcon={<BatteryChargingFullIcon />}
          >
            Charge
          </Button>
          <Button
            onClick={() => onModeChange('discharge')}
            variant={mode === 'discharge' ? 'contained' : 'outlined'}
            startIcon={<PowerIcon />}
          >
            Discharge
          </Button>
        </ButtonGroup>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Charge Level
          </Typography>
          <Typography variant="body2" color={getBatteryColor() + '.main'}>
            {chargePercentage.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={chargePercentage}
          color={getBatteryColor()}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          Capacity: {battery.capacity} kW
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current Charge: {battery.currentCharge.toFixed(1)} kW
        </Typography>
      </Box>
    </Paper>
  );
}

export default BatteryStatus;