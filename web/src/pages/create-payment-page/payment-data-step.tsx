import { HStack, Stack, Text } from '@chakra-ui/react';
import { currencyFormatter, validateDate, validateRange } from '@invoice-system/shared';
import { useFormikContext } from 'formik';
import moment from 'moment';

import CustomInput from '../../components/input/custom-input';
import Selection from '../../components/input/selection';
import { PaymentFormValues } from './create-payment-page';

const PaymentDataStep = () => {
  const { values } = useFormikContext<PaymentFormValues>();
  const isInternShip = values.discount === '100';
  values.invoicePrice = +values.coursePrice - +values.coursePrice * (+values.discount / 100) + '';
  values.remainingAmount = values.type === 'new' ? values.invoicePrice : values.remainingAmount;

  if (isInternShip) {
    values.paymentAmount = '0';
    values.paymentMethod = 'CASH';
  }

  const today = moment().format('YYYY-MM-DD');
  const minDate = moment().subtract(3, 'days').format('YYYY-MM-DD');

  return (
    <>
      <HStack w="full">
        {!isInternShip && (
          <CustomInput
            isRequired
            name="paymentAmount"
            type="number"
            placeholder="100"
            label="Amount"
            validate={(value: string) => validateRange(+value, 0, +values.remainingAmount)}
            leftElement={undefined}
          />
        )}

        {!isInternShip && (
          <Selection
            isRequired
            name="paymentMethod"
            label="Method"
            placeholder="select an option"
            options={[
              { key: 'CASH', value: 'Cash' },
              { key: 'WIO', value: 'WIO' },
            ]}
          />
        )}
      </HStack>

      <HStack w="full" justify="space-between">
        <CustomInput
          isRequired
          name="paymentDate"
          type="date"
          label="Date"
          validate={validateDate}
          w={300}
          min={minDate}
          max={today}
          leftElement={undefined}
        />
        <Stack color="green" minW="max-content" h="full">
          <Text as="b">Invoice Price</Text>
          <Text>{currencyFormatter(+values.invoicePrice, values.currency)}</Text>
        </Stack>
      </HStack>
    </>
  );
};

export default PaymentDataStep;
