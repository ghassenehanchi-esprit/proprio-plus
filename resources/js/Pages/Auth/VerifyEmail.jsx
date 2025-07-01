import { Head, Link, useForm } from '@inertiajs/react';
import { Box, Button, Text, VStack, HStack } from '@chakra-ui/react';

export default function VerifyEmail({ status }) {
  const { post, processing } = useForm({});

  const submit = e => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <> 
      <Head title="Vérification de l'email" />
      <Box maxW="md" mx="auto" mt={10} p={6} bg="white" borderRadius="md" boxShadow="md" textAlign="center">
        <VStack spacing={4}>
          <Text fontSize="sm" color="gray.600">
            Avant de continuer, veuillez vérifier votre adresse email en cliquant sur le lien que nous venons de vous envoyer.
            Si vous ne l'avez pas reçu, nous pouvons vous en envoyer un autre.
          </Text>
          {status === 'verification-link-sent' && (
            <Text color="green.600">Un nouveau lien de vérification a été envoyé à votre adresse email.</Text>
          )}
          <HStack spacing={4} justify="center" as="form" onSubmit={submit}>
            <Button colorScheme="orange" type="submit" isLoading={processing}>Renvoyer l'email</Button>
            <Link href={route('profile.show')}><Button variant="link" colorScheme="orange">Profil</Button></Link>
            <Link href={route('logout')} method="post" as="button"><Button variant="link" colorScheme="orange">Déconnexion</Button></Link>
          </HStack>
        </VStack>
      </Box>
    </>
  );
}
