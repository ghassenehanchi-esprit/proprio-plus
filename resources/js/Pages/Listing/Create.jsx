import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
  Flex,
  VStack,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Progress,
} from '@chakra-ui/react';
import AddressSearch from '@/Components/Listing/AddressSearch';

export default function Create({ categories: initialCategories = [] }) {
  const [step, setStep] = useState(1);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    if (initialCategories.length === 0) {
      axios.get('/api/categories').then((r) => setCategories(r.data));
    }
  }, []);

  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    category_id: '',
    price: '',
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    total_floors: '',
    year_built: '',
    heating: '',
    has_garden: false,
    has_terrace: false,
    has_parking: false,
    city: '',
    postal_code: '',
    address: '',
    latitude: '',
    longitude: '',
    gallery: null,
    documents: null,
  });

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleAddressSelect = ({ city, postal_code, lat, lng }) => {
    setData((d) => ({ ...d, city, postal_code, latitude: lat, longitude: lng }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setData('gallery', e.target.files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleDocumentsChange = (e) => {
    setData('documents', e.target.files);
  };

  const submit = (e) => {
    e.preventDefault();
    post('/listings', { forceFormData: true });
  };

  return (
    <Box as="form" onSubmit={submit} maxW="4xl" mx="auto" bg="white" p={6} rounded="md" boxShadow="md">
      <Heading size="lg" mb={4}>Créer une annonce</Heading>
      <Flex align="center" mb={6} gap={4}>
        <Text fontWeight="bold">Étape {step} / 4</Text>
        <Progress value={(step / 4) * 100} flex="1" size="sm" colorScheme="brand" rounded="md" />
      </Flex>
      {step === 1 && (
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={errors.title}>
            <FormLabel>Titre</FormLabel>
            <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
            <FormErrorMessage>{errors.title}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.category_id}>
            <FormLabel>Catégorie</FormLabel>
            <Select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>
              <option value="">Sélectionner</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors.category_id}</FormErrorMessage>
          </FormControl>
        </VStack>
      )}

      {step === 2 && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isInvalid={errors.price}>
            <FormLabel>Prix</FormLabel>
            <Input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} />
            <FormErrorMessage>{errors.price}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.surface}>
            <FormLabel>Surface (m²)</FormLabel>
            <Input type="number" value={data.surface} onChange={(e) => setData('surface', e.target.value)} />
            <FormErrorMessage>{errors.surface}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.rooms}>
            <FormLabel>Pièces</FormLabel>
            <Input type="number" value={data.rooms} onChange={(e) => setData('rooms', e.target.value)} />
            <FormErrorMessage>{errors.rooms}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>Chambres</FormLabel>
            <Input type="number" value={data.bedrooms} onChange={(e) => setData('bedrooms', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Salles de bain</FormLabel>
            <Input type="number" value={data.bathrooms} onChange={(e) => setData('bathrooms', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Étage</FormLabel>
            <Input type="number" value={data.floor} onChange={(e) => setData('floor', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Étages totaux</FormLabel>
            <Input type="number" value={data.total_floors} onChange={(e) => setData('total_floors', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Année de construction</FormLabel>
            <Input type="number" value={data.year_built} onChange={(e) => setData('year_built', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Chauffage</FormLabel>
            <Input value={data.heating} onChange={(e) => setData('heating', e.target.value)} />
          </FormControl>
          <Flex gap={4} pt={2}>
            <Checkbox isChecked={data.has_garden} onChange={(e) => setData('has_garden', e.target.checked)}>Jardin</Checkbox>
            <Checkbox isChecked={data.has_terrace} onChange={(e) => setData('has_terrace', e.target.checked)}>Terrasse</Checkbox>
            <Checkbox isChecked={data.has_parking} onChange={(e) => setData('has_parking', e.target.checked)}>Parking</Checkbox>
          </Flex>
        </SimpleGrid>
      )}

      {step === 3 && (
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={errors.address}>
            <FormLabel>Adresse</FormLabel>
            <Input value={data.address} onChange={(e) => setData('address', e.target.value)} />
            <FormErrorMessage>{errors.address}</FormErrorMessage>
          </FormControl>
          <AddressSearch onSelect={handleAddressSelect} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isInvalid={errors.city}>
              <FormLabel>Ville</FormLabel>
              <Input value={data.city} onChange={(e) => setData('city', e.target.value)} />
              <FormErrorMessage>{errors.city}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.postal_code}>
              <FormLabel>Code postal</FormLabel>
              <Input value={data.postal_code} onChange={(e) => setData('postal_code', e.target.value)} />
              <FormErrorMessage>{errors.postal_code}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </VStack>
      )}

      {step === 4 && (
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={errors.gallery}>
            <FormLabel>Photos</FormLabel>
            <Input type="file" multiple onChange={handleGalleryChange} />
            <FormErrorMessage>{errors.gallery}</FormErrorMessage>
          </FormControl>
          {previews.length > 0 && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              {previews.map((src, i) => (
                <Image key={i} src={src} alt="preview" objectFit="cover" h="100px" rounded="md" />
              ))}
            </SimpleGrid>
          )}
          <FormControl isInvalid={errors.documents}>
            <FormLabel>Documents</FormLabel>
            <Input type="file" multiple onChange={handleDocumentsChange} />
            <FormErrorMessage>{errors.documents}</FormErrorMessage>
          </FormControl>
        </VStack>
      )}

      <Flex justify="space-between" mt={6}>
        {step > 1 && <Button onClick={back}>Précédent</Button>}
        {step < 4 && <Button onClick={next}>Suivant</Button>}
        {step === 4 && <Button type="submit" isLoading={processing}>Publier</Button>}
      </Flex>
    </Box>
  );
}
