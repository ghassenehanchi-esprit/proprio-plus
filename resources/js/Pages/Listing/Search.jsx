import { Box, Heading, SimpleGrid, Flex, Button, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { route } from "ziggy-js";
import ListingCard from "@/Components/Listing/ListingCard";
import ResponsiveFilters from "@/Components/Listing/ResponsiveFilters";

export default function Search({ filters = {} }) {
  const [searchParams, setSearchParams] = useState(filters);
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchListings = async () => {
    const { data } = await axios.get(route('listings.index'), {
      params: { ...searchParams, page },
    });
    setListings(data.data);
    setLastPage(data.last_page || 1);
  };

  useEffect(() => {
    fetchListings();
  }, [searchParams, page]);

  const handleSearch = () => {
    setPage(1);
    fetchListings();
  };

  return (
    <Flex gap={6} align="flex-start" direction={{ base: 'column', md: 'row' }}>
      <ResponsiveFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onSearch={handleSearch}
      />
      <Box flex="1">
        <Heading size="lg" mb={6}>Résultats de recherche</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </SimpleGrid>
        <Flex mt={4} justify="space-between" align="center">
          <Button onClick={() => setPage(p => Math.max(1, p - 1))} isDisabled={page === 1}>Précédent</Button>
          <Text>{page} / {lastPage}</Text>
          <Button onClick={() => setPage(p => Math.min(lastPage, p + 1))} isDisabled={page === lastPage}>Suivant</Button>
        </Flex>
      </Box>
    </Flex>
  );
}
