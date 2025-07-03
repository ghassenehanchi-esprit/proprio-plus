import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="brand.600" color="white" py={4} textAlign="center">
      <Text fontSize="sm">
        &copy; {new Date().getFullYear()} PRIMO. Tous droits réservés.
      </Text>
    </Box>
  );
}
