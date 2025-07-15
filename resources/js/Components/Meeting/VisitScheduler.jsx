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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

export default function VisitScheduler({ conversationId, onScheduled, disabled }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [date, setDate] = useState(new Date());
  const [agenda, setAgenda] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await axios.post(`/conversations/${conversationId}/meetings`, {
        scheduled_at: date.toISOString(),
        type: 'visit',
        agenda,
      });
      onClose();
      setAgenda('');
      if (onScheduled) onScheduled();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={onOpen} colorScheme="brand" isDisabled={disabled}>
        Proposer une visite
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Proposer une visite</ModalHeader>
          <ModalBody>
            <DatePicker
              selected={date}
              onChange={setDate}
              showTimeSelect
              dateFormat="Pp"
              className="chakra-input"
            />
            <Textarea
              mt={4}
              placeholder="Détails ou agenda"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
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
