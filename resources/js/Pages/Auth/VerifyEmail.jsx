import { useForm, Link } from '@inertiajs/react';
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';

export default function VerifyEmail({ status }) {
  const { post, processing } = useForm();

  const submit = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center">
      <Box bg="white" p={8} borderRadius="md" boxShadow="md" maxW="md" w="full">
        <Heading size="lg" mb={6} textAlign="center">Vérification email</Heading>
        <Text mb={4}>
          Avant de continuer, veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer.
        </Text>
        {status === 'verification-link-sent' && (
          <Text mb={4} fontSize="sm" color="green.600">
            Un nouveau lien de vérification a été envoyé à votre adresse e-mail.
          </Text>
        )}
        <form onSubmit={submit}>
          <VStack spacing={4}>
            <Button colorScheme="orange" type="submit" isLoading={processing} w="full">
              Renvoyer l'email de vérification
            </Button>
            <Link href="/logout" method="post">
              <Button variant="link" colorScheme="orange">Se déconnecter</Button>
            </Link>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
