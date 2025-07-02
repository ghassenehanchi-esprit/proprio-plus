import { Box, Heading, Text, Flex, SimpleGrid, Image, Stack } from '@chakra-ui/react';
import MainLayout from '@/Components/Layout/MainLayout';
import ListingCard from '@/Components/Listing/ListingCard';
import MapPreview from '@/Components/Map/MapPreview';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function Show({ listing, similar = [] }) {
  const photos = listing.gallery?.map(g => g.url) || [];

  const handleContact = async () => {
    const res = await axios.post('/conversations', {
      listing_id: listing.id,
      seller_id: listing.user_id,
    });
    router.get('/messages', { conversation: res.data.id });
  };

  return (
    <MainLayout>
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

          <Box mt={6}>
            <button
              onClick={handleContact}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Contacter le vendeur
            </button>
          </Box>
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
    </MainLayout>
  );
}
