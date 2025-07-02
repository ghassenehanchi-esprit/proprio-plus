import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Checkbox,
  SimpleGrid,
  Heading,
  VStack,
  Flex,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import AddressSearch from '@/Components/Listing/AddressSearch';

export default function Edit({ listing, categories: initialCategories = [] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const { data, setData, put, processing, errors, delete: destroy } = useForm({
    title: listing.title || '',
    description: listing.description || '',
    category_id: listing.category_id || '',
    price: listing.price || '',
    surface: listing.surface || '',
    rooms: listing.rooms || '',
    bedrooms: listing.bedrooms || '',
    bathrooms: listing.bathrooms || '',
    floor: listing.floor || '',
    total_floors: listing.total_floors || '',
    year_built: listing.year_built || '',
    heating: listing.heating || '',
    has_garden: listing.has_garden,
    has_terrace: listing.has_terrace,
    has_parking: listing.has_parking,
    city: listing.city || '',
    postal_code: listing.postal_code || '',
    address: listing.address || '',
    latitude: listing.latitude || '',
    longitude: listing.longitude || '',
  });

  const [categories, setCategories] = React.useState(initialCategories);

  useEffect(() => {
    if (initialCategories.length === 0) {
      axios.get('/api/categories').then(r => setCategories(r.data));
    }
  }, []);

  const handleAddressSelect = ({ city, postal_code, lat, lng }) => {
    setData(data => ({ ...data, city, postal_code, latitude: lat, longitude: lng }));
  };

  const submit = e => {
    e.preventDefault();
    put(`/listings/${listing.id}`);
  };

  const remove = () => {
    destroy(`/listings/${listing.id}`, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Box as="form" onSubmit={submit} maxW="4xl" mx="auto" bg="white" p={6} rounded="md" boxShadow="md">
      <Heading size="lg" mb={4}>Modifier l'annonce</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={errors.title}>
          <FormLabel>Titre</FormLabel>
          <Input value={data.title} onChange={e => setData('title', e.target.value)} />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea value={data.description} onChange={e => setData('description', e.target.value)} />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.category_id}>
          <FormLabel>Catégorie</FormLabel>
          <Select value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
            <option value="">Sélectionner</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <FormErrorMessage>{errors.category_id}</FormErrorMessage>
        </FormControl>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
        <FormControl isInvalid={errors.price}>
          <FormLabel>Prix</FormLabel>
          <Input type="number" value={data.price} onChange={e => setData('price', e.target.value)} />
          <FormErrorMessage>{errors.price}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.surface}>
          <FormLabel>Surface (m²)</FormLabel>
          <Input type="number" value={data.surface} onChange={e => setData('surface', e.target.value)} />
          <FormErrorMessage>{errors.surface}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.rooms}>
          <FormLabel>Pièces</FormLabel>
          <Input type="number" value={data.rooms} onChange={e => setData('rooms', e.target.value)} />
          <FormErrorMessage>{errors.rooms}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Chambres</FormLabel>
          <Input type="number" value={data.bedrooms} onChange={e => setData('bedrooms', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Salles de bain</FormLabel>
          <Input type="number" value={data.bathrooms} onChange={e => setData('bathrooms', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Étage</FormLabel>
          <Input type="number" value={data.floor} onChange={e => setData('floor', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Étages totaux</FormLabel>
          <Input type="number" value={data.total_floors} onChange={e => setData('total_floors', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Année de construction</FormLabel>
          <Input type="number" value={data.year_built} onChange={e => setData('year_built', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Chauffage</FormLabel>
          <Input value={data.heating} onChange={e => setData('heating', e.target.value)} />
        </FormControl>
        <Flex gap={4} pt={2} alignItems="center">
          <Checkbox isChecked={data.has_garden} onChange={e => setData('has_garden', e.target.checked)}>Jardin</Checkbox>
          <Checkbox isChecked={data.has_terrace} onChange={e => setData('has_terrace', e.target.checked)}>Terrasse</Checkbox>
          <Checkbox isChecked={data.has_parking} onChange={e => setData('has_parking', e.target.checked)}>Parking</Checkbox>
        </Flex>
      </SimpleGrid>

      <VStack spacing={4} align="stretch" mt={4}>
        <FormControl isInvalid={errors.address}>
          <FormLabel>Adresse</FormLabel>
          <Input value={data.address} onChange={e => setData('address', e.target.value)} />
          <FormErrorMessage>{errors.address}</FormErrorMessage>
        </FormControl>
        <AddressSearch onSelect={handleAddressSelect} />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isInvalid={errors.city}>
            <FormLabel>Ville</FormLabel>
            <Input value={data.city} onChange={e => setData('city', e.target.value)} />
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.postal_code}>
            <FormLabel>Code postal</FormLabel>
            <Input value={data.postal_code} onChange={e => setData('postal_code', e.target.value)} />
            <FormErrorMessage>{errors.postal_code}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </VStack>

      <Flex justify="space-between" mt={6}>
        <Button colorScheme="brand" type="submit" isLoading={processing}>Enregistrer</Button>
        <Button colorScheme="red" variant="outline" onClick={onOpen}>Supprimer</Button>
      </Flex>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Supprimer l'annonce</AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est définitive.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Annuler</Button>
              <Button colorScheme="red" onClick={remove} ml={3} isLoading={processing}>Supprimer</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
