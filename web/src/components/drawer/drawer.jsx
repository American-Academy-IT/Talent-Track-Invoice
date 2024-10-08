import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useRef } from 'react';

export const Drawer = ({ headerContent, bodyContent, footerContent, isOpen, onClose }) => {
  const btnRef = useRef();
  return (
    <ChakraDrawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{headerContent}</DrawerHeader>

        <DrawerBody>{bodyContent}</DrawerBody>

        <DrawerFooter>{footerContent}</DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  );
};
