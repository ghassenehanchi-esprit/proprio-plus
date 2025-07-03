import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Button,
  Flex,
} from '@chakra-ui/react';
import { InfoOutlineIcon, LockIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Link, usePage } from '@inertiajs/react';
import PersonalInfoForm from '@/Components/Account/PersonalInfoForm';
import PasswordForm from '@/Components/Account/PasswordForm';

export default function Settings({ user }) {
  const pageUser = user || usePage().props.user;
  const [index, setIndex] = useState(0);
  const panelsRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#password') {
      setIndex(1);
    }
  }, []);

  const handleChange = (i) => {
    setIndex(i);
    const hash = i === 0 ? '#info' : '#password';
    window.history.replaceState(null, '', hash);
    panelsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box p={8}>
      <Flex mb={6} align="center">
        <Button as={Link} href="/profile" leftIcon={<ArrowBackIcon />} variant="ghost" mr={4}>
          Retour au profil
        </Button>
        <Heading size="lg">Paramètres du compte</Heading>
      </Flex>
      <Tabs
        orientation="vertical"
        variant="enclosed"
        colorScheme="brand"
        isLazy
        index={index}
        onChange={handleChange}
        display={{ md: 'flex' }}
      >
        <TabList minW="240px" borderRightWidth={{ md: '1px' }} borderColor="gray.200">
          <Tab>
            <Icon as={InfoOutlineIcon} mr={2} /> Informations personnelles
          </Tab>
          <Tab>
            <Icon as={LockIcon} mr={2} /> Mot de passe
          </Tab>
        </TabList>
        <TabPanels ref={panelsRef} flex="1" pl={{ md: 6 }} mt={{ base: 4, md: 0 }}>
          <TabPanel px={0}>
            <PersonalInfoForm user={pageUser} />
          </TabPanel>
          <TabPanel px={0}>
            <PasswordForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
