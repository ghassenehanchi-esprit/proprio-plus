import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FlashMessages from '../UI/FlashMessages';

const MotionBox = motion(Box);

export default function LayoutWrapper({ children }) {
  return (
    <Box>
      <Navbar />
      <FlashMessages />
      <MotionBox
        as="main"
        pt="70px"
        px={{ base: 2, md: 4 }}
        pb={20}
        minH="80vh"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </MotionBox>
      <Footer />
    </Box>
  );
}
