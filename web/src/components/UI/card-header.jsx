import { Heading, useColorModeValue } from '@chakra-ui/react';

import { GRAY_COLOR } from '../../data/constants';
import Card from './card';

const CardHeader = ({ title }) => {
  const color = useColorModeValue(...GRAY_COLOR);

  return (
    <Card my={2}>
      <Heading size="sm" textTransform="uppercase" color={color}>
        {title}
      </Heading>
    </Card>
  );
};

export default CardHeader;
