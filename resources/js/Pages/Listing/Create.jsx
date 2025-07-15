import { useForm } from '@inertiajs/react';
import useErrorAlert from '@/hooks/useErrorAlert';
import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
  Flex,
  VStack,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import AddressSearch from '@/Components/Listing/AddressSearch';
import CategoryGrid from '@/Components/Listing/CategoryGrid';

export default function Create({ categories: initialCategories = [] }) {
  const [step, setStep] = useState(1);
  const [previews, setPreviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const stepsData = [
    { title: 'Informations', description: 'Titre et description' },
    { title: 'Détails', description: 'Caractéristiques du bien' },
    { title: 'Adresse', description: 'Localisation du bien' },
    { title: 'Médias', description: 'Photos et documents' },
  ];

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
    gallery: [],
    documents: null,
  });

  useErrorAlert(errors);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleAddressSelect = ({ city, postal_code, lat, lng }) => {
    setData((d) => ({ ...d, city, postal_code, latitude: lat, longitude: lng }));
  };

  const onDrop = useCallback(
    (accepted) => {
      const allowed = accepted.slice(0, 6 - photos.length);
      const newFiles = [...photos, ...allowed];
      setPhotos(newFiles);
      setData('gallery', newFiles);
      setPreviews(newFiles.map((f) => URL.createObjectURL(f)));
    },
    [photos]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });


  const removePhoto = (index) => {
    const newFiles = photos.filter((_, i) => i !== index);
    setPhotos(newFiles);
    setData('gallery', newFiles);
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleDocumentsChange = (e) => {
    setData('documents', e.target.files);
  };

  const submit = (e) => {
    e.preventDefault();
    post('/listings', { forceFormData: true });
  };

  return (
    <Box as="form" onSubmit={submit} maxW="4xl" mx="auto" bg="surface" p={6} rounded="md" boxShadow="md">
      <Heading size="lg" mb={4}>Créer une annonce</Heading>
      <Stepper index={step - 1} colorScheme="brand" mb={6} gap="0" size="sm">
        {stepsData.map((s, i) => (
          <Step key={s.title} onClick={() => setStep(i + 1)} cursor="pointer">
            <StepIndicator>
              <StepStatus complete={<StepNumber />} incomplete={<StepNumber />} active={<StepNumber />} />
            </StepIndicator>
            <Box flexShrink={0}>
              <StepTitle>{s.title}</StepTitle>
              <StepDescription>{s.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      {step === 1 && (
        <>
          <Image src="https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/pencil.svg" boxSize="60px" mx="auto" mb={4} alt="informations" />
          <Alert status="info" rounded="md" mb={4}>
            <AlertIcon />
            <Text fontSize="sm">Le titre est obligatoire (255 caractères max) et la description doit présenter clairement votre bien.</Text>
          </Alert>
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
            <CategoryGrid
              categories={categories}
              value={data.category_id}
              onChange={(id) => setData('category_id', id)}
            />
            <FormErrorMessage>{errors.category_id}</FormErrorMessage>
          </FormControl>
        </VStack>
        </>
      )}

      {step === 2 && (
        <>
        <Image src="https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/adjustments.svg" boxSize="60px" mx="auto" mb={4} alt="details" />
        <Alert status="info" rounded="md" mb={4}>
          <AlertIcon />
          <Text fontSize="sm">Les champs prix, surface et pièces sont obligatoires. Utilisez uniquement des valeurs numériques positives.</Text>
        </Alert>
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
        </>
      )}

      {step === 3 && (
        <>
        <Image src="https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/map-pin.svg" boxSize="60px" mx="auto" mb={4} alt="adresse" />
        <Alert status="info" rounded="md" mb={4}>
          <AlertIcon />
          <Text fontSize="sm">Ville et code postal sont requis pour localiser votre bien.</Text>
        </Alert>
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
        </>
      )}

      {step === 4 && (
        <>
        <Image src="https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/photo.svg" boxSize="60px" mx="auto" mb={4} alt="media" />
        <Alert status="info" rounded="md" mb={4}>
          <AlertIcon />
          <Text fontSize="sm">Ajoutez des photos attractives (JPG/PNG, 4 Mo max). Vous pouvez joindre des documents au format PDF ou image.</Text>
        </Alert>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={errors.gallery}>
            <FormLabel>Photos</FormLabel>
            <Box
              {...getRootProps()}
              p={6}
              border="2px dashed"
              borderColor={isDragActive ? 'brand.500' : 'gray.300'}
              rounded="md"
              textAlign="center"
              cursor="pointer"
            >
              <input {...getInputProps()} />
              <Text>Glissez-déposez des images ou cliquez pour sélectionner</Text>
              <Text fontSize="sm" color="gray.500">{`${photos.length}/6 ajoutées`}</Text>
            </Box>

            <FormErrorMessage>{errors.gallery}</FormErrorMessage>
          </FormControl>
          {previews.length > 0 && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              {previews.map((src, i) => (
                <Box key={i} position="relative">
                  <Image src={src} alt="preview" objectFit="cover" h="100px" rounded="md" w="100%" />
                  <Button size="xs" colorScheme="red" position="absolute" top="2px" right="2px" onClick={() => removePhoto(i)}>X</Button>
                </Box>
              ))}
            </SimpleGrid>
          )}
          <FormControl isInvalid={errors.documents}>
            <FormLabel>Documents</FormLabel>
            <Input type="file" multiple onChange={handleDocumentsChange} />
            <FormErrorMessage>{errors.documents}</FormErrorMessage>
          </FormControl>
        </VStack>
        </>
      )}

      <Flex justify="space-between" mt={6}>
        {step > 1 && <Button onClick={back}>Précédent</Button>}
        {step < 4 && <Button onClick={next}>Suivant</Button>}
        {step === 4 && <Button type="submit" isLoading={processing}>Publier</Button>}
      </Flex>
    </Box>
  );
}
