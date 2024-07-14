import { Container, Flex, List, ListItem, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '../../components/UI/card';
import CardHeader from '../../components/UI/card-header';

const Details = ({ from }) => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();

  useEffect(() => {
    if (!state) {
      navigate(pathname + '/not-found');
    }
  });

  let content = [];

  for (const key in state) {
    if (key === 'token') continue;
    content.push(
      <ListItem key={key}>
        <Text as="b">{key}: </Text>
        <Text as="kbd">{String(state[key])}</Text>
      </ListItem>
    );
  }

  return (
    <Container minW="container.md">
      <CardHeader title={`${from} Details`} />
      <Card>
        <Flex justify="space-between">
          <List>{content}</List>
        </Flex>
      </Card>
    </Container>
  );
};

export default Details;
