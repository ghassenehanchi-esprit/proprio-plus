import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bgGradient="linear(to-r, brand.600, orange.500)" color="white" py={4} textAlign="center">
      <Text fontSize="sm">
        &copy; {new Date().getFullYear()} PRIMO. Tous droits réservés.
      </Text>
    </Box>
  );
}
