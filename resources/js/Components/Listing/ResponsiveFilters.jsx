import React from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import FilterSidebar from './FilterSidebar';

export default function ResponsiveFilters({ searchParams, setSearchParams, onSearch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <>
        <Button mb={4} onClick={onOpen} colorScheme="brand">
          Filtres
        </Button>
        <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filtres</DrawerHeader>
            <DrawerBody>
              <FilterSidebar
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                onSearch={() => {
                  onSearch();
                  onClose();
                }}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Box w="300px">
      <FilterSidebar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onSearch={onSearch}
      />
    </Box>
  );
}

