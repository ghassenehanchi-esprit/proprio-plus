import React from 'react';
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { usePage } from '@inertiajs/react';
import PersonalInfoForm from '@/Components/Account/PersonalInfoForm';
import PasswordForm from '@/Components/Account/PasswordForm';

export default function Settings({ user }) {
  const pageUser = user || usePage().props.user;

  return (
    <Box p={8}>
      <Heading size="lg" mb={6}>Paramètres du compte</Heading>
      <Tabs orientation="vertical" variant="line" isLazy display={{ md: 'flex' }}>
        <TabList minW="200px" borderRight="1px" borderColor="gray.200">
          <Tab>Informations personnelles</Tab>
          <Tab>Mot de passe</Tab>
        </TabList>
        <TabPanels flex="1" pl={{ md: 6 }} mt={{ base: 4, md: 0 }}>
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
