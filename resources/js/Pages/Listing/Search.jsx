import {
  Box,
  Heading,
  SimpleGrid,
  Flex,
  IconButton,
  Text,
  Divider,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

      <Divider orientation="vertical" display={{ base: 'none', md: 'block' }} mx={2} />

      <Box flex="1">
        <Heading size="lg" mb={6}>
          Résultats de recherche
        </Heading>
        <SimpleGrid columns={1} spacing={6}>
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </SimpleGrid>

        {lastPage > 1 && (
          <Flex mt={8} justify="center" align="center" gap={4}>
            <IconButton
              icon={<FaChevronLeft />}
              isRound
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              isDisabled={page === 1}
              aria-label="Page précédente"
            />
            <Text>
              {page} / {lastPage}
            </Text>
            <IconButton
              icon={<FaChevronRight />}
              isRound
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              isDisabled={page === lastPage}
              aria-label="Page suivante"
            />
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
