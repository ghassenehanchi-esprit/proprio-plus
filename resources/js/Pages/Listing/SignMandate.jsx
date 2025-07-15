import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import SignaturePad from 'react-signature-canvas';
import { useRef } from 'react';
import { useForm } from '@inertiajs/react';

export default function SignMandate({ listing }) {
    const padRef = useRef(null);
    const { post, processing } = useForm();

    const submit = e => {
        e.preventDefault();
        const dataUrl = padRef.current?.getTrimmedCanvas().toDataURL('image/png');
        post(`/listings/${listing.id}/exclusive-mandate`, { data: { signature: dataUrl } });
    };

    return (
        <Box maxW="3xl" mx="auto" mt={8} bg="surface" p={8} rounded="md" shadow="md">
            <Heading size="lg" mb={4}>Mandat exclusif</Heading>
            <Text mb={6}>Veuillez signer ce mandat pour confirmer la mise en vente exclusive de votre bien.</Text>
            <VStack as="form" onSubmit={submit} spacing={4} align="flex-start">
                <Box border="1px" borderColor="gray.300" w="full">
                    <SignaturePad ref={padRef} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
                </Box>
                <Button type="submit" colorScheme="brand" isLoading={processing}>Signer</Button>
            </VStack>
        </Box>
    );
}
