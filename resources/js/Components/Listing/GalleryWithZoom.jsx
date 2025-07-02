import {
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function GalleryWithZoom({ photos = [] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = useState(null);

  const open = (src) => {
    setActive(src);
    onOpen();
  };

  return (
    <>
      <SimpleGrid className="gallery-grid" columns={{ base: 1, sm: 2, md: 3 }} spacing={2}>
        {photos.map((src, i) => (
          <Box key={i} onClick={() => open(src)} cursor="pointer">
            <Image
              src={src || '/placeholder.png'}
              alt={`photo-${i}`}
              objectFit="cover"
              h="64"
              w="full"
              rounded="md"
            />
          </Box>
        ))}
      </SimpleGrid>
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
