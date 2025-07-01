import { Head, useForm } from '@inertiajs/react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: ''
  });

  const submit = e => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <> 
      <Head title="Mot de passe oublié" />
      <Box maxW="md" mx="auto" mt={10} p={6} bg="white" borderRadius="md" boxShadow="md">
        <form onSubmit={submit}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Mot de passe oublié ? Indiquez votre email et nous vous enverrons un lien pour le réinitialiser.
            </Text>
            {status && <Text color="green.600">{status}</Text>}
            <Input
              type="email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              placeholder="Adresse email"
              isInvalid={Boolean(errors.email)}
            />
            {errors.email && <Text color="red.500">{errors.email}</Text>}
            <Button colorScheme="orange" type="submit" isLoading={processing}>Envoyer le lien</Button>
          </VStack>
        </form>
      </Box>
    </>
  );
}
