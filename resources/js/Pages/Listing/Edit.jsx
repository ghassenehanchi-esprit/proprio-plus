import React from 'react';
import { useForm } from '@inertiajs/react';
import useErrorAlert from '@/hooks/useErrorAlert';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Checkbox,
  SimpleGrid,
  Heading,
  VStack,
  Flex,
  Image,
  Link,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import AddressSearch from '@/Components/Listing/AddressSearch';
import CategoryGrid from '@/Components/Listing/CategoryGrid';

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
    gallery: null,
    documents: null,
  });

  useErrorAlert(errors);

  const [categories, setCategories] = useState(initialCategories);
  const [existingPhotos, setExistingPhotos] = useState(listing.gallery || []);
  const [existingDocs, setExistingDocs] = useState(listing.documents || []);

  useEffect(() => {
    if (initialCategories.length === 0) {
      axios.get('/api/categories').then(r => setCategories(r.data));
    }
  }, []);

  const handleAddressSelect = ({ city, postal_code, lat, lng }) => {
    setData(data => ({ ...data, city, postal_code, latitude: lat, longitude: lng }));
  };

  const handleGalleryChange = e => {
    setData('gallery', e.target.files);
  };

  const handleDocumentsChange = e => {
    setData('documents', e.target.files);
  };

  const deletePhoto = async id => {
    try {
      await axios.delete(`/files/${id}`);
      setExistingPhotos(photos => photos.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDoc = async id => {
    try {
      await axios.delete(`/files/${id}`);
      setExistingDocs(docs => docs.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const submit = e => {
    e.preventDefault();
    put(`/listings/${listing.id}`, { forceFormData: true });
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
          <CategoryGrid
            categories={categories}
            value={data.category_id}
            onChange={id => setData('category_id', id)}
          />
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
        {existingPhotos.length > 0 && (
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={2}>
            {existingPhotos.map(photo => (
              <Box key={photo.id} position="relative">
                <Image src={photo.url} alt="photo" objectFit="cover" h="100px" rounded="md" w="100%" />
                <Button size="xs" colorScheme="red" position="absolute" top="2px" right="2px" onClick={() => deletePhoto(photo.id)}>X</Button>
              </Box>
            ))}
          </SimpleGrid>
        )}
        <FormControl isInvalid={errors.gallery} mt={4}>
          <FormLabel>Photos</FormLabel>
          <Input type="file" multiple onChange={handleGalleryChange} />
          <FormErrorMessage>{errors.gallery}</FormErrorMessage>
        </FormControl>

        {existingDocs.length > 0 && (
          <VStack align="start" spacing={2} mt={4}>
            {existingDocs.map(doc => (
              <Flex key={doc.id} align="center">
                <Link href={doc.url} isExternal mr={2}>{doc.path.split('/').pop()}</Link>
                <Button size="xs" colorScheme="red" onClick={() => deleteDoc(doc.id)}>Supprimer</Button>
              </Flex>
            ))}
          </VStack>
        )}
        <FormControl isInvalid={errors.documents} mt={4}>
          <FormLabel>Documents</FormLabel>
          <Input type="file" multiple onChange={handleDocumentsChange} />
          <FormErrorMessage>{errors.documents}</FormErrorMessage>
        </FormControl>
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
