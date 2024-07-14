import {
  Divider,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { UserContext } from '../../context/user-context';
import { GRAY_COLOR } from '../../data/constants';
import { server } from '../../server-proxy';
import { GET_SIDEBAR_LIST } from '../../utils/helpers';
import { Icon } from '../UI/icons';
import CustomButton from '../button/custom-button';
import { Drawer } from '../drawer/drawer';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useContext(UserContext);
  const color = useColorModeValue(...GRAY_COLOR);

  const sidebarList = GET_SIDEBAR_LIST(user?.role);

  const bodyContent = (
    <Stack as="nav">
      <Heading size="xs" textTransform="uppercase" color={color}>
        Main
      </Heading>
      <Link
        as={props => (
          <NavLink
            {...props}
            style={({ isActive }) => {
              return { fontWeight: isActive ? 'bold' : 'normal' };
            }}
          />
        )}
        to="/dashboard"
      >
        <Flex align="center" gap={1}>
          {<Icon name="dashboard" />}
          <Text> Dashboard </Text>
        </Flex>
      </Link>
      <Divider />
      <Heading size="xs" textTransform="uppercase" color={color}>
        Lists
      </Heading>
      <List spacing={3}>
        {sidebarList.map(link => (
          <ListItem key={link}>
            <Link
              as={props => (
                <NavLink
                  {...props}
                  style={({ isActive }) => {
                    return { fontWeight: isActive ? 'bold' : 'normal' };
                  }}
                />
              )}
              to={link.toLowerCase()}
            >
              <Flex align="center" gap={1}>
                {<Icon name={link.toLowerCase()} />}
                {link}
              </Flex>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Stack>
  );

  const footerContent = (
    <CustomButton
      w="full"
      name="Logout"
      alignSelf="center"
      onClick={server.auth.logout}
      leftIcon={<Icon name="exit" />}
    />
  );

  return (
    <Drawer
      bodyContent={bodyContent}
      footerContent={footerContent}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default Sidebar;
