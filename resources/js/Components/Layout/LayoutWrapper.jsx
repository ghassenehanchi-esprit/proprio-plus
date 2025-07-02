import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FlashMessages from '../UI/FlashMessages';

export default function LayoutWrapper({ children }) {
  return (
    <Box>
      <Navbar />
      <FlashMessages />
      <Box as="main" pt="70px" px={{ base: 2, md: 4 }} pb={20} minH="80vh">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
