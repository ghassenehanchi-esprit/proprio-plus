import { useForm } from '@inertiajs/react';
import { Box, FormControl, FormLabel, Input, FormErrorMessage, Button, VStack } from '@chakra-ui/react';
import useErrorAlert from '@/hooks/useErrorAlert';
import React from 'react';

export default function PasswordForm() {
  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  useErrorAlert(errors);

  const submit = (e) => {
    e.preventDefault();
    put('/user/password', {
      onSuccess: () => reset(),
    });
  };

  return (
    <Box as="form" onSubmit={submit} maxW="md">
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={errors.current_password}>
          <FormLabel>Mot de passe actuel</FormLabel>
          <Input type="password" value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />
          <FormErrorMessage>{errors.current_password}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <FormLabel>Nouveau mot de passe</FormLabel>
          <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password_confirmation}>
          <FormLabel>Confirmez le mot de passe</FormLabel>
          <Input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
          <FormErrorMessage>{errors.password_confirmation}</FormErrorMessage>
        </FormControl>
        <Button colorScheme="brand" type="submit" isLoading={processing} alignSelf="flex-start">
          Mettre à jour
        </Button>
      </VStack>
    </Box>
  );
}
