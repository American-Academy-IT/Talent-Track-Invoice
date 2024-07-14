import { Box, FormControl, FormLabel, HStack, useDisclosure } from '@chakra-ui/react';
import { AsyncSelect } from 'chakra-react-select';
import { useFormikContext } from 'formik';
import { useLocation } from 'react-router-dom';

import CustomButton from '../../components/button/custom-button';
import { server } from '../../server-proxy';
import CreateNewClientModal from '../create-client-modal/create-client-modal';
import { InvoiceFormValues } from './create-invoice-page';

const ClientSelectionSearch = () => {
  const { state } = useLocation();
  const { setFieldValue } = useFormikContext<InvoiceFormValues>();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const fetchClients = async (input: string) => {
    if (input.length < 3) return Promise.resolve([]);

    const data = await server.clients.list({ search: input, page: 0 });
    return data.clients.map(client => {
      return {
        value: client.clientID,
        label: `${client.firstName} ${client.lastName} - ${client.mobile}`,
        payload: client,
      };
    });
  };

  return (
    <HStack align="end" w="full">
      <CreateNewClientModal isOpen={isOpen} onClose={onClose} />

      <Box flex={1}>
        <FormControl isRequired>
          <FormLabel>Client Name</FormLabel>
          <AsyncSelect
            required={state?.clientName ? false : true}
            name="clientID"
            defaultInputValue={state?.clientName || ''}
            loadOptions={fetchClients}
            placeholder="find client by name or mobile"
            onChange={payload => setFieldValue('clientID', payload?.value)}
          />
        </FormControl>
      </Box>
      <CustomButton name="Add New" onClick={onOpen} colorScheme="blue" />
    </HStack>
  );
};

export default ClientSelectionSearch;
