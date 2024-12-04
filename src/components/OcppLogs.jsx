import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Box, List, ListItem, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const LogEntry = styled(ListItem)(({ theme, msgtype }) => ({
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: msgtype === 'request' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)',
  border: `1px solid ${msgtype === 'request' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`,
  transition: 'all 0.3s ease',
  animation: 'fadeIn 0.5s ease',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  }
}));

const DeltaValue = styled('span')(({ theme, $increased }) => ({
  color: $increased ? theme.palette.success.main : theme.palette.error.main,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontWeight: 'bold',
  animation: 'pulse 0.5s ease',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' }
  }
}));

function OcppLogs({ station, previousPower }) {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);
  const maxLogs = 5;

  useEffect(() => {
    if (previousPower !== station.currentPower) {
      const timestamp = new Date().toLocaleTimeString();
      const delta = station.currentPower - previousPower;
      const newLog = {
        id: Date.now(),
        timestamp,
        type: 'request',
        action: 'SetChargingProfile',
        delta,
        message: {
          connectorId: 1,
          csChargingProfiles: {
            chargingProfileId: Date.now(),
            stackLevel: 0,
            chargingProfilePurpose: 'TxProfile',
            chargingProfileKind: 'Relative',
            chargingSchedule: {
              chargingRateUnit: 'A',
              chargingSchedulePeriod: [{
                startPeriod: 0,
                limit: (station.currentPower * 1000) / station.voltage
              }]
            }
          }
        }
      };

      const responseLog = {
        id: Date.now() + 1,
        timestamp,
        type: 'response',
        action: 'SetChargingProfile',
        status: 'Accepted'
      };

      setLogs(prevLogs => {
        const newLogs = [...prevLogs, newLog, responseLog].slice(-maxLogs);
        return newLogs;
      });
    }
  }, [station.currentPower, previousPower, station.voltage]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2, maxHeight: 400, overflow: 'auto' }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CompareArrowsIcon color="primary" />
        OCPP Message Logs
      </Typography>

      <List>
        {logs.map((log) => (
          <LogEntry key={log.id} msgtype={log.type}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {log.timestamp}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {log.action}
                </Typography>
              </Box>

              {log.type === 'request' && (
                <Box component="div">
                  <Box component="div" sx={{ mb: 1 }}>
                    Power Adjustment:{' '}
                    <DeltaValue $increased={log.delta > 0}>
                      {log.delta > 0 ? '+' : ''}{log.delta.toFixed(1)} kW
                    </DeltaValue>
                  </Box>
                  <Collapse in={true}>
                    <Box sx={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      p: 1,
                      borderRadius: 1,
                      fontSize: '0.8rem'
                    }}>
                      <pre style={{ margin: 0, overflow: 'auto' }}>
                        {JSON.stringify(log.message, null, 2)}
                      </pre>
                    </Box>
                  </Collapse>
                </Box>
              )}

              {log.type === 'response' && (
                <Box component="div" color="success.main">
                  Status: {log.status}
                </Box>
              )}
            </Box>
          </LogEntry>
        ))}
        <div ref={logsEndRef} />
      </List>
    </Paper>
  );
}

export default OcppLogs;