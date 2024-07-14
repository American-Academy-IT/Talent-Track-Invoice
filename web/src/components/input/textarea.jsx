import {
  Textarea as ChakraTextarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';
import { Field, useField } from 'formik';

const Textarea = ({ isRequired, label, leftElement, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error} isRequired={isRequired}>
      <FormLabel>{label || props.name}</FormLabel>
      <ChakraTextarea as={Field} {...props} {...field} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default Textarea;
