import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="gray.100" py={4} textAlign="center">
      <Text fontSize="sm" color="gray.600">
        &copy; {new Date().getFullYear()} PRIMO. Tous droits réservés.
      </Text>
    </Box>
  );
}
