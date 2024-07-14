import { FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';
import { Field, useField } from 'formik';

import PreviewImage from '../UI/preview-image';

const InputFile = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { value, ...rest } = field;

  return (
    <FormControl maxW="max-content">
      <FormLabel cursor="pointer">
        <PreviewImage image={label} />
      </FormLabel>
      <Input as={Field} type="file" display="none" value={undefined} {...rest} {...props} />
      {meta.error && <FormHelperText color="red.400">{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default InputFile;
