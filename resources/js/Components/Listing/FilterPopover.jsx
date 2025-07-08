import React, { useEffect, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  Button,
  VStack,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  HStack,
  IconButton,
  Box,
  Flex,
  Divider,
  Icon,
  Select,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaSlidersH, FaMinus, FaPlus } from 'react-icons/fa';

export default function FilterPopover({ searchParams, setSearchParams }) {
  const [categories, setCategories] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories);
  }, []);

  const handleSliderChange = (type, val) => {
    if (type === 'price') {
      setSearchParams(prev => ({ ...prev, min_price: val[0], max_price: val[1] }));
    } else if (type === 'surface') {
      setSearchParams(prev => ({ ...prev, min_surface: val[0], max_surface: val[1] }));
    } else if (type === 'year_built') {
      setSearchParams(prev => ({ ...prev, min_year_built: val[0], max_year_built: val[1] }));
    }
  };

  const handleCheckboxChange = e => {
    const { name, checked } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: checked }));
  };

  const increment = field => {
    setSearchParams(prev => ({ ...prev, [field]: (prev[field] || 0) + 1 }));
  };

  const decrement = field => {
    setSearchParams(prev => ({ ...prev, [field]: Math.max((prev[field] || 0) - 1, 0) }));
  };

  const content = (
    <>
      {categories.length > 0 && (
        <Box>
          <Text mb={2}>Catégorie</Text>
          <Select
            value={searchParams.category_id || ''}
            onChange={e => setSearchParams(prev => ({ ...prev, category_id: e.target.value }))}
          >
            <option value="">Toutes</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Box>
      )}

      <Box>
        <Text mb={2}>Prix (€)</Text>
        <RangeSlider
          aria-label={['min', 'max']}
          defaultValue={[0, 1000000]}
          min={0}
          max={1000000}
          step={10000}
          onChangeEnd={val => handleSliderChange('price', val)}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Flex justify="space-between" mt={1}>
          <Text>{searchParams.min_price ?? 0} €</Text>
          <Text>{searchParams.max_price ?? 1000000} €</Text>
        </Flex>
      </Box>

      <Box>
        <Text mb={2}>Surface (m²)</Text>
        <RangeSlider
          aria-label={['min', 'max']}
          defaultValue={[0, 500]}
          min={0}
          max={500}
          step={5}
          onChangeEnd={val => handleSliderChange('surface', val)}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Flex justify="space-between" mt={1}>
          <Text>{searchParams.min_surface ?? 0} m²</Text>
          <Text>{searchParams.max_surface ?? 500} m²</Text>
        </Flex>
      </Box>

      <Box>
        <Text mb={2}>Année de construction</Text>
        <RangeSlider
          aria-label={['min', 'max']}
          defaultValue={[1900, new Date().getFullYear()]}
          min={1900}
          max={new Date().getFullYear()}
          step={1}
          onChangeEnd={val => handleSliderChange('year_built', val)}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Flex justify="space-between" mt={1}>
          <Text>{searchParams.min_year_built ?? 1900}</Text>
          <Text>{searchParams.max_year_built ?? new Date().getFullYear()}</Text>
        </Flex>
      </Box>

      <Divider />

      <Flex justify="space-between" align="center">
        <Text>Nombre de pièces</Text>
        <HStack>
          <IconButton icon={<FaMinus />} size="sm" onClick={() => decrement('rooms')} />
          <Box minW="32px" textAlign="center">{searchParams.rooms ?? 0}</Box>
          <IconButton icon={<FaPlus />} size="sm" onClick={() => increment('rooms')} />
        </HStack>
      </Flex>

      <Flex justify="space-between" align="center">
        <Text>Chambres</Text>
        <HStack>
          <IconButton icon={<FaMinus />} size="sm" onClick={() => decrement('bedrooms')} />
          <Box minW="32px" textAlign="center">{searchParams.bedrooms ?? 0}</Box>
          <IconButton icon={<FaPlus />} size="sm" onClick={() => increment('bedrooms')} />
        </HStack>
      </Flex>

      <Divider />

      <VStack align="stretch">
        <Checkbox
          name="has_terrace"
          isChecked={searchParams.has_terrace}
          onChange={handleCheckboxChange}
        >
          Terrasse
        </Checkbox>
        <Checkbox
          name="has_parking"
          isChecked={searchParams.has_parking}
          onChange={handleCheckboxChange}
        >
          Parking
        </Checkbox>
        <Checkbox
          name="has_garden"
          isChecked={searchParams.has_garden}
          onChange={handleCheckboxChange}
        >
          Jardin
        </Checkbox>
      </VStack>
    </>
  );

  return (
    <>
      <Button variant="outline" leftIcon={<FaSlidersH />} onClick={onOpen}>
        Filtres
      </Button>
      {isMobile ? (
        <Drawer placement="bottom" isOpen={isOpen} onClose={onClose} size="full">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filtres avancés</DrawerHeader>
            <DrawerBody as={VStack} spacing={4} align="stretch">
              {content}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover placement="bottom-start" isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>
            <span></span>
          </PopoverTrigger>
          <PopoverContent maxW="sm" p={4}>
            <PopoverArrow />
            <PopoverHeader fontWeight="bold">Filtres avancés</PopoverHeader>
            <PopoverBody as={VStack} spacing={4} align="stretch">
              {content}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
