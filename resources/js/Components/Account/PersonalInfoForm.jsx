import { useForm } from '@inertiajs/react';
import { Box, FormControl, FormLabel, Input, FormErrorMessage, Button, VStack } from '@chakra-ui/react';
import React from 'react';

export default function PersonalInfoForm({ user }) {
  const { data, setData, put, processing, errors } = useForm({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const submit = (e) => {
    e.preventDefault();
    put('/profile');
  };

  return (
    <Box as="form" onSubmit={submit} maxW="md">
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={errors.first_name}>
          <FormLabel>Prénom</FormLabel>
          <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
          <FormErrorMessage>{errors.first_name}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.last_name}>
          <FormLabel>Nom</FormLabel>
          <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
          <FormErrorMessage>{errors.last_name}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.phone}>
          <FormLabel>Téléphone</FormLabel>
          <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
        <Button colorScheme="brand" type="submit" isLoading={processing} alignSelf="flex-start">
          Enregistrer
        </Button>
      </VStack>
    </Box>
  );
}
