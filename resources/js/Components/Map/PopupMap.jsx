import React from "react";
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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MdLocationOn } from "react-icons/md";
import L, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Slider from "react-slick";

const PopupMap = ({ opened, toggle, coordinates = [] }) => {
    const modalSize = useBreakpointValue({ base: "xl", md: "4xl", lg: "6xl" });

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
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
                        center={[48.8566, 2.3522]}
                        zoom={12}
                        style={{ height: "500px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        />

                        {coordinates.map((listing, index) => {
                            const euroIcon = divIcon({
                                className: "custom-icon",
                                html: `
                  <button style="
                    background: white;
                    border-radius: 12px;
                    padding: 4px 10px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #000;
                    border: 1px solid #ccc;
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
                                                        style={{ width: "100%", borderRadius: "8px" }}
                                                    />
                                                ))}
                                            </Slider>
                                            <div style={{ paddingTop: "8px" }}>
                                                <strong>{listing.title}</strong>
                                                <p style={{ fontSize: "13px" }}>
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
