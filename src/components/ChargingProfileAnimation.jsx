import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import BoltIcon from '@mui/icons-material/Bolt';

const AnimatedValue = styled(Typography)`
  transition: all 0.5s ease-in-out;
`;

const ProfileBar = styled(LinearProgress)`
  height: 20px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 8px 0;
  
  & .MuiLinearProgress-bar {
    transition: transform 0.5s ease-in-out;
    background: linear-gradient(90deg, #2196f3, #1976d2);
  }
`;

function ChargingProfileAnimation({ station }) {
  const [profileAnimation, setProfileAnimation] = useState({
    currentLimit: station.currentPower,
    targetLimit: station.currentPower,
    isAnimating: false
  });

  useEffect(() => {
    if (station.currentPower !== profileAnimation.currentLimit) {
      setProfileAnimation(prev => ({
        currentLimit: prev.currentLimit,
        targetLimit: station.currentPower,
        isAnimating: true
      }));

      const timer = setTimeout(() => {
        setProfileAnimation(prev => ({
          currentLimit: prev.targetLimit,
          targetLimit: prev.targetLimit,
          isAnimating: false
        }));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [station.currentPower]);

  const percentage = (profileAnimation.currentLimit / station.maxPower) * 100;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 2, 
        background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <BoltIcon color="primary" />
        <Typography variant="subtitle1">
          OCPP Charging Profile - {station.name}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <ProfileBar 
          variant="determinate" 
          value={percentage}
        />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <AnimatedValue 
            variant="body2" 
            color={profileAnimation.isAnimating ? 'primary' : 'textSecondary'}
            sx={{ 
              fontWeight: profileAnimation.isAnimating ? 'bold' : 'normal',
              transform: profileAnimation.isAnimating ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            Current Limit: {profileAnimation.currentLimit.toFixed(1)} kW
          </AnimatedValue>
          
          <Typography variant="body2" color="textSecondary">
            Max Power: {station.maxPower} kW
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Charging Schedule:
          </Typography>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mt: 1,
            p: 1,
            borderRadius: 1,
            bgcolor: 'rgba(33, 150, 243, 0.1)'
          }}>
            <Typography variant="body2">
              Period: {new Date().toLocaleTimeString()}
            </Typography>
            <Typography variant="body2">
              Duration: Unlimited
            </Typography>
            <Typography variant="body2" color="primary">
              Rate Unit: A ({(profileAnimation.currentLimit * 1000 / station.voltage).toFixed(1)} A)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default ChargingProfileAnimation;