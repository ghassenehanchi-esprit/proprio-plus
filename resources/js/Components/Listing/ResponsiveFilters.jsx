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
  const drawerSize = useBreakpointValue({ base: 'full', sm: 'xs' });

  if (isMobile) {
    return (
      <>
        <Button mb={4} onClick={onOpen} colorScheme="brand">
          Filtres
        </Button>
        <Drawer placement="left" isOpen={isOpen} onClose={onClose} size={drawerSize}>
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
    <Box w={{ base: 'full', md: '300px' }}>
      <FilterSidebar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onSearch={onSearch}
      />
    </Box>
  );
}

