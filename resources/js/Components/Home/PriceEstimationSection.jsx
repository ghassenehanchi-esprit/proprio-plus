import { Box, Heading, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import FadeInSection from "../UI/FadeInSection";
import { useState, useEffect } from "react";
import axios from "axios";

const fallbackData = [
  { label: "Appartement", value: 3000 },
  { label: "Maison", value: 2500 },
  { label: "Terrain", value: 1500 },
];

export default function PriceEstimationSection() {
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/price-estimations", {
          withCredentials: false,
        });
        if (Array.isArray(res.data)) {
          setData(res.data);
        }
      } catch (e) {
        console.error("Failed to fetch estimation data", e);
      }
    }

    fetchData();
  }, []);

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
