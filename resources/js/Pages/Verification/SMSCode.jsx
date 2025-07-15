import { Box, Heading, Input, Button, VStack } from "@chakra-ui/react";

export default function SMSCode() {
  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg="surface" borderRadius="md" boxShadow="md">
      <Heading size="lg" mb={6}>Vérification SMS</Heading>
      <VStack spacing={4}>
        <Input placeholder="Code reçu par SMS" />
        <Button colorScheme="brand" width="full">Vérifier</Button>
      </VStack>
    </Box>
  );
}
