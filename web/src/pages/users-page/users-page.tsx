import { Flex, HStack, Heading, useDisclosure } from '@chakra-ui/react';
import { UserPayload } from '@invoice-system/shared';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';

import CustomButton from '../../components/button/custom-button';
import DataTable from '../../components/table/data-table';
import { UserContext } from '../../context/user-context';
import { server } from '../../server-proxy';
import { FORMATE_TABLE_HEADER } from '../../utils/helpers';
import ChangePasswordModal from './change-password-modal';
import CreateUserModal from './create-user-modal';

const UsersPage = () => {
  const { isAdmin } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserPayload>();
  const {
    isOpen: isPasswordOpen,
    onOpen: onPasswordOpen,
    onClose: onPasswordClose,
  } = useDisclosure();

  const { isLoading, data } = useQuery({
    queryKey: ['users'],
    queryFn: () => server.users.list(),
  });

  // table data
  const headerContent = ['username', 'role', 'action'];
  const header = FORMATE_TABLE_HEADER(headerContent);

  const users = data?.users.map((user: UserPayload) => {
    return {
      username: user.username,
      role: user?.role,
      action: (
        <HStack>
          <CustomButton
            name="Edit"
            size="xs"
            variant="outline"
            colorScheme="yellow"
            isDisabled={!isAdmin}
            onClick={() => {
              onOpen();
              setSelectedUser(user);
            }}
          />
          <CustomButton
            name="Change Password"
            size="xs"
            variant="outline"
            colorScheme="red"
            isDisabled={!isAdmin}
            onClick={() => {
              onPasswordOpen();
              setUsername(user.username);
            }}
          />
        </HStack>
      ),
    };
  });

  return (
    <>
      <CreateUserModal
        user={selectedUser}
        isOpen={isOpen}
        onClose={onClose}
        setSelectedUser={setSelectedUser}
      />
      <ChangePasswordModal username={username} isOpen={isPasswordOpen} onClose={onPasswordClose} />
      <Flex minW="full" flexDir="column" gap={2}>
        <HStack justify="space-between">
          <Heading size="lg" color="gray.400">
            Clients
          </Heading>
          <CustomButton name="Add User" colorScheme="teal" onClick={() => onOpen()} />
        </HStack>
        <DataTable columns={header} data={users || []} isLoading={isLoading} />
      </Flex>
    </>
  );
};

export default UsersPage;
