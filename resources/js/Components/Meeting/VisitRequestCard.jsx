import { Box, VStack, Text, HStack, Divider, Icon, Button } from '@chakra-ui/react';
import { FaCalendar, FaMapMarkerAlt, FaUser, FaClock, FaStickyNote } from 'react-icons/fa';

export default function VisitRequestCard({ meeting, listing, seller, onRespond, isBuyer }) {
  const details = [
    {
      label: 'Date proposée',
      icon: FaCalendar,
      value: new Date(meeting.scheduled_at).toLocaleString(),
    },
    {
      label: 'Adresse',
      icon: FaMapMarkerAlt,
      value: listing.address,
    },
    {
      label: 'Agent',
      icon: FaUser,
      value: seller.first_name + ' ' + seller.last_name,
    },
    {
      label: 'Durée estimée',
      icon: FaClock,
      value: '30 minutes',
    },
  ];
  if (meeting.agenda) {
    details.push({ label: 'Notes supplémentaires', icon: FaStickyNote, value: meeting.agenda });
  }

  return (
    <Box bg="surfaceSubtle" p={5} borderRadius="lg" w="full">
      <VStack align="stretch" spacing={4} divider={<Divider />}>
        <Box>
          <Text fontWeight="semibold" fontSize="lg">Proposition de Visite</Text>
          <Text fontSize="sm" color="gray.600">
            Je vous propose une visite pour le bien {listing.title} à l'adresse {listing.address} selon les préférences que vous avez partagées.
          </Text>
        </Box>
        <VStack align="stretch" spacing={3} divider={<Divider />}> 
          {details.map((d) => (
            <HStack key={d.label} justify="space-between" align="start">
              <HStack spacing={2} minW="150px">
                <Icon as={d.icon} color="gray.500" />
                <Text fontWeight="medium">{d.label}</Text>
              </HStack>
              <Text textAlign="right" flex="1">{d.value}</Text>
            </HStack>
          ))}
        </VStack>
        {meeting.status === 'pending' && isBuyer && (
          <HStack justify="flex-end" pt={2} spacing={2}>
            <Button size="sm" colorScheme="brand" onClick={() => onRespond('accepted')}>Accepter</Button>
            <Button size="sm" variant="outline" onClick={() => onRespond('declined')}>Refuser</Button>
          </HStack>
        )}
        {meeting.status !== 'pending' && (
          <Text fontSize="sm" color="gray.600" alignSelf="flex-end">{meeting.status}</Text>
        )}
      </VStack>
    </Box>
  );
}
