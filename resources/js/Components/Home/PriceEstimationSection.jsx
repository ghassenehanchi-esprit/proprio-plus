import { Box, Heading, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import FadeInSection from "../UI/FadeInSection";

const data = [
  { label: "Appartement", value: 3000 },
  { label: "Maison", value: 2500 },
  { label: "Terrain", value: 1500 },
];

export default function PriceEstimationSection() {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <FadeInSection>
      <Box py={10} textAlign="center">
        <Heading size="lg" mb={6}>Estimation des prix au m²</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {data.map((d) => (
            <VStack key={d.label} spacing={3}>
              <Box
                h={`${(d.value / max) * 150}px`}
                w="40px"
                bg="brand.500"
                borderRadius="md"
              />
              <Text fontWeight="bold">{d.value} €/m²</Text>
              <Text>{d.label}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Box>
    </FadeInSection>
  );
}
