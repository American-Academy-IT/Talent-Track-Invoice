import { Container, HStack, VStack } from '@chakra-ui/react';
import { formatISO, validateDate, validateRange, validateText } from '@invoice-system/shared';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Card from '../../components/UI/card';
import CustomButton from '../../components/button/custom-button';
import CustomInput from '../../components/input/custom-input';
import Selection from '../../components/input/selection';
import Textarea from '../../components/input/textarea';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';
import OrderSelectionSearch from './order-selection-search';
import RecipientSelectionSearch from './recipient-selection-search';
import Type from './type';

export interface OutcomeFormValues {
  type: string;
  serial: string;
  receipt: string;
  prefix: string;
  currency: string;
  date: string;
  recipient: string;
  description: string;
  amount: string;
  method: string;
  orderDate?: string;
}

const CreateOutcomePage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { errorNotification, successNotification } = useNotification();

  const formSubmitHandler = async (
    values: OutcomeFormValues,
    actions: FormikHelpers<OutcomeFormValues>
  ) => {
    try {
      setIsLoading(true);

      const payload = {
        type: values.type,
        amount: parseFloat(values.amount),
        description: values.description,
        prefix: values.prefix,
        date: new Date(values.date),
        method: values.method,
        currency: values.currency,
        recipient: values.recipient,
      };

      if (isUpdate) {
        await server.outcomes.update(state.serial, payload);
      } else if (values.type === 'new') {
        await server.outcomes.create(payload);
      } else {
        await server.outcomes.createReceipt(values.serial, payload);
      }

      successNotification('Outcome created successfully');
      actions.resetForm();
      navigate(-1);
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsLoading(false);
    }
  };

  const initials: OutcomeFormValues = {
    type: state?.type || '',
    serial: state?.serial || '',
    receipt: state?.receipt || '',
    prefix: state?.prefix || '',
    currency: state?.currency || '',
    date: state ? formatISO(new Date(state.date), { representation: 'date' }) : '',
    recipient: state?.recipient || '',
    description: state?.description || '',
    amount: state?.amount || '',
    method: state?.method || '',
  };

  const isUpdate = !!id;

  return (
    <Container minW="container.md">
      <Card>
        <Formik initialValues={initials} onSubmit={formSubmitHandler}>
          {({ values }) => (
            <Form>
              <VStack align="end" spacing={4}>
                {!isUpdate && <Type />}

                {values.receipt === 'exist' && <OrderSelectionSearch />}

                <RecipientSelectionSearch />

                <Textarea
                  isRequired
                  name="description"
                  label="Description"
                  placeholder="Enter a brief description"
                  validate={(value: string) => validateText(value, 5, 500)}
                  leftElement={undefined}
                />

                <HStack w="full">
                  <CustomInput
                    isRequired
                    name="amount"
                    type="number"
                    placeholder="1000"
                    label="Amount"
                    validate={(value: number) => validateRange(value, 0, 1000000)}
                    leftElement={undefined}
                  />

                  {values.receipt !== 'exist' && (
                    <Selection
                      isRequired
                      name="currency"
                      label="Select currency"
                      placeholder="select an option"
                      options={[
                        { key: 'AED', value: 'AED' },
                        { key: 'USD', value: 'USD' },
                      ]}
                    />
                  )}
                  <Selection
                    isRequired
                    name="method"
                    label="Select method"
                    placeholder="select an option"
                    options={[
                      { key: 'CASH', value: 'CASH' },
                      { key: 'WIO', value: 'WIO' },
                    ]}
                  />
                </HStack>

                <CustomInput
                  isRequired
                  name="date"
                  type="date"
                  label="Date"
                  validate={(value: string) => validateDate(value, values.orderDate)}
                  w={300}
                  leftElement={undefined}
                />

                <CustomButton
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText="Submitting"
                  name={`${isUpdate ? 'Update' : 'Create'} Outcome`}
                />
              </VStack>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default CreateOutcomePage;
