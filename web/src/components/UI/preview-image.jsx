import { Image } from '@chakra-ui/react';

const PreviewImage = ({ image, ...props }) => {
  return (
    <Image
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      src={image}
      fit="cover"
      rounded="lg"
      boxSize="100px"
      alt="image placeholder"
      justifyContent="center"
      fallbackSrc="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
      {...props}
    />
  );
};

export default PreviewImage;
