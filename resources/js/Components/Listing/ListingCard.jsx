
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
import axios from 'axios';
import { motion } from 'framer-motion';

const MotionIconButton = motion(IconButton);
function FavoriteButton({ listingId, isFavorited, onToggle }) {
    const [favorited, setFavorited] = useState(isFavorited);

    const toggleFavorite = async () => {
        const optimistic = !favorited;
        setFavorited(optimistic);
        try {
            let response;
            if (favorited) {
                response = await axios.delete(`/favorites/${listingId}`);
            } else {
                response = await axios.post(`/favorites/${listingId}`);
            }
            const newStatus = response.data.status;
            setFavorited(newStatus === 'added');
            if (onToggle) {
                onToggle(newStatus);
            }
        } catch (error) {
            setFavorited(!optimistic);
            console.error('Erreur lors du toggle favori', error);
        }
    };

    return (
        <MotionIconButton
            whileTap={{ scale: 0.9 }}
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
export default function ListingCard({ listing, onToggle, size = 'md' }) {
    const isSmall = size === 'sm';
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
        <Flex
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="surface"
            boxShadow="sm"
            position="relative"
            transition="transform 0.2s"
            _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
            direction={{ base: 'column', md: isSmall ? 'column' : 'row' }}
            maxW={isSmall ? '350px' : 'full'}
            w="full"
        >
            <Box position="relative" w={{ base: '100%', md: isSmall ? '100%' : '40%' }}>
                <Slider {...sliderSettings}>
                    {photos.map((photo, idx) => (
                        <Image
                            key={idx}
                            src={photo || "/placeholder.jpg"}
                            alt={`Photo ${idx + 1}`}
                            objectFit="cover"
                            height={isSmall ? '150px' : '220px'}
                            width="100%"
                        />
                    ))}
                </Slider>
                <FavoriteButton listingId={listing.id} isFavorited={listing.is_favorited} onToggle={onToggle} />
            </Box>

            <Flex direction="column" flex="1">
                <Stack spacing={isSmall ? 2 : 3} p={isSmall ? 2 : 4} flex="1">
                    <Text fontSize={isSmall ? 'md' : 'xl'} fontWeight="bold">{listing.title}</Text>
                    <Text fontSize={isSmall ? 'sm' : 'md'} color="gray.600">{listing.city}, {listing.postal_code}</Text>
                    <Text fontSize={isSmall ? 'md' : 'lg'} fontWeight="bold">{listing.price} €</Text>
                    <Text fontSize="sm" color="gray.600">Surface : {listing.surface} m²</Text>
                    <Text fontSize="sm" color="gray.600">Pièces : {listing.rooms}, Chambres : {listing.bedrooms}, Sdb : {listing.bathrooms}</Text>
                    <HStack spacing={3} pt={2}>
                        {listing.has_terrace && <Text fontSize="sm" color="gray.600">Terrasse</Text>}
                        {listing.has_parking && <Text fontSize="sm" color="gray.600">Parking</Text>}
                    </HStack>
                </Stack>
                <Flex px={4} pb={4} justify="flex-end">
                    <Button as={Link} href={`/listings/${listing.id}`} colorScheme="brand" size={isSmall ? 'xs' : 'sm'}>
                        Voir l'annonce
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}
