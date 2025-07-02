import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Icon,
    useBreakpointValue,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { MdLocationOn } from "react-icons/md";
import L, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Slider from "react-slick";
import axios from "axios";

const PopupMap = ({ opened, toggle, initialPosition }) => {
    const modalSize = useBreakpointValue({ base: "xl", md: "4xl", lg: "6xl" });
    const mapHeight = useBreakpointValue({ base: "300px", md: "500px" });
    const [coords, setCoords] = useState([]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    const fetchListings = async (lat, lng) => {
        try {
            const response = await axios.get('/api/listings/map', {
                params: { lat, lng, radius: 10 }
            });
            if (Array.isArray(response.data.data)) {
                setCoords(response.data.data);
            } else {
                setCoords([]);
            }
        } catch (err) {
            console.error('Erreur récupération carte :', err);
            setCoords([]);
        }
    };

    const MapEvents = () => {
        const map = useMapEvents({});

        useEffect(() => {
            const handleMove = () => {
                const center = map.getCenter();
                fetchListings(center.lat, center.lng);
            };
            map.on('moveend', handleMove);
            handleMove();
            return () => map.off('moveend', handleMove);
        }, [map]);

        return null;
    };

    return (
        <Modal
            size={modalSize}
            isOpen={opened}
            onClose={toggle}
            isCentered
            motionPreset="slideInBottom"
        >
            <ModalOverlay />
            <ModalContent borderRadius="xl" overflow="hidden">
                <ModalHeader fontWeight="bold">Recherche sur la carte</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={0}>
                    <MapContainer
                        center={[initialPosition?.lat || 48.8566, initialPosition?.lng || 2.3522]}
                        zoom={12}
                        style={{ height: mapHeight, width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        />
                        <MapEvents />

                        {coords.map((listing, index) => {
                            const euroIcon = divIcon({
                                className: "custom-icon",
                                html: `
                  <button style="
                    background: white;
                    border-radius: 12px;
                    padding: 4px 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    border: 1px solid #bbb;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                    cursor: pointer;">
                    ${listing.price} €
                  </button>
                `,
                            });

                            return (
                                <Marker
                                    key={index}
                                    position={[listing.latitude, listing.longitude]}
                                    icon={euroIcon}
                                >
                                    <Popup>
                                        <div
                                            style={{ width: "200px", cursor: "pointer" }}
                                            onClick={() =>
                                                window.location.href = `/listings/${listing.id}`
                                            }
                                        >
                                            <Slider {...sliderSettings}>
                                                {(listing.photos || []).map((photo, i) => (
                                                    <img
                                                        key={i}
                                                        src={photo}
                                                        alt={`photo-${i}`}
                                                        className="popup-image"
                                                    />
                                                ))}
                                            </Slider>
                                            <div style={{ paddingTop: "8px" }}>
                                                <p style={{ fontWeight: 600, marginBottom: '4px' }}>{listing.title}</p>
                                                <p style={{ fontSize: '13px', color: '#555' }}>
                                                    <Icon as={MdLocationOn} /> {listing.city}
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={toggle}>
                        Fermer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PopupMap;
