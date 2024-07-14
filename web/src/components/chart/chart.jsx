import { Text, useColorModeValue } from '@chakra-ui/react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { GRAY_COLOR } from '../../data/constants';
import Card from '../UI/card';

const Chart = ({ chartData, ...props }) => {
  const color = useColorModeValue(...GRAY_COLOR);
  const strokeColor = useColorModeValue('lightgray', '#000');

  return (
    <Card {...props}>
      <Text fontSize="larger" fontWeight="bold" mb={5} color={color}>
        Last 6 Months (Revenue)
      </Text>
      <ResponsiveContainer minWidth={500} maxHeight={250}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
