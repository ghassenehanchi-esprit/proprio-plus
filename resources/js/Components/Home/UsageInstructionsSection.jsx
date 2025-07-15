import { Box, Heading, VStack, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { FaSearch, FaRegStar, FaEnvelope } from "react-icons/fa";
import FadeInSection from "../UI/FadeInSection";

const steps = [
  { icon: FaSearch, title: "Recherchez", text: "Utilisez la barre de recherche pour trouver des biens." },
  { icon: FaRegStar, title: "Sauvegardez", text: "Ajoutez vos annonces favorites pour recevoir des recommandations." },
  { icon: FaEnvelope, title: "Contactez", text: "Échangez avec le vendeur directement via notre messagerie." },
];

export default function UsageInstructionsSection() {
  return (
    <FadeInSection>
      <Box py={10}>
        <Heading size="lg" mb={6} textAlign="center">Comment utiliser ProprioPlus ?</Heading>
        <VStack spacing={6} align="stretch" maxW="3xl" mx="auto">
          {steps.map((s, i) => (
            <HStack key={i} spacing={4} align="flex-start">
              <Icon as={s.icon} boxSize={8} color={useColorModeValue('brand.500', 'white')} />
              <Box>
                <Text fontWeight="bold">{s.title}</Text>
                <Text>{s.text}</Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </Box>
    </FadeInSection>
  );
}
