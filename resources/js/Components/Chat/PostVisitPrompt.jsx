import { Box, Text, HStack, IconButton, Button } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import sweetAlert from '@/libs/sweetalert';

export default function PostVisitPrompt({ visit, onCompleted, onOffer }) {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating) return;
    setLoading(true);
    try {
      await axios.post(`/visits/${visit.id}/feedback`, { rating });
      sweetAlert('Merci pour votre avis!', 'success');
      if (onCompleted) onCompleted();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="surfaceSubtle" p={3} borderRadius="md" shadow="sm">
      <Text fontWeight="bold" mb={2}>Comment s\'est passée la visite&nbsp;?</Text>
      <HStack mb={3} spacing={1}>
        {[1,2,3,4,5].map(i => (
          <IconButton
            key={i}
            icon={<FaStar />}
            variant={i <= rating ? 'solid' : 'outline'}
            colorScheme="yellow"
            size="sm"
            onClick={() => setRating(i)}
            aria-label={`note ${i}`}
          />
        ))}
        <Button size="sm" ml={2} onClick={submit} isLoading={loading}>
          Envoyer
        </Button>
      </HStack>
      <Text fontWeight="bold" mb={2}>Souhaitez-vous faire une offre&nbsp;?</Text>
      <Button size="sm" colorScheme="brand" onClick={onOffer}>Faire une offre</Button>
    </Box>
  );
}
