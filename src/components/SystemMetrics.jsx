import React from 'react';
import { Box, Button, Typography, LinearProgress, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BalanceIcon from '@mui/icons-material/Balance';
import BoltIcon from '@mui/icons-material/Bolt';

function SystemMetrics({
  totalStations,
  totalPower,
  availablePower,
  onAddStation,
  onRebalance,
  maxSystemPower
}) {
  const powerUsagePercentage = (totalPower / maxSystemPower) * 100;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            DC Fast Charging System
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Paper sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                Total Stations
              </Typography>
              <Typography variant="h4">
                {totalStations}
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                Total Power Usage
              </Typography>
              <Typography variant="h4">
                {totalPower.toFixed(1)}
                <Typography component="span" variant="h6" color="text.secondary">
                  /{maxSystemPower}kW
                </Typography>
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                Available Power
              </Typography>
              <Typography variant="h4" color={availablePower < 50 ? 'error.main' : 'success.main'}>
                {availablePower.toFixed(1)}
                <Typography component="span" variant="h6" color="text.secondary">
                  kW
                </Typography>
              </Typography>
            </Paper>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddStation}
            color="primary"
            sx={{ height: 'fit-content' }}
          >
            Add Station
          </Button>
          <Button
            variant="outlined"
            startIcon={<BalanceIcon />}
            onClick={onRebalance}
            sx={{ height: 'fit-content' }}
          >
            Rebalance
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <BoltIcon color={powerUsagePercentage > 90 ? 'error' : 'primary'} />
          <Typography variant="body2" color="text.secondary">
            System Load: {powerUsagePercentage.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={powerUsagePercentage}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: powerUsagePercentage > 90 ? '#f44336' : '#2196f3',
              transition: 'transform 0.3s ease'
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default SystemMetrics;