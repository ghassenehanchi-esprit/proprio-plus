import { useRef } from 'react';
import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';

export default function ConfirmDeleteButton({
  onConfirm,
  label = 'Supprimer',
  message = 'Êtes-vous sûr de vouloir supprimer cet élément ?',
  children,
  ...props
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <>
      <Button colorScheme="red" {...props} onClick={onOpen}>
        {children || label}
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmation</AlertDialogHeader>
            <AlertDialogBody>{message}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
