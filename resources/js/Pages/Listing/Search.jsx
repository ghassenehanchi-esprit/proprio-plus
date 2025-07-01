import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import ListingCard from "@/Components/Listing/ListingCard";

export default function Search({ listings = [] }) {
  return (
    <Box>
      <Heading size="lg" mb={6}>Résultats de recherche</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
