import { Box, Heading, SimpleGrid, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaSearch, FaHandshake, FaBell } from "react-icons/fa";
import FadeInSection from "../UI/FadeInSection";

const advices = [
  { icon: FaSearch, text: "Affinez vos recherches avec nos filtres avancés." },
  { icon: FaHandshake, text: "Contactez rapidement les vendeurs pour organiser une visite." },
  { icon: FaBell, text: "Activez les alertes pour ne rater aucune nouvelle annonce." },
];

export default function ClientAdviceSection() {
  return (
    <FadeInSection>
      <Box py={10} textAlign="center">
        <Heading size="lg" mb={6}>Nos conseils pour réussir</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {advices.map((a, i) => (
            <Box key={i} p={5} borderRadius="lg" bg="surface" boxShadow="sm">
              <Icon as={a.icon} boxSize={8} color={useColorModeValue('brand.500', 'white')} mb={3} />
              <Text>{a.text}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </FadeInSection>
  );
}
