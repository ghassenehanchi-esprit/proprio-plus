import ListingCard from '@/Components/Listing/ListingCard';
import { Heading, SimpleGrid, Box } from '@chakra-ui/react';
import { useState } from 'react';

export default function Favorites({ favorites = [] }) {
  const [items, setItems] = useState(favorites);

  const handleToggle = (id, status) => {
    if (status === 'removed') {
      setItems((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>Mes favoris</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {items.map((l) => (
          <ListingCard key={l.id} listing={l} onToggle={(status) => handleToggle(l.id, status)} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
