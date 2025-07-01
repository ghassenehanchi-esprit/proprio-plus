import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Image,
  useBreakpointValue
} from "@chakra-ui/react";
import SearchBar from "@/Components/Listing/SearchBar.jsx";
import FeatureSection from "@/Components/Listing/FeatureSection";

export default function Home() {
  const heroHeight = useBreakpointValue({ base: "240px", md: "320px", lg: "400px" });

  return (
    <Box>
        <Box position="relative" mb={10}>
            <Image
                src="/images/hero.png"
                alt="Hero Image"
                borderRadius="2xl"
                w="full"
                h="80vh"
                objectFit="contain" // <-- change ici
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

        <FeatureSection />
    </Box>
  );
}
