
import React, { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Input,
    IconButton,
    useBreakpointValue
} from '@chakra-ui/react';
import { FaSearch, FaSlidersH, FaMapMarkedAlt } from 'react-icons/fa';
import AddressSearch from './AddressSearch';
import FilterPopover from './FilterPopover.jsx';
import PopupMap from '../Map/PopupMap';
import axios from 'axios';
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
        category_id: null,
        lat: null,
        lng: null,
        radius: 10,
    });

    const [mapOpen, setMapOpen] = useState(false);
    const [coordinates, setCoordinates] = useState([]);

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

    const handleMapClick = async () => {
        try {
            const response = await axios.get('/api/listings/map');
            if (Array.isArray(response.data.data)) {
                setCoordinates(response.data.data);
            } else {
                setCoordinates([]);
            }
            setMapOpen(true);
        } catch (err) {
            console.error("Erreur récupération carte :", err);
            setCoordinates([]);
            setMapOpen(true);
        }
    };

    return (
        <Flex
            bg="white"
            boxShadow="xl"
            borderRadius="full"
            p={2}
            w={{ base: '95%', md: '90%' }}
            mx="auto"
            align="center"
            justify="space-between"
            wrap="wrap"
            gap={3}
        >
            <Box flex="1" minW="250px">
                <AddressSearch onSelect={handleAddressChange} />
            </Box>

            <FilterPopover searchParams={searchParams} setSearchParams={setSearchParams} />

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

            <PopupMap
                opened={mapOpen}
                toggle={() => setMapOpen(false)}
                coordinates={coordinates}
            />
        </Flex>
    );
}
