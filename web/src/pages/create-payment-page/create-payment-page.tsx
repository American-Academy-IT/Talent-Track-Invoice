import { Container, HStack, Text, VStack } from '@chakra-ui/react';
import { formatISO } from '@invoice-system/shared';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '../../components/UI/card';
import CustomButton from '../../components/button/custom-button';
import Selection from '../../components/input/selection';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';
import InvoiceSelectionSearch from './invoice-selection-search';
import PaymentDataStep from './payment-data-step';

export interface PaymentFormValues {
  clientID: number;
  type: string;
  prefix: string;
  discount: string;
  invoiceID: string;
  paymentAmount: string;
  paymentMethod: string;
  paymentDate: string;
  currency: string;
  coursePrice: string;
  invoicePrice: string;
  remainingAmount: string;
}

const CreatePaymentPageComponent = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { errorNotification, successNotification } = useNotification();

  const isEdit = !!state?.paymentID;
  const invoiceIdExist = !!state?.invoiceID;

  const formSubmitHandler = async (
    values: PaymentFormValues,
    actions: FormikHelpers<PaymentFormValues>
  ) => {
    try {
      setLoading(true);

      if (isEdit) {
        await server.payments.update(state.paymentID, {
          paymentAmount: parseFloat(values.paymentAmount),
          paymentMethod: values.paymentMethod,
          paymentDate: new Date(values.paymentDate),
        });
        successNotification('Payment updated successfully');
      } else {
        const res = await server.payments.create({
          invoiceID: parseInt(values.invoiceID),
          paymentAmount: parseFloat(values.paymentAmount),
          paymentMethod: values.paymentMethod,
          paymentDate: new Date(values.paymentDate),
        });
        await server.payments.download(res.paymentID);
        successNotification('Payment created successfully');
      }

      actions.resetForm();
      navigate('/payments', { replace: true });
    } catch (err) {
      errorNotification(err);
    } finally {
      setLoading(false);
    }
  };

  const initials: PaymentFormValues = {
    // invoice data
    prefix: state?.prefix || '',
    discount: state?.discount || 0,

    // payment data
    invoiceID: state?.invoiceID || '',
    paymentAmount: state?.paymentAmount || '',
    paymentMethod: state?.paymentMethod || '',
    paymentDate: state?.paymentDate
      ? formatISO(new Date(state.paymentDate), { representation: 'date' })
      : '',

    // extra data: for UI
    type: '',
    clientID: state?.clientID || '',
    currency: state?.currency || '',
    coursePrice: state?.coursePrice || 0,
    invoicePrice: state?.invoicePrice || 0,
    remainingAmount: state?.invoicePrice || 0,
  };

  return (
    <Container minW="container.md">
      <Card>
        <Formik initialValues={initials} onSubmit={formSubmitHandler}>
          <Form>
            <VStack align="end" spacing={4}>
              {invoiceIdExist && (
                <HStack w="full">
                  <Text w="50%">
                    InvoiceID <br /> <Text as="b">{state.invoiceID}</Text>
                  </Text>
                  <Text w="50%">
                    Cost Center <br />
                    <Text as="b">{state.prefix === 'EX' ? 'EXAMS' : 'TRAIN'}</Text>
                  </Text>
                </HStack>
              )}

              {!invoiceIdExist && (
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
              {!invoiceIdExist && <InvoiceSelectionSearch />}

              <PaymentDataStep />
              <CustomButton
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Submitting"
                name={`${isEdit ? 'Edit' : 'Create'} Payment`}
              />
            </VStack>
          </Form>
        </Formik>
      </Card>
    </Container>
  );
};

export default CreatePaymentPageComponent;
