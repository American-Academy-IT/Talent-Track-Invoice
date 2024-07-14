import { VStack } from '@chakra-ui/react';
import { UserPayload, validateText } from '@invoice-system/shared';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';

import CustomButton from '../../components/button/custom-button';
import CustomInput from '../../components/input/custom-input';
import Selection from '../../components/input/selection';
import { Modal } from '../../components/modal/modal';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';

interface Props {
  user?: UserPayload;
  setSelectedUser: (value: undefined) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal = (props: Props) => {
  const { user, setSelectedUser, isOpen, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);

  const { successNotification, errorNotification } = useNotification();
  const queryClient = useQueryClient();

  const formSubmitHandler = async (values: UserPayload, actions: FormikHelpers<UserPayload>) => {
    setIsLoading(true);
    try {
      if (user) {
        await server.users.update(user.username!, values);
        successNotification('User updated successfully');
      } else {
        await server.users.create(values);
        successNotification('User created successfully');
      }

      await queryClient.invalidateQueries(['users']);
      actions.resetForm();
      setSelectedUser(undefined);
      onClose();
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    username: user?.username || '',
    role: user?.role || '',
  };

  const body = (
    <Formik initialValues={initialValues} onSubmit={formSubmitHandler}>
      <Form>
        <VStack align="end">
          <CustomInput
            name="username"
            type="text"
            label="Username"
            placeholder="Enter username"
            validate={validateText}
            isRequired={true}
            leftElement={undefined}
          />

          <Selection
            isRequired
            name="role"
            label="Role"
            placeholder="Select user role"
            options={[
              { key: 'customer-service', value: 'customer-service' },
              { key: 'accountant', value: 'accountant' },
              { key: 'audit', value: 'audit' },
              { key: 'review', value: 'review' },
              { key: 'visitor', value: 'visitor' },
            ]}
          />

          {!user && (
            <CustomInput
              name="password"
              type="password"
              label="Password"
              placeholder="Enter password"
              validate={validateText}
              isRequired={true}
              leftElement={undefined}
            />
          )}

          <CustomButton
            type="submit"
            name={`${user ? 'Edit' : 'Add'} User`}
            colorScheme="blue"
            minW="min-content"
            isLoading={isLoading}
            loadingText="Submitting"
          />
        </VStack>
      </Form>
    </Formik>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedUser(undefined);
        onClose();
      }}
      body={body}
    />
  );
};

export default CreateUserModal;
