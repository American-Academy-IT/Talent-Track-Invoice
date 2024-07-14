import { Container, Heading, InputLeftElement, Text, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '../../components/UI/icons';
import CustomButton from '../../components/button/custom-button';
import CustomInput from '../../components/input/custom-input';
import { UserContext } from '../../context/user-context';
import { server } from '../../server-proxy';

const LoginPage = () => {
  const [error, setError] = useState(null);
  const { login } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  const formSubmitHandler = async enteredValues => {
    try {
      setIsLoading(true);
      await server.auth.login(enteredValues.username, enteredValues.password);
    } catch (err) {
      setError(err.response.data.message || err.response.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container as="main" my={28}>
      <Heading textAlign="center">Login</Heading>
      <Formik initialValues={{ username: '', password: '' }} onSubmit={formSubmitHandler}>
        <Form onChange={() => setError(null)}>
          <VStack spacing={4}>
            <CustomInput
              isRequired
              type="text"
              name="username"
              label="Username"
              placeholder="Enter your username"
              leftElement={<InputLeftElement mr={5} children={<Icon name="person" />} />}
            />
            <CustomInput
              isRequired
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              leftElement={<InputLeftElement children={<Icon name="password" />} />}
            />
            {error && <Text color="red.500">{error}</Text>}
            <CustomButton
              name="Login"
              type="submit"
              variant="outline"
              isLoading={isLoading}
              loadingText="Loading"
              spinnerPlacement="end"
            />
          </VStack>
        </Form>
      </Formik>
    </Container>
  );
};

export default LoginPage;
