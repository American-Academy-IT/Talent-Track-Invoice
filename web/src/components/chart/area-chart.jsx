import { useColorModeValue } from '@chakra-ui/react';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis } from 'recharts';

const ChartArea = ({ data }) => {
  const strokeColor = useColorModeValue('lightgray', '#2D3748');

  return (
    <AreaChart
      data={data}
      width="full"
      height="full"
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="month" />
      <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
      <Tooltip />
      <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
    </AreaChart>
  );
};

export default ChartArea;
