import { Box, Text, Button, HStack, Icon } from '@chakra-ui/react';
import { FaCalendarCheck } from 'react-icons/fa';

export default function VisitConfirmedCard({ visit }) {
  return (
    <Box bg="surfaceSubtle" p={3} borderRadius="md" shadow="sm">
      <HStack justify="space-between" mb={2}>
        <HStack>
          <Icon as={FaCalendarCheck} color="brand.500" />
          <Text fontWeight="bold">Visite confirmée</Text>
        </HStack>
        <Button size="sm" variant="outline">Voir / Modifier</Button>
      </HStack>
      <Text fontSize="sm">{new Date(visit.visit_datetime).toLocaleString()}</Text>
      {visit.listing?.address && (
        <Text fontSize="sm">{visit.listing.address}</Text>
      )}
    </Box>
  );
}
