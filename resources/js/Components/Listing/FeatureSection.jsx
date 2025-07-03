import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Icon
} from "@chakra-ui/react";
import FadeInSection from "../UI/FadeInSection";
import { FaShieldAlt, FaMoneyBillWave, FaBolt } from "react-icons/fa";

const features = [
  { icon: FaShieldAlt, title: "Sécurité", text: "Transactions certifiées et comptes vérifiés." },
  { icon: FaMoneyBillWave, title: "Économique", text: "Seulement 1% de frais sur la vente." },
  { icon: FaBolt, title: "Rapide", text: "Mettez votre bien en ligne en quelques clics." }
];

export default function FeatureSection() {
  return (
    <FadeInSection>
      <Box textAlign="center" py={10}>
        <Heading size="lg" mb={6}>Pourquoi choisir ProprioPlus ?</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {features.map((f, i) => (
            <Box key={i} p={5} borderRadius="lg" bg="white" boxShadow="sm">
              <Icon as={f.icon} boxSize={8} color="brand.500" mb={3} />
              <Heading size="md" mb={2}>{f.title}</Heading>
              <Text fontSize="sm" color="gray.600">{f.text}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </FadeInSection>
  );
}
