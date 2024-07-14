import { Button, ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
  name: string;
}

const CustomButton = ({ name, ...props }: Props) => {
  return <Button {...props}>{name}</Button>;
};

export default CustomButton;
