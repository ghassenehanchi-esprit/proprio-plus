import { useForm, Link } from '@inertiajs/react';
import { Box, Button, Flex, Heading, Input, VStack, Text } from '@chakra-ui/react';

export default function ForgotPassword() {
  const { data, setData, post, processing } = useForm({
    email: ''
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      <Flex flex={1} justify="center" align="center" bg="white">
        <Box w="full" maxW="md" p={8}>
          <Heading size="lg" mb={6} textAlign="center">Mot de passe oublié</Heading>
          <form onSubmit={submit}>
            <VStack spacing={4}>
              <Input
                name="email"
                placeholder="Adresse email"
                bg="gray.100"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              <Button colorScheme="orange" w="full" type="submit" isLoading={processing}>
                Envoyer le lien de réinitialisation
              </Button>
            </VStack>
          </form>
          <Text mt={6} fontSize="sm">
            <Link href="/login">
              <Button variant="link" colorScheme="orange" size="sm">Retour connexion</Button>
            </Link>
          </Text>
        </Box>
      </Flex>
      <Box flex={1} bgImage="url('/images/auth-back.png')" bgSize="cover" bgPos="center" display={{ base: 'none', md: 'block' }} />
    </Flex>
  );
}
