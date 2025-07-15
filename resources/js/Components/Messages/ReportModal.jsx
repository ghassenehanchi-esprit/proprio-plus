import { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import sweetAlert from '@/libs/sweetalert';

export default function ReportModal({ reportedUserId, conversationId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!reason) return;
    setLoading(true);
    try {
      await axios.post('/reports', {
        reported_user_id: reportedUserId,
        conversation_id: conversationId,
        reason,
      });
      sweetAlert('Signalement envoyé', 'success');
      setReason('');
      onClose();
    } catch (e) {
      sweetAlert(e.response?.data?.message || 'Erreur lors du signalement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="xs" variant="outline" onClick={onOpen}>
        Signaler
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Signaler cet utilisateur</ModalHeader>
          <ModalBody>
            <Textarea
              placeholder="Raison du signalement"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} variant="ghost">
              Annuler
            </Button>
            <Button colorScheme="brand" onClick={submit} isLoading={loading}>
              Envoyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
