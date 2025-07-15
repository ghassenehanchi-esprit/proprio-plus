
import React, { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    IconButton,
    useBreakpointValue
} from '@chakra-ui/react';
import { FaSearch, FaSlidersH, FaMapMarkedAlt } from 'react-icons/fa';
import AddressSearch from './AddressSearch';
import FilterPopover from './FilterPopover.jsx';
import PopupMap from '../Map/PopupMap';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function SearchBar() {
    const [searchParams, setSearchParams] = useState({
        city: null,
        postal_code: null,
        min_price: null,
        max_price: null,
        min_surface: null,
        max_surface: null,
        rooms: null,
        bedrooms: null,
        has_terrace: null,
        has_parking: null,
        has_garden: null,
        min_year_built: null,
        max_year_built: null,
        category_id: null,
        lat: null,
        lng: null,
        radius: 10,
    });

    const [mapOpen, setMapOpen] = useState(false);
    const showFullButtons = useBreakpointValue({ base: false, md: true });

    const cleanedParams = Object.fromEntries(
        Object.entries(searchParams).filter(
            ([_, value]) => value !== null && value !== '' && value !== false
        )
    );

    const handleSearch = () => {
        router.visit(route('listings.search'), {
            method: 'get',
            data: cleanedParams,
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleAddressChange = ({ city, postal_code, lat, lng }) => {
        setSearchParams((prev) => ({
            ...prev,
            city,
            postal_code,
            lat,
            lng,
        }));
    };

    const handleMapClick = () => {
        setMapOpen(true);
    };

    return (
        <Flex
            bg="surface"
            boxShadow="xl"
            borderRadius="full"
            p={4}
            w={{ base: '95%', md: '90%' }}
            mx="auto"
            align="center"
            justify="center"
            wrap="wrap"
            gap={3}
            direction={{ base: 'column', md: 'row' }}
        >
            <Box flex="1" minW="250px">
                <AddressSearch onSelect={handleAddressChange} />
            </Box>

            <FilterPopover searchParams={searchParams} setSearchParams={setSearchParams} />

            {showFullButtons ? (
                <>
                    <Button
                        leftIcon={<FaMapMarkedAlt />}
                        colorScheme="blue"
                        onClick={handleMapClick}
                        size="lg"
                        px={5}
                    >
                        Voir sur la carte
                    </Button>

                    <Button
                        leftIcon={<FaSearch />}
                        colorScheme="green"
                        onClick={handleSearch}
                        size="lg"
                        px={6}
                    >
                        Rechercher
                    </Button>
                </>
            ) : (
                <>
                    <IconButton
                        icon={<FaMapMarkedAlt />}
                        colorScheme="blue"
                        onClick={handleMapClick}
                        aria-label="Voir sur la carte"
                    />
                    <IconButton
                        icon={<FaSearch />}
                        colorScheme="green"
                        onClick={handleSearch}
                        aria-label="Rechercher"
                    />
                </>
            )}

            <PopupMap
                opened={mapOpen}
                toggle={() => setMapOpen(false)}
                initialPosition={{ lat: searchParams.lat, lng: searchParams.lng }}
                searchParams={cleanedParams}
            />
        </Flex>
    );
}
