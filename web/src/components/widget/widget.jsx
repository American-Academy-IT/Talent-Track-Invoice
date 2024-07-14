import { Flex, Stat, StatArrow, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';

import Card from '../UI/card';
import { Icon } from '../UI/icons';

const Widget = ({ title, isMoney, path }) => {
  const isIncreasing = true;
  // const diff = (Math.abs(cur - prev) / 100) * 100;
  // const statValue = isMoney ? helpers.currencyFormatter(cur, 'AED') : cur;

  let icon;
  const iconConfig = {
    h: 6,
    w: 6,
    rounded: 'md',
  };
  if (title === 'Customers') {
    icon = <Icon name="person" {...iconConfig} bg="red.200" color="red.900" />;
  }
  if (title === 'Invoices') {
    icon = <Icon name="invoice" {...iconConfig} p={0.5} bg="yellow.200" color="yellow.900" />;
  }
  if (title === 'Income') {
    icon = <Icon name="dollar" {...iconConfig} bg="green.200" color="green.900" />;
  }
  if (title === 'Outcome') {
    icon = <Icon name="wallet" {...iconConfig} bg="purple.200" color="purple.900" />;
  }

  return (
    <Card w="100%">
      <Stat>
        <Flex justify="space-between">
          <StatLabel>{title}</StatLabel>
          {icon}
        </Flex>

        {/* <StatNumber>{statValue}</StatNumber> */}

        <StatHelpText>
          <StatArrow type={isIncreasing ? 'increase' : 'decrease'} />
          {/* {diff.toFixed(0)} */}
        </StatHelpText>
      </Stat>
    </Card>
  );
};

export default Widget;
