import { FormControl, FormErrorMessage, FormLabel, Input, InputGroup } from '@chakra-ui/react';
import { Field, useField } from 'formik';

const CustomInput = ({ isRequired, label, leftElement, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error} isRequired={isRequired}>
      <FormLabel>{label || props.name}</FormLabel>
      <InputGroup>
        {leftElement}
        <Input as={Field} {...props} {...field} />
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomInput;
