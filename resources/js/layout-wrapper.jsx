import { Box } from '@chakra-ui/react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

export default function LayoutWrapper({ children }) {
  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />
      <Box pt="60px" px={4}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
