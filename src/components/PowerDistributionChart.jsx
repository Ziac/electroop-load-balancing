import React, { useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';

const COLORS = {
  'Ultra-Fast DC': '#2196f3',
  'Fast DC': '#4caf50',
  'Standard DC': '#ff9800'
};

function PowerDistributionChart({ stations }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const data = stations.map(station => ({
    name: station.name,
    value: station.currentPower,
    type: station.type,
    id: station.id
  }));

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 12}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Power Distribution
      </Typography>
      
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              label={({ name, value }) => `${name}: ${value}kW`}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.id}
                  fill={COLORS[entry.type] || '#8884d8'}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value}kW`, name]}
              contentStyle={{ borderRadius: 8 }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default PowerDistributionChart;