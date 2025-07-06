import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';

export default function AcceptTerms() {
    const { post, processing } = useForm();

    const submit = e => {
        e.preventDefault();
        post('/terms-acceptance');
    };

    return (
        <Box maxW="2xl" mx="auto" mt={12} bg="white" p={8} rounded="md" shadow="md">
            <Heading size="lg" mb={4}>Charte d'utilisation</Heading>
            <Text mb={6} whiteSpace="pre-line">
{`En utilisant ce service, vous vous engagez à respecter les règles de bonne conduite et à fournir des informations exactes.\nVeuillez lire attentivement l'intégralité de la charte avant de continuer.`}
            </Text>
            <VStack as="form" onSubmit={submit} spacing={4} align="flex-start">
                <Button type="submit" colorScheme="brand" isLoading={processing}>
                    J'accepte
                </Button>
            </VStack>
        </Box>
    );
}
