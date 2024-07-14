import { HStack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';

import Selection from '../../components/input/selection';
import { OutcomeFormValues } from './create-outcome-page';

const Type = () => {
  const { values } = useFormikContext<OutcomeFormValues>();

  return (
    <HStack w="full">
      <Selection
        isRequired
        name="type"
        label="Select outcome type"
        placeholder="select an option"
        options={[
          { key: 'order', value: 'Order' },
          { key: 'receipt', value: 'Receipt' },
        ]}
      />
      {values.type === 'receipt' && (
        <Selection
          isRequired
          name="receipt"
          label="Select receipt type"
          placeholder="select an option"
          options={[
            { key: 'new', value: 'New' },
            { key: 'exist', value: 'Exist' },
          ]}
        />
      )}

      {values.receipt !== 'exist' && (
        <Selection
          isRequired
          name="prefix"
          label="Select cost center"
          placeholder="select an option"
          options={[
            { key: 'TR', value: 'Training' },
            { key: 'EX', value: 'Exams' },
          ]}
        />
      )}
    </HStack>
  );
};

export default Type;
