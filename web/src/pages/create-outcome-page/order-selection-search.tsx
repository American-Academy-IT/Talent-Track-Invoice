import { FormControl, FormLabel } from '@chakra-ui/react';
import { currencyFormatter, formatISO } from '@invoice-system/shared';
import { AsyncSelect } from 'chakra-react-select';
import { useFormikContext } from 'formik';

import { server } from '../../server-proxy';
import { OutcomeFormValues } from './create-outcome-page';

const OrderSelectionSearch = () => {
  const { setFieldValue } = useFormikContext<OutcomeFormValues>();

  const fetchOrders = async (input: string) => {
    if (input.length < 3) return Promise.resolve([]);

    const data = await server.outcomes.findOrders(input);
    return data.orders.map(order => {
      return {
        value: order.ID,
        label: `${order.serial}, ${order.recipient}, Amount= ${currencyFormatter(
          order.amount,
          order.currency
        )}`,
        payload: order,
      };
    });
  };

  const handleSelectOrder = (order: any) => {
    const date = formatISO(new Date(order.payload.date), { representation: 'date' });
    setFieldValue('date', date);
    setFieldValue('orderDate', date);

    setFieldValue('prefix', order.payload.prefix);
    setFieldValue('serial', order.payload.serial);
    setFieldValue('currency', order.payload.currency);
  };

  return (
    <FormControl isRequired>
      <FormLabel>Find Order</FormLabel>
      <AsyncSelect
        required
        placeholder="find order by serial"
        loadOptions={fetchOrders}
        onChange={handleSelectOrder}
      />
    </FormControl>
  );
};

export default OrderSelectionSearch;
