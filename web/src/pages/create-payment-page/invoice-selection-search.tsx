import { FormControl, FormLabel } from '@chakra-ui/react';
import { currencyFormatter } from '@invoice-system/shared';
import { AsyncSelect } from 'chakra-react-select';
import { useFormikContext } from 'formik';

import { server } from '../../server-proxy';
import { PaymentFormValues } from './create-payment-page';

const InvoiceSelectionSearch = () => {
  const { values, setFieldValue } = useFormikContext<PaymentFormValues>();

  const handleSelectInvoice = (payload: any) => {
    setFieldValue('invoiceID', payload.value);
    setFieldValue('prefix', payload.invoice.prefix);
    setFieldValue('currency', payload.invoice.currency);
    setFieldValue('discount', payload.invoice.discount);
    setFieldValue('coursePrice', payload.invoice.coursePrice);
    setFieldValue('remainingAmount', payload.invoice.remainingAmount);
  };

  const fetchInvoices = async (input: string) => {
    if (input.length < 3) return Promise.resolve([]);

    const data = await server.invoices.find(input);
    const invoices = data.invoices.filter(invoice => +invoice.remainingAmount > 0);

    return invoices.map(invoice => {
      if (+invoice.remainingAmount > 0 && invoice.prefix.startsWith(values.prefix)) {
      }
      return {
        invoice,
        value: invoice.invoiceID,
        label: `${invoice.clientName} ${invoice.mobile} --- Remains: ${currencyFormatter(
          invoice.remainingAmount,
          invoice.currency
        )}`,
      };
    });
  };

  return (
    <FormControl isRequired>
      <FormLabel>Find Order</FormLabel>
      <AsyncSelect
        required
        placeholder="find order by serial"
        loadOptions={fetchInvoices}
        onChange={handleSelectInvoice}
      />
    </FormControl>
  );
};

export default InvoiceSelectionSearch;
