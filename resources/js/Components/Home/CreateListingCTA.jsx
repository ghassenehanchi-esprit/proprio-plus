import { Box, Heading, Text, SimpleGrid, Image, Button } from "@chakra-ui/react";
import FadeInSection from "../UI/FadeInSection";
import { Link } from "@inertiajs/react";

export default function CreateListingCTA() {
  return (
    <FadeInSection>
      <Box bg="surfaceSubtle" py={10} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} alignItems="center">
          <Image
            src="/images/hero.png"
            alt="Publier une annonce"
            borderRadius="lg"
            objectFit="cover"
          />
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading as="h2" size="xl" mb={4}>
              Envie de vendre votre bien ?
            </Heading>
            <Text fontSize="lg" mb={6}>
              Publiez votre annonce en quelques minutes et touchez des milliers
              d’acheteurs potentiels sur ProprioPlus.
            </Text>
            <Button as={Link} href="/listings/create" colorScheme="brand" size="lg">
              Créer une annonce
            </Button>
          </Box>
        </SimpleGrid>
      </Box>
    </FadeInSection>
  );
}
