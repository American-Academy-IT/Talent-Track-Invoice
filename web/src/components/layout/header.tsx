import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../../context/user-context';
import { server } from '../../server-proxy';
import { isLoggedIn } from '../../server-proxy/auth';
import { Icon } from '../UI/icons';
import Sidebar from './sidebar';

const Header = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { toggleColorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { user } = useContext(UserContext);

  const iconName = colorMode === 'light' ? 'moon' : 'sun';
  const darkModeIcon = <Icon name={iconName} />;
  const loggedIn = isLoggedIn();

  return (
    <>
      <Sidebar onClose={onClose} isOpen={isOpen} />
      <Flex
        pl={4}
        h="60px"
        w="full"
        as="header"
        align="center"
        borderBottom="1px"
        justify="space-between"
      >
        <Flex gap={2}>
          {loggedIn && (
            <IconButton
              onClick={onOpen}
              aria-label="sidebar menu"
              icon={<Icon name="hamburgerMenu" />}
            />
          )}
          <IconButton aria-label="toggle colorMode" onClick={toggleColorMode} icon={darkModeIcon} />
          {loggedIn && (
            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<Avatar name={user?.username} src="" size="sm" />}
                rightIcon={<Icon name="dropdownMenu" />}
              >
                {user?.username?.toUpperCase()}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate(`/profile/${user?.username}`, { state: user })}>
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => server.auth.logout()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
        <Link aria-label="logo" to={'/'}>
          {/* <PreviewImage image={logo} boxSize="65px" /> */}
        </Link>
      </Flex>
    </>
  );
};

export default Header;
