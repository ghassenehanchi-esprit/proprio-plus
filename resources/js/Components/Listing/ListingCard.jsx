
import {
    Box,
    Text,
    Stack,
    Flex,
    HStack,
    Image,
    IconButton,
    Button,
} from "@chakra-ui/react";
import { Link } from "@inertiajs/react";
import {FaHeart, FaRegHeart, FaStar} from "react-icons/fa";
import {useState} from "react";
function FavoriteButton({ listingId, isFavorited }) {
    const [favorited, setFavorited] = useState(isFavorited);

    const toggleFavorite = async () => {
        try {
            const response = await axios.post(`/listings/${listingId}/favorite`);
            setFavorited(response.data.status === 'added');
        } catch (error) {
            console.error('Erreur lors du toggle favori', error);
        }
    };

    return (
        <IconButton
            icon={favorited ? <FaHeart color="red" /> : <FaRegHeart />}
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            aria-label="Ajouter aux favoris"
            position="absolute"
            top={2}
            right={2}
            zIndex={1}
        />
    );
}
export default function ListingCard({ listing }) {
    const photos = Array.isArray(listing.photos)
        ? listing.photos
        : JSON.parse(listing.photos || '[]');

    return (
        <Box
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            boxShadow="md"
            position="relative"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.01)" }}
        >
            <Flex overflowX="auto" gap={2}>
                {photos.map((photo, idx) => (
                    <Image
                        key={idx}
                        src={photo || "/placeholder.jpg"}
                        alt={`Photo ${idx + 1}`}
                        objectFit="cover"
                        height="180px"
                        minW="300px"
                        borderRadius="md"
                    />
                ))}
            </Flex>

            <Box p={4} pb={6}>
                <Stack spacing={1}>
                    <Text fontSize="lg" fontWeight="bold">{listing.title}</Text>
                    <Text fontSize="sm" color="gray.600">{listing.city}, {listing.postal_code}</Text>
                    <Text fontSize="md" fontWeight="bold">{listing.price} €<Text as="span" fontWeight="normal" color="gray.500"> par nuit</Text></Text>
                    <Text fontSize="sm" color="gray.600">Surface: {listing.surface} m²</Text>
                    <Text fontSize="sm" color="gray.600">Pièces: {listing.rooms}, Chambres: {listing.bedrooms}, Sdb: {listing.bathrooms}</Text>
                    <HStack spacing={2} mt={2}>
                        {listing.has_terrace && <Text fontSize="xs" color="gray.600">Terrasse</Text>}
                        {listing.has_parking && <Text fontSize="xs" color="gray.600">Parking</Text>}
                    </HStack>
                </Stack>
            </Box>
            <Box px={4} pb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Button as={Link} href={`/listings/${listing.id}`} colorScheme="brand" size="sm">Voir l'annonce</Button>
                <FavoriteButton listingId={listing.id} isFavorited={listing.is_favorited} />
            </Box>
        </Box>
    );
}
