import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Image,
  SimpleGrid,
  useBreakpointValue
} from "@chakra-ui/react";
import SearchBar from "@/Components/Listing/SearchBar.jsx";
import FeatureSection from "@/Components/Listing/FeatureSection";
import CreateListingCTA from "@/Components/Home/CreateListingCTA";
import FadeInSection from "@/Components/UI/FadeInSection";
import ListingCard from "@/Components/Listing/ListingCard";

export default function Home({ bestMatches = [] }) {
  const heroHeight = useBreakpointValue({ base: "240px", md: "320px", lg: "400px" });

  return (
    <Box>
        <FadeInSection>
            <Box position="relative" mb={10}>
                <Image
                    src="/images/hero.png"
                    alt="Hero Image"
                    borderRadius="2xl"
                    w="full"
                    h={heroHeight}
                    objectFit="contain"
                />
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width="90%"
                >
                    <SearchBar />
                </Box>
            </Box>
        </FadeInSection>

        <FeatureSection />
        <CreateListingCTA />

        {bestMatches.length > 0 && (
            <Box mt={10} pb={10}>
                <Heading size="lg" mb={6} textAlign="center">
                    Annonces populaires
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {bestMatches.map((l) => (
                        <ListingCard key={l.id} listing={l} />
                    ))}
                </SimpleGrid>
            </Box>
        )}
    </Box>
  );
}
