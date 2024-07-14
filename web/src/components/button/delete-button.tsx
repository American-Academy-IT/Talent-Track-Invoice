import { useDisclosure } from '@chakra-ui/react';
import { useContext, useState } from 'react';

import { UserContext } from '../../context/user-context';
import useNotification from '../../hooks/use-notification';
import DeleteModal from '../modal/delete-modal';
import CustomButton from './custom-button';

interface Props {
  onConfirm: () => Promise<{ message: string }>;
}

const DeleteButton = ({ onConfirm }: Props) => {
  const { canAudit } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const { successNotification, errorNotification } = useNotification();

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await onConfirm();
      successNotification(res.message || 'Item deleted successfully');
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DeleteModal isOpen={isOpen} onClose={onClose} onDelete={handleConfirmDelete} />

      <CustomButton
        name="Delete"
        size="xs"
        variant="outline"
        colorScheme="red"
        isLoading={isDeleting}
        onClick={onOpen}
        isDisabled={!canAudit}
      />
    </>
  );
};

export default DeleteButton;
