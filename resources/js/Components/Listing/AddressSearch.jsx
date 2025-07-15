import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Box, List, ListItem, Text } from '@chakra-ui/react';

export default function AddressSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          'https://nominatim.openstreetmap.org/search',
          {
            params: {
              q: query,
              format: 'json',
              countrycodes: 'fr',
              addressdetails: 1,
              limit: 5,
            },
            headers: {
              'Accept': 'application/json',
              'Accept-Language': 'fr-FR',
            },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error('Erreur OSM:', error);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setSuggestions([]);
    onSelect({
      city: item.address.city || item.address.town || item.address.village || '',
      postal_code: item.address.postcode || '',
      lat: item.lat,
      lng: item.lon,
    });
  };

  return (
    <Box position="relative" w="100%">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Adresse ou ville"
        rounded="xl"
        bg="surfaceSubtle"
      />
      {suggestions.length > 0 && (
        <List
          bg="surface"
          border="1px solid #e2e8f0"
          mt={2}
          rounded="md"
          shadow="md"
          position="absolute"
          zIndex={10}
          w="100%"
          maxH="200px"
          overflowY="auto"
        >
          {suggestions.map((item, idx) => (
            <ListItem
              key={idx}
              px={4}
              py={2}
              _hover={{ bg: 'inputBg', cursor: 'pointer' }}
              onClick={() => handleSelect(item)}
            >
              <Text fontSize="sm">{item.display_name}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}