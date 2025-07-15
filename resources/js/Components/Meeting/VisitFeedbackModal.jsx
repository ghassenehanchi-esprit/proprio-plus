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
  HStack,
  IconButton
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

export default function VisitFeedbackModal({ visit, onSubmitted }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (visit && visit.seller_confirmed_at && !visit.rating) {
      onOpen();
    }
  }, [visit]);

  const submit = async () => {
    await axios.post(`/visits/${visit.id}/feedback`, { rating, feedback: comment });
    onClose();
    setRating(0);
    setComment('');
    if (onSubmitted) onSubmitted();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Votre avis sur la visite</ModalHeader>
        <ModalBody>
          <HStack spacing={1} mb={3}>
            {[1,2,3,4,5].map(i => (
              <IconButton key={i} icon={<FaStar />} onClick={() => setRating(i)}
                colorScheme={i <= rating ? 'yellow' : 'gray'}
                variant={i <= rating ? 'solid' : 'outline'} aria-label={`note ${i}`} />
            ))}
          </HStack>
          <Textarea placeholder="Commentaire" value={comment} onChange={e => setComment(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>Annuler</Button>
          <Button colorScheme="brand" onClick={submit}>Envoyer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
