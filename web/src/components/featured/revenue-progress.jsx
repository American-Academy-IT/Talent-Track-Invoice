import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  HStack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { currencyFormatter } from '@invoice-system/shared';

import { GRAY_COLOR } from '../../data/constants';
import Card from '../UI/card';

const RevenueProgress = ({
  totalPaidSum,
  today = totalPaidSum,
  target = 1000000,
  lastWeek = 50000,
  lastMonth = 200000,
  ...props
}) => {
  const color = useColorModeValue(...GRAY_COLOR);
  const redColor = useColorModeValue('red.200', 'red.700');
  const greenColor = useColorModeValue('green.200', 'green.500');

  const progressValue = (today / target) * 100;

  return (
    <Card {...props}>
      <Text fontSize="larger" fontWeight="semibold" color={color}>
        Total Revenue
      </Text>
      <VStack>
        <CircularProgress
          value={progressValue}
          size="150px"
          thickness="2px"
          aria-label="daily-progressbar"
        >
          <CircularProgressLabel>{progressValue.toFixed(0)}%</CircularProgressLabel>
        </CircularProgress>
        <Text color={color}>Last 50 Payment</Text>
        <Text fontSize="xx-large">{currencyFormatter(totalPaidSum, 'AED')}</Text>
        <Text fontSize="xs" color={color}>
          Previous transactions processing. Last payments may not be included.
        </Text>
        <HStack w="xs">
          <Stat>
            <StatLabel color={color}>Target</StatLabel>
            <Flex align="start" gap={1}>
              <StatNumber fontSize="sm" color={color}>
                {currencyFormatter(target, 'AED')}
              </StatNumber>
              {/* <StatHelpText>
                <StatArrow type={'decrease'} />
              </StatHelpText> */}
            </Flex>
          </Stat>
          <Stat>
            <StatLabel color={color}>Last week</StatLabel>
            <Flex align="start" gap={1}>
              <StatNumber fontSize="sm" color={greenColor}>
                {currencyFormatter(lastWeek, 'AED')}
              </StatNumber>
              {/* <StatHelpText>
                <StatArrow type={'increase'} />
              </StatHelpText> */}
            </Flex>
          </Stat>
          {/* <Stat>
            <StatLabel color={color}>Last Month</StatLabel>
            <Flex align="start" gap={1}>
              <StatNumber fontSize="sm" color={greenColor}>
                {currencyFormatter(lastMonth, 'AED')}
              </StatNumber>
              {/* <StatHelpText>
                <StatArrow type={'increase'} />
              </StatHelpText> 
            </Flex> 
          {/* </Stat>  */}
        </HStack>
      </VStack>
    </Card>
  );
};

export default RevenueProgress;
