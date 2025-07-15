import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';

export default function VisitSellerConfirmModal({ visit, onConfirmed }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!visit) return;
    if (visit.buyer_confirmed_at && !visit.seller_confirmed_at) {
      onOpen();
    }
  }, [visit]);

  const confirm = async () => {
    await axios.post(`/visits/${visit.id}/confirm`, { comment });
    onClose();
    setComment('');
    if (onConfirmed) onConfirmed();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmer la visite</ModalHeader>
        <ModalBody>
          <Text>Validez la visite effectuée le {new Date(visit.visit_datetime).toLocaleString()}.</Text>
          <Textarea mt={4} placeholder="Commentaire" value={comment} onChange={e => setComment(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>Annuler</Button>
          <Button colorScheme="brand" onClick={confirm}>Confirmer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
