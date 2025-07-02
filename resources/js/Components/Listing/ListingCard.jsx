
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
import Slider from "react-slick";
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

    const sliderSettings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            boxShadow="sm"
            position="relative"
            transition="transform 0.2s"
            _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
            display="flex"
            flexDirection="column"
        >
            <Box position="relative">
                <Slider {...sliderSettings}>
                    {photos.map((photo, idx) => (
                        <Image
                            key={idx}
                            src={photo || "/placeholder.jpg"}
                            alt={`Photo ${idx + 1}`}
                            objectFit="cover"
                            height="220px"
                            width="100%"
                        />
                    ))}
                </Slider>
                <FavoriteButton listingId={listing.id} isFavorited={listing.is_favorited} />
            </Box>

            <Stack spacing={3} p={4} flex="1">
                <Text fontSize="xl" fontWeight="bold">{listing.title}</Text>
                <Text fontSize="md" color="gray.600">{listing.city}, {listing.postal_code}</Text>
                <Text fontSize="lg" fontWeight="bold">{listing.price} €<Text as="span" fontWeight="normal" color="gray.500"> / nuit</Text></Text>
                <Text fontSize="sm" color="gray.600">Surface : {listing.surface} m²</Text>
                <Text fontSize="sm" color="gray.600">Pièces : {listing.rooms}, Chambres : {listing.bedrooms}, Sdb : {listing.bathrooms}</Text>
                <HStack spacing={3} pt={2}>
                    {listing.has_terrace && <Text fontSize="sm" color="gray.600">Terrasse</Text>}
                    {listing.has_parking && <Text fontSize="sm" color="gray.600">Parking</Text>}
                </HStack>
            </Stack>
            <Flex px={4} pb={4} justify="flex-end">
                <Button as={Link} href={`/listings/${listing.id}`} colorScheme="brand" size="sm">
                    Voir l'annonce
                </Button>
            </Flex>
        </Box>
    );
}
