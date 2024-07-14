import { FormControl, FormErrorMessage, FormLabel, Select } from '@chakra-ui/react';
import { Field, useField } from 'formik';

const Selection = ({ isRequired, options, label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error} isRequired={isRequired}>
      <FormLabel>{label || props.name}</FormLabel>
      <Field as={Select} {...field} {...props}>
        {options?.map((option, idx) => (
          <option key={idx} value={option.key}>
            {option.value}
          </option>
        ))}
      </Field>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default Selection;
