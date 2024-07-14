import { HStack } from '@chakra-ui/react';
import { validateDate } from '@invoice-system/shared';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

import CustomInput from '../../components/input/custom-input';
import Selection from '../../components/input/selection';

const InvoiceDataStep = () => {
  const { state } = useLocation();

  const today = moment().format('YYYY-MM-DD');
  const minDate = moment().subtract(3, 'days').format('YYYY-MM-DD');

  return (
    <HStack w="full">
      <Selection
        name="discount"
        label="Discount"
        options={[
          { key: '0', value: 'select an option' },
          { key: '10', value: '10%' },
          // { key: '25', value: '25%' },
          // { key: '50', value: '50%' },
          // { key: '75', value: '75%' },
          // { key: '100', value: 'Internship' },
        ]}
        isRequired={undefined}
      />

      <HStack w="full" justify="space-between">
        <CustomInput
          isRequired
          type="date"
          name="invoiceDate"
          label="Invoice Date"
          validate={validateDate}
          leftElement={undefined}
          min={minDate}
          max={today}
        />
      </HStack>

      {!!state && (
        <CustomInput
          isRequired
          type="number"
          name="invoicePrice"
          label="Invoice Price"
          min={0}
          leftElement={undefined}
        />
      )}
    </HStack>
  );
};

export default InvoiceDataStep;
