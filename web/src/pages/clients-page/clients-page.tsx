import { Flex, HStack, Heading, useDisclosure } from '@chakra-ui/react';
import { Client } from '@invoice-system/shared';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';

import CustomButton from '../../components/button/custom-button';
import DataTable from '../../components/table/data-table';
import { UserContext } from '../../context/user-context';
import { server } from '../../server-proxy';
import { FORMATE_TABLE_HEADER } from '../../utils/helpers';
import CreateClientModal from '../create-client-modal/create-client-modal';
import { TableFilters } from './table-filters';

export interface ClientFilters {
  search: string;
  page: number;
}

const ClientsPage = () => {
  const { canAudit } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [curClient, setCurClient] = useState<Partial<Client> | undefined>();
  const [clientFilters, setClientFilters] = useState<ClientFilters>({
    search: '',
    page: 0,
  });
  const { isLoading, data } = useQuery({
    queryKey: ['clients', clientFilters.search, clientFilters.page],
    queryFn: () => server.clients.list(clientFilters),
  });

  // table data
  const headerContent = ['client id', 'first name', 'middle name', 'last name', 'mobile', 'action'];
  const header = FORMATE_TABLE_HEADER(headerContent);

  const clients = data?.clients.map(client => {
    return {
      'client id': client.clientID,
      'first name': client.firstName,
      'middle name': client?.middleName || '-',
      'last name': client.lastName,
      mobile: client.mobile || '-',
      action: (
        <CustomButton
          name="Edit"
          size="xs"
          variant="outline"
          colorScheme="yellow"
          isDisabled={!canAudit}
          onClick={() => {
            setCurClient(client);
            onOpen();
          }}
        />
      ),
    };
  });

  return (
    <>
      <CreateClientModal isOpen={isOpen} onClose={onClose} client={curClient} />
      <Flex minW="full" flexDir="column" gap={2}>
        <HStack justify="space-between">
          <Heading size="lg" color="gray.400">
            Clients
          </Heading>
          {canAudit && (
            <CustomButton
              name="Add Client"
              colorScheme="teal"
              onClick={() => {
                setCurClient(undefined);
                onOpen();
              }}
            />
          )}
        </HStack>
        <TableFilters
          hasNext={data?.hasNext || false}
          hasPrevious={data?.hasPrevious || false}
          setClientFilters={setClientFilters}
        />
        <DataTable columns={header} data={clients || []} isLoading={isLoading} />
      </Flex>
    </>
  );
};

export default ClientsPage;
