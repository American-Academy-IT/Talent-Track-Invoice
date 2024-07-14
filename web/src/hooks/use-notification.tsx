import { UseToastOptions, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';

const defaultProps: UseToastOptions = {
  duration: 5000,
  isClosable: true,
  position: 'top',
};

const useNotification = () => {
  const toast = useToast();

  const successNotification = (message: string) => {
    toast({
      title: 'Success',
      description: `${message}`,
      status: 'success',
      ...defaultProps,
    });
  };

  const infoNotification = (message: string) => {
    toast({
      title: 'Info',
      description: `${message}`,
      status: 'info',
      ...defaultProps,
    });
  };

  const warningNotification = (message: string) => {
    toast({
      title: 'Warning!',
      description: `${message}`,
      status: 'warning',
      ...defaultProps,
    });
  };

  const errorNotification = (err: AxiosError | any) => {
    toast({
      title: `${err.message}`,
      description: `${JSON.stringify(err.response.data || err.response)}`,
      status: 'error',
      ...defaultProps,
    });
  };

  return { successNotification, errorNotification, infoNotification, warningNotification };
};

export default useNotification;
