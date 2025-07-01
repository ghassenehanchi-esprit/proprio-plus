import { Box, Heading, SimpleGrid, Flex } from "@chakra-ui/react";
import MainLayout from "@/Components/Layout/MainLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import ListingCard from "@/Components/Listing/ListingCard";
import FilterSidebar from "@/Components/Listing/FilterSidebar";

export default function Search({ listings = [], filters = {} }) {
  const [searchParams, setSearchParams] = useState(filters);

  const handleSearch = () => {
    router.visit(route('listings.search'), {
      method: 'get',
      data: searchParams,
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <MainLayout>
    <Flex gap={6} align="flex-start">
      <Box w={{ base: '100%', md: '300px' }}>
        <FilterSidebar
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onSearch={handleSearch}
        />
      </Box>
      <Box flex="1">
        <Heading size="lg" mb={6}>Résultats de recherche</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
    </MainLayout>
  );
}
