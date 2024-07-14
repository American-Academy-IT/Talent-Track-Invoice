import { FormControl, FormLabel } from '@chakra-ui/react';
import { AsyncSelect } from 'chakra-react-select';
import { useFormikContext } from 'formik';
import { useLocation } from 'react-router-dom';

import { server } from '../../server-proxy';
import { OutcomeFormValues } from './create-outcome-page';

const RecipientSelectionSearch = () => {
  const { state } = useLocation();
  const { setFieldValue } = useFormikContext<OutcomeFormValues>();

  const fetchRecipients = async (input: string) => {
    if (input.length < 3) return Promise.resolve([]);

    const data = await server.outcomes.findRecipient(input);

    if (data.recipients.length === 0) {
      data.recipients.push({ recipient: input });
    }

    return data.recipients.map(recipient => {
      return {
        label: recipient.recipient,
        value: recipient.recipient,
        payload: recipient,
      };
    });
  };

  const handleSelectRecipient = (payload: any) => {
    setFieldValue('recipient', payload.value);
  };

  return (
    <FormControl isRequired={true}>
      <FormLabel>Recipient</FormLabel>
      <AsyncSelect
        required={state?.recipient ? false : true}
        placeholder="Enter recipient name"
        defaultInputValue={state?.recipient || ''}
        loadOptions={fetchRecipients}
        onChange={handleSelectRecipient}
      />
    </FormControl>
  );
};

export default RecipientSelectionSearch;
