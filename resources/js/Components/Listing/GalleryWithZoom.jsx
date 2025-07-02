import { Image, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure } from '@chakra-ui/react';
import Slider from 'react-slick';
import { useState } from 'react';

export default function GalleryWithZoom({ photos = [] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = useState(null);

  const open = (src) => {
    setActive(src);
    onOpen();
  };

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <Slider {...sliderSettings}>
        {photos.map((src, i) => (
          <Image
            key={i}
            src={src || '/placeholder.png'}
            alt={`photo-${i}`}
            objectFit="cover"
            h="64"
            w="full"
            rounded="md"
            onClick={() => open(src)}
            cursor="pointer"
          />
        ))}
      </Slider>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalBody p={0}>
            {active && (
              <Image src={active} alt="zoomed" w="full" h="full" objectFit="contain" />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
