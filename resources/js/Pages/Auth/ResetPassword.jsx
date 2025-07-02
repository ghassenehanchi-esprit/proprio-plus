import { useForm } from '@inertiajs/react';
import { Box, Button, Flex, Heading, Input, VStack, FormControl, FormErrorMessage } from '@chakra-ui/react';
import useErrorAlert from '@/hooks/useErrorAlert';

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors } = useForm({
    token,
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  useErrorAlert(errors);

  const submit = (e) => {


    e.preventDefault();
    post(route('password.update'));
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      <Flex flex={1} justify="center" align="center" bg="white">
        <Box w="full" maxW="md" p={8}>
          <Heading size="lg" mb={6} textAlign="center">Réinitialiser le mot de passe</Heading>
          <form onSubmit={submit}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.email}>
                <Input
                  name="email"
                  type="email"
                  placeholder="Adresse email"
                  bg="gray.100"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password}>
                <Input
                  name="password"
                  type="password"
                  placeholder="Nouveau mot de passe"
                  bg="gray.100"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password_confirmation}>
                <Input
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirmez le mot de passe"
                  bg="gray.100"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                />
                <FormErrorMessage>{errors.password_confirmation}</FormErrorMessage>
              </FormControl>
              <Button colorScheme="orange" w="full" type="submit" isLoading={processing}>
                Réinitialiser
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
      <Box flex={1} bgImage="url('/images/auth-back.png')" bgSize="cover" bgPos="center" display={{ base: 'none', md: 'block' }} />
    </Flex>

   
  );
}
