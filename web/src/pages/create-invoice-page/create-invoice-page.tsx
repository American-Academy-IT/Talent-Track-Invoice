import { Container, VStack } from '@chakra-ui/react';
import { formatISO } from '@invoice-system/shared';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '../../components/UI/card';
import CustomButton from '../../components/button/custom-button';
import Selection from '../../components/input/selection';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';
import ClientSearchInput from './client-selection-search';
import CourseSelectionInput from './course-selection-input';
import InvoiceDataStep from './invoice-data-step';

export interface InvoiceFormValues {
  clientID: string;
  courseID: string;
  prefix: string;
  discount: number;
  invoiceDate: string;
  coursePrice?: number;
  invoicePrice: number;
}

const CreateInvoicePageComponent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { errorNotification, successNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = async (
    values: InvoiceFormValues,
    actions: FormikHelpers<InvoiceFormValues>
  ) => {
    const payload = {
      prefix: values.prefix,
      invoicePrice: values.invoicePrice,
      clientID: parseInt(values.clientID),
      discount: values.discount,
      invoiceDate: new Date(values.invoiceDate),
      courseID: parseInt(values.courseID),
      coursePrice: values.coursePrice,
    };

    try {
      if (state) {
        await server.invoices.update(state.invoiceID, {
          ...payload,
          invoicePrice: values.invoicePrice,
          coursePrice: values.coursePrice,
        });
        navigate('/invoices', { replace: true });
      } else {
        const invoice = await server.invoices.create(payload);
        navigate('/payments/create/payment', { state: invoice });
      }

      successNotification(`Invoice ${!!state ? 'updated' : 'created'} successfully`);
      actions.resetForm();
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues: InvoiceFormValues = {
    prefix: state ? state.prefix : '',
    clientID: state ? state.clientID + '' : '',
    courseID: state ? state.courseID + '' : '',
    discount: state ? state.discount : 0,
    coursePrice: state ? state.coursePrice : 0,
    invoicePrice: state ? state.invoicePrice : 0,
    invoiceDate: state ? formatISO(new Date(state.invoiceDate), { representation: 'date' }) : '',
  };

  return (
    <Container minW="container.md">
      <Card>
        <Formik initialValues={initialValues} onSubmit={formSubmitHandler}>
          <Form>
            <VStack align="end" spacing={4}>
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

              <ClientSearchInput />
              <CourseSelectionInput />
              <InvoiceDataStep />

              <CustomButton
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Submitting"
                name={`${state ? 'Edit' : 'Create'} Invoice`}
              />
            </VStack>
          </Form>
        </Formik>
      </Card>
    </Container>
  );
};

export default CreateInvoicePageComponent;
