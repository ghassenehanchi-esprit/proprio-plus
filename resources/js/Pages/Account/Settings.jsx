import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function Settings() {
  return (
    <Box p={8}>
      <Heading size="lg" mb={4}>Paramètres du compte</Heading>
      <Text>Cette page permettra à l\'utilisateur de gérer les informations de son compte.</Text>
    </Box>
  );
}
