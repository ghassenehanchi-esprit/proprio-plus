import {
  Box,
  Flex,
  Link as ChakraLink,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
} from '@chakra-ui/react';
import { Link, usePage } from '@inertiajs/react';
import AdminNotificationBell from './AdminNotificationBell';
import { FaUsers, FaFileAlt, FaHome, FaFlag, FaClock, FaChartPie } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const { auth } = usePage().props;

  return (
    <Flex minH="100vh">
      <Box w="200px" bg="brand.600" color="white" p={4}>
        <Flex direction="column" as="nav" gap={2} fontSize="sm">
          <ChakraLink as={Link} href="/admin" display="flex" alignItems="center" gap={2}>
            <Icon as={FaChartPie} />
            <Text>Dashboard</Text>
          </ChakraLink>
          <ChakraLink as={Link} href="/admin/users" display="flex" alignItems="center" gap={2}>
            <Icon as={FaUsers} />
            <Text>Utilisateurs</Text>
          </ChakraLink>
          <ChakraLink as={Link} href="/admin/listings" display="flex" alignItems="center" gap={2}
            >
            <Icon as={FaHome} />
            <Text>Annonces</Text>
          </ChakraLink>
          <ChakraLink as={Link} href="/admin/pages" display="flex" alignItems="center" gap={2}
            >
            <Icon as={FaFileAlt} />
            <Text>Pages</Text>
          </ChakraLink>
          <ChakraLink as={Link} href="/admin/reports" display="flex" alignItems="center" gap={2}
            >
            <Icon as={FaFlag} />
            <Text>Signalements</Text>
          </ChakraLink>
          <ChakraLink as={Link} href="/admin/clockings" display="flex" alignItems="center" gap={2}
            >
            <Icon as={FaClock} />
            <Text>Pointages</Text>
          </ChakraLink>
        </Flex>
      </Box>
      <Box flex="1" bg="gray.50">
        <Flex as="header" bg="white" px={4} py={2} justify="space-between" align="center" shadow="sm">
          <ChakraLink as={Link} href="/">Accueil</ChakraLink>
          <Flex align="center" gap={3}>
            <AdminNotificationBell />
            <Menu>
              <MenuButton as={Button} variant="ghost">
                {auth.user.first_name}
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} href="/">Aller au site</MenuItem>
                <MenuItem as={Link} href="/admin/logout" method="post">Déconnexion</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        <Box p={4}>{children}</Box>
      </Box>
    </Flex>
  );
}
