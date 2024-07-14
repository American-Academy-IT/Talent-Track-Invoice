import { VStack } from '@chakra-ui/react';
import { ChangeUserPasswordRequest, validateText } from '@invoice-system/shared';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';

import CustomButton from '../../components/button/custom-button';
import CustomInput from '../../components/input/custom-input';
import { Modal } from '../../components/modal/modal';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';

interface Props {
  username: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = (props: Props) => {
  const { username, isOpen, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { successNotification, errorNotification } = useNotification();

  const formSubmitHandler = async (
    values: ChangeUserPasswordRequest,
    actions: FormikHelpers<ChangeUserPasswordRequest>
  ) => {
    setIsLoading(true);
    try {
      const res = await server.users.changePassword(username, values);
      successNotification(res.message);
      actions.resetForm();
      onClose();
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    password: '',
    newPassword: '',
  };

  const body = (
    <Formik initialValues={initialValues} onSubmit={formSubmitHandler}>
      <Form>
        <VStack align="end">
          <CustomInput
            name="password"
            type="password"
            label="Old Password"
            placeholder="Enter old password"
            validate={validateText}
            isRequired={true}
            leftElement={undefined}
          />
          <CustomInput
            name="newPassword"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            validate={validateText}
            isRequired={true}
            leftElement={undefined}
          />

          <CustomButton
            type="submit"
            name={'Save changes'}
            colorScheme="blue"
            minW="min-content"
            isLoading={isLoading}
            loadingText="Submitting"
          />
        </VStack>
      </Form>
    </Formik>
  );

  return <Modal isOpen={isOpen} onClose={() => onClose()} body={body} />;
};

export default ChangePasswordModal;
