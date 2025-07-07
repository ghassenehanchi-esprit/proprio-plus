import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Flex,
  Text,
} from '@chakra-ui/react';
import AdminLayout from '@/Components/Admin/AdminLayout';

export default function Index({ stats = {}, listingStatus = {} }) {
  const max = Math.max(...Object.values(listingStatus), 0);
  return (
    <Box>
      <Heading size="lg" mb={6}>Tableau de bord</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
        <Stat>
          <StatLabel>Utilisateurs</StatLabel>
          <StatNumber>{stats.users}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Annonces</StatLabel>
          <StatNumber>{stats.listings}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Annonces actives</StatLabel>
          <StatNumber>{stats.active_listings}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Signalements</StatLabel>
          <StatNumber>{stats.reports}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Signalements en attente</StatLabel>
          <StatNumber>{stats.pending_reports}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pages</StatLabel>
          <StatNumber>{stats.pages}</StatNumber>
        </Stat>
      </SimpleGrid>
      <Box>
        <Heading size="md" mb={4}>Annonces par statut</Heading>
        <Flex align="flex-end" gap={4} h="200px">
          {Object.entries(listingStatus).map(([status, count]) => (
            <Box key={status} textAlign="center" flex="1">
              <Box bg="brand.600" h={`${max ? (count / max) * 100 : 0}%`} minH="4" />
              <Text fontSize="sm" mt={1}>{status}</Text>
              <Text fontSize="sm">{count}</Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
