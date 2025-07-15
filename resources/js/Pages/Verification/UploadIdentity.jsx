import { Box, Heading, Input, Button, VStack, Text } from "@chakra-ui/react";

export default function UploadIdentity() {
  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg="surface" borderRadius="md" boxShadow="md">
      <Heading size="lg" mb={6}>Téléversement de pièce d'identité</Heading>
      <VStack spacing={4}>
        <Input type="file" />
        <Text fontSize="sm" color="gray.500">Formats acceptés : PDF, JPG, PNG</Text>
        <Button colorScheme="brand" width="full">Envoyer</Button>
      </VStack>
    </Box>
  );
}
