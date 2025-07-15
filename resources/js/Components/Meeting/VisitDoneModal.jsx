import { useEffect } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';

export default function VisitDoneModal({ visit, onConfirmed }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!visit) return;
    const visitTime = new Date(visit.visit_datetime);
    if (!visit.buyer_confirmed_at && Date.now() >= visitTime.getTime()) {
      onOpen();
    }
  }, [visit]);

  const confirm = async () => {
    await axios.post(`/visits/${visit.id}/done`);
    onClose();
    if (onConfirmed) onConfirmed();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmer la visite</ModalHeader>
        <ModalBody>
          <Text>Confirmez-vous avoir effectué la visite du {new Date(visit.visit_datetime).toLocaleString()} ?</Text>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>Annuler</Button>
          <Button colorScheme="brand" onClick={confirm}>Confirmer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
