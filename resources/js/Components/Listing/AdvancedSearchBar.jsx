import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Switch,
  Stack,
  useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export default function AdvancedSearchBar() {
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [surfaceRange, setSurfaceRange] = useState([0, 500]);
  const [filters, setFilters] = useState({
    terrace: false,
    parking: false,
    bedrooms: 1,
  });

  const handleSwitch = (field) => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Box bg="surface" p={4} rounded="xl" shadow="md" w="full">
      <Flex gap={4} align="center" flexWrap="wrap">
        <InputGroup maxW="200px">
          <InputLeftElement pointerEvents="none" children={<SearchIcon color={useColorModeValue('gray.400','white')} />} />
          <Input placeholder="Adresse ou ville" variant="filled" />
        </InputGroup>

        <Popover>
          <PopoverTrigger>
            <Button variant="outline" bg="surfaceSubtle">Prix</Button>
          </PopoverTrigger>
          <PopoverContent p={4}>
            <Text mb={2} fontWeight="bold">{priceRange[0].toLocaleString()} € – {priceRange[1].toLocaleString()} €</Text>
            <RangeSlider min={0} max={1000000} step={10000} defaultValue={priceRange} onChange={setPriceRange}>
              <RangeSliderTrack>
                <RangeSliderFilledTrack bg="teal.400" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger>
            <Button variant="outline" bg="surfaceSubtle">Surface</Button>
          </PopoverTrigger>
          <PopoverContent p={4}>
            <Text mb={2} fontWeight="bold">{surfaceRange[0]} m² – {surfaceRange[1]} m²</Text>
            <RangeSlider min={0} max={500} step={10} defaultValue={surfaceRange} onChange={setSurfaceRange}>
              <RangeSliderTrack>
                <RangeSliderFilledTrack bg="teal.400" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger>
            <Button variant="outline" bg="surfaceSubtle">Filtres</Button>
          </PopoverTrigger>
          <PopoverContent p={4}>
            <Stack spacing={3}>
              <Flex justify="space-between">
                <Text>Terrasse</Text>
                <Switch isChecked={filters.terrace} onChange={() => handleSwitch('terrace')} />
              </Flex>
              <Flex justify="space-between">
                <Text>Parking</Text>
                <Switch isChecked={filters.parking} onChange={() => handleSwitch('parking')} />
              </Flex>
            </Stack>
          </PopoverContent>
        </Popover>

        <Button colorScheme="blue">Rechercher</Button>
      </Flex>
    </Box>
  );
}