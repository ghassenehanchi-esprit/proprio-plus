import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  return (
    <Box>
      <Navbar />
      <Box as="main" pt="70px" px={{ base: 2, md: 4 }} pb={20} minH="80vh">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
