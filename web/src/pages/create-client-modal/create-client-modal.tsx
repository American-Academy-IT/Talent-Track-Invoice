import { VStack } from '@chakra-ui/react';
import { Client, CreateClientRequest, validateMobile, validateText } from '@invoice-system/shared';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';

import CustomButton from '../../components/button/custom-button';
import CustomInput from '../../components/input/custom-input';
import { Modal } from '../../components/modal/modal';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  client?: Partial<Client>;
  handleSelectClient?: (value: Partial<Client>) => void;
}

const CreateClientModal = (props: Props) => {
  const { handleSelectClient, isOpen, onClose, client } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { successNotification, errorNotification } = useNotification();

  const formSubmitHandler = async (
    values: CreateClientRequest,
    actions: FormikHelpers<CreateClientRequest>
  ) => {
    setIsLoading(true);
    try {
      let res = null;
      if (client) {
        res = await server.clients.edit(client.clientID!, values);
        successNotification('Client updated successfully');
      } else {
        res = await server.clients.create(values);
        successNotification('Client created successfully');
      }

      if (handleSelectClient) {
        handleSelectClient(res);
      }

      actions.resetForm();
      onClose();
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    firstName: client?.firstName || '',
    middleName: client?.middleName || '',
    lastName: client?.lastName || '',
    mobile: client?.mobile || '',
  };

  const body = (
    <Formik initialValues={initialValues} onSubmit={formSubmitHandler}>
      <Form>
        <VStack align="end">
          <CustomInput
            name="firstName"
            type="text"
            label="First Name"
            placeholder="enter first name"
            validate={validateText}
            isRequired={true}
            leftElement={undefined}
          />
          <CustomInput
            name="middleName"
            type="text"
            label="Middle Name"
            placeholder="enter middle name"
            isRequired={true}
            leftElement={undefined}
          />
          <CustomInput
            name="lastName"
            type="text"
            label="Last Name"
            placeholder="enter last name"
            validate={validateText}
            isRequired={true}
            leftElement={undefined}
          />
          <CustomInput
            name="mobile"
            type="text"
            label="Client Mobile"
            placeholder="enter client mobile"
            validate={validateMobile}
            isRequired={true}
            leftElement={undefined}
          />
          <CustomButton
            type="submit"
            name={`${client ? 'Edit' : 'Add'} Client`}
            colorScheme="blue"
            minW="min-content"
            isLoading={isLoading}
            loadingText="Submitting"
          />
        </VStack>
      </Form>
    </Formik>
  );

  return <Modal isOpen={isOpen} onClose={onClose} body={body} />;
};

export default CreateClientModal;
