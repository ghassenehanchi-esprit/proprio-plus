import { Box, Heading, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Visits() {
  const [buyerVisits, setBuyerVisits] = useState([]);
  const [sellerVisits, setSellerVisits] = useState([]);

  const load = async () => {
    const { data } = await axios.get('/visits');
    setBuyerVisits(data.as_buyer);
    setSellerVisits(data.as_seller);
  };

  useEffect(() => { load(); }, []);

  const VisitItem = ({ visit, showUser }) => (
    <Box p={2} borderWidth="1px" rounded="md">
      <Text fontWeight="bold">{visit.listing.title}</Text>
      <Text>{new Date(visit.visit_datetime).toLocaleString()}</Text>
      {showUser && visit.user && (
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'white')}>
          Pour: {visit.user.first_name} {visit.user.last_name}
        </Text>
      )}
      {visit.listing.address && (
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'white')}>
          {visit.listing.address}
        </Text>
      )}
    </Box>
  );

  return (
    <Box p={8} maxW="3xl" mx="auto" bg="surface" rounded="md" shadow="md">
      <Heading size="md" mb={4}>Mes visites prévues</Heading>
      <VStack align="stretch" spacing={2} mb={8} maxH="300px" overflowY="auto">
        {buyerVisits.map(v => (
          <VisitItem key={v.id} visit={v} />
        ))}
        {buyerVisits.length === 0 && <Text>Aucune visite prévue.</Text>}
      </VStack>
      <Heading size="md" mb={4}>Visites de mes annonces</Heading>
      <VStack align="stretch" spacing={2} maxH="300px" overflowY="auto">
        {sellerVisits.map(v => (
          <VisitItem key={v.id} visit={v} showUser />
        ))}
        {sellerVisits.length === 0 && <Text>Aucune visite prévue.</Text>}
      </VStack>
    </Box>
  );
}
