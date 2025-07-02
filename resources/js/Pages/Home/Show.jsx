import { Box, Heading, Text, Flex, SimpleGrid, Image, Stack, IconButton, Input, Textarea, Button, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import ListingCard from '@/Components/Listing/ListingCard';
import MapPreview from '@/Components/Map/MapPreview';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';

export default function Show({ listing, similar = [] }) {
  const { auth } = usePage().props;
  const photos = listing.gallery?.map(g => g.url) || [];
  const isOwner = auth?.user?.id === listing.user_id;
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price,
    surface: listing.surface,
    rooms: listing.rooms,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    floor: listing.floor,
    total_floors: listing.total_floors,
    year_built: listing.year_built,
    heating: listing.heating,
    has_garden: listing.has_garden,
    has_terrace: listing.has_terrace,
    has_parking: listing.has_parking,
    city: listing.city,
    postal_code: listing.postal_code,
    address: listing.address,
    latitude: listing.latitude,
    longitude: listing.longitude,
    category_id: listing.category_id,
  });

  const handleContact = async () => {
    const res = await axios.post('/conversations', {
      listing_id: listing.id,
      seller_id: listing.user_id,
    });
    router.get('/messages', { conversation: res.data.id });
  };

  const update = async () => {
    await axios.put(`/listings/${listing.id}`, data);
    setEditing(false);
    router.reload({ preserveScroll: true });
  };

  const destroy = async () => {
    if (!confirm('Supprimer cette annonce ?')) return;
    await axios.delete(`/listings/${listing.id}`);
    router.get('/');
  };

  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8} align="flex-start">
        <Box flex="1">
          <Image
            src={photos[0] || '/placeholder.png'}
            alt={listing.title}
            w="full"
            h="64"
            objectFit="cover"
            rounded="md"
          />
          {isOwner && !editing && (
            <Flex justify="flex-end" mt={2} gap={2}>
              <IconButton size="sm" icon={<FaEdit />} onClick={() => setEditing(true)} aria-label="Edit" />
              <IconButton size="sm" icon={<FaTrash />} onClick={destroy} aria-label="Delete" />
            </Flex>
          )}

          {editing ? (
            <Stack spacing={3} mt={4}>
              <Flex align="center" gap={1}>
                <Input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
                <Popover placement="right">
                  <PopoverTrigger>
                    <IconButton icon={<FaInfoCircle />} size="sm" variant="ghost" />
                  </PopoverTrigger>
                  <PopoverContent p={2} fontSize="sm">Modifier ce champ soumettra l'annonce pour validation.</PopoverContent>
                </Popover>
              </Flex>
              <Flex align="center" gap={1}>
                <Input type="number" value={data.price} onChange={e => setData({ ...data, price: e.target.value })} />
                <Popover placement="right">
                  <PopoverTrigger>
                    <IconButton icon={<FaInfoCircle />} size="sm" variant="ghost" />
                  </PopoverTrigger>
                  <PopoverContent p={2} fontSize="sm">Modifier ce champ soumettra l'annonce pour validation.</PopoverContent>
                </Popover>
              </Flex>
              <Flex align="center" gap={1}>
                <Textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
                <Popover placement="right">
                  <PopoverTrigger>
                    <IconButton icon={<FaInfoCircle />} size="sm" variant="ghost" />
                  </PopoverTrigger>
                  <PopoverContent p={2} fontSize="sm">Modifier ce champ soumettra l'annonce pour validation.</PopoverContent>
                </Popover>
              </Flex>
              <Button colorScheme="brand" onClick={update}>Enregistrer</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Annuler</Button>
            </Stack>
          ) : (
            <>
              <Heading mt={4} size="lg">
                {listing.title}
              </Heading>
              <Text fontSize="xl" fontWeight="bold" mt={2}>
                {listing.price} €
              </Text>
              <Text color="gray.600" mt={1}>
                {listing.address && `${listing.address}, `}
                {listing.postal_code} {listing.city}
              </Text>
              <Text mt={4}>{listing.description}</Text>
            </>
          )}

          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} mt={4} fontSize="sm">
            <Text>Surface : {listing.surface} m²</Text>
            <Text>Pièces : {listing.rooms}</Text>
            {listing.bedrooms && <Text>Chambres : {listing.bedrooms}</Text>}
            {listing.bathrooms && <Text>Sdb : {listing.bathrooms}</Text>}
            {listing.floor && (
              <Text>
                Étage : {listing.floor}
                {listing.total_floors ? `/${listing.total_floors}` : ''}
              </Text>
            )}
            {listing.year_built && <Text>Année : {listing.year_built}</Text>}
            {listing.heating && <Text>Chauffage : {listing.heating}</Text>}
            {listing.has_terrace && <Text>Terrasse</Text>}
            {listing.has_parking && <Text>Parking</Text>}
            {listing.has_garden && <Text>Jardin</Text>}
          </SimpleGrid>

          {!isOwner && (
            <Box mt={6}>
              <button
                onClick={handleContact}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Contacter le vendeur
              </button>
            </Box>
          )}
        </Box>
        <Box w={{ base: 'full', md: '400px' }} h="full">
          <MapPreview lat={listing.latitude} lng={listing.longitude} />
        </Box>
      </Flex>

      {similar.length > 0 && (
        <Box mt={10}>
          <Heading size="md" mb={4}>
            Annonces similaires
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </>
  );
}
