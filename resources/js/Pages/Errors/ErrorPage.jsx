import { Box, Heading, Text, Button, Image } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';

export default function ErrorPage({ code, message, image }) {
  return (
    <Box textAlign="center" py={10} px={6}>
      {image && (
        <Image src={image} alt="illustration" mx="auto" boxSize={{ base: '200px', md: '300px' }} />
      )}
      <Heading as="h2" size="2xl" mt={6} color="orange.500">
        {code}
      </Heading>
      <Text fontSize="lg" mt={4}>
        {message}
      </Text>
      <Button mt={6} as={Link} href="/" colorScheme="orange">
        Accueil
      </Button>
    </Box>
  );
}
