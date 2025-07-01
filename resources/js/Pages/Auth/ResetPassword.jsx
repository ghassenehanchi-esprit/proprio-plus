import { Head, useForm } from '@inertiajs/react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors } = useForm({
    token,
    email: email || '',
    password: '',
    password_confirmation: ''
  });

  const submit = e => {
    e.preventDefault();
    post(route('password.update'));
  };

  return (
    <> 
      <Head title="Réinitialiser le mot de passe" />
      <Box maxW="md" mx="auto" mt={10} p={6} bg="white" borderRadius="md" boxShadow="md">
        <form onSubmit={submit}>
          <VStack spacing={4} align="stretch">
            <Input
              type="email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              placeholder="Adresse email"
              isInvalid={Boolean(errors.email)}
            />
            {errors.email && <Text color="red.500">{errors.email}</Text>}
            <Input
              type="password"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              placeholder="Nouveau mot de passe"
              isInvalid={Boolean(errors.password)}
            />
            <Input
              type="password"
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
              placeholder="Confirmer le mot de passe"
              isInvalid={Boolean(errors.password_confirmation)}
            />
            {errors.password && <Text color="red.500">{errors.password}</Text>}
            <Button colorScheme="orange" type="submit" isLoading={processing}>Réinitialiser</Button>
          </VStack>
        </form>
      </Box>
    </>
  );
}
