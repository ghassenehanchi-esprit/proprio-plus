import MainLayout from '@/Components/Layout/MainLayout';
import ListingCard from '@/Components/Listing/ListingCard';
import { Heading, SimpleGrid, Box } from '@chakra-ui/react';

export default function Favorites({ favorites = [] }) {
  return (
    <MainLayout>
      <Box>
        <Heading size="lg" mb={6}>Mes favoris</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {favorites.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </SimpleGrid>
      </Box>
    </MainLayout>
  );
}
