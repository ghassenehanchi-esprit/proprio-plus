import { useForm } from '@inertiajs/react';
import useErrorAlert from '@/hooks/useErrorAlert';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';

export default function AdminLogin() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useErrorAlert(errors);

  const submit = (e) => {
    e.preventDefault();
    post('/admin/login');
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box bg="white" p={8} rounded="md" shadow="md" w="full" maxW="md">
        <Heading size="lg" textAlign="center" mb={6}>
          Connexion administrateur
        </Heading>
        <form onSubmit={submit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.email}>
              <Input
                placeholder="Votre email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <Input
                type="password"
                placeholder="Votre mot de passe"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <Checkbox
              isChecked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
            >
              Se souvenir de moi
            </Checkbox>
            <Button colorScheme="brand" type="submit" w="full" isLoading={processing}>
              Se connecter
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}

AdminLogin.layout = (page) => page;
