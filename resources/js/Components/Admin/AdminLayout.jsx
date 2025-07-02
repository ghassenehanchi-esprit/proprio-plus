import { Box } from '@chakra-ui/react';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout({ children }) {
  return (
    <Box>
      <AdminNavbar />
      <Box as="main" p={4} minH="80vh">
        {children}
      </Box>
    </Box>
  );
}
