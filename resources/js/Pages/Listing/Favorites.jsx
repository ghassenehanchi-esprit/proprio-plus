import ListingCard from '@/Components/Listing/ListingCard';
import { Heading, SimpleGrid, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
        <AnimatePresence initial={false}>
          {items.map((l) => (
            <motion.div
              key={l.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ListingCard listing={l} onToggle={(status) => handleToggle(l.id, status)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </SimpleGrid>
    </Box>
  );
}
