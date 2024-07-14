import { useDisclosure } from '@chakra-ui/react';
import { useContext, useState } from 'react';

import CustomButton from '../../components/button/custom-button';
import DeleteModal from '../../components/modal/delete-modal';
import { UserContext } from '../../context/user-context';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';

const DeleteButton = ({ courseId }) => {
  const { canAudit } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const { successNotification, errorNotification } = useNotification();

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    try {
      await server.courses.delete(courseId);
      successNotification('Course deleted successfully');
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DeleteModal isOpen={isOpen} onClose={onClose} onDelete={handleDeleteCourse} />

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
