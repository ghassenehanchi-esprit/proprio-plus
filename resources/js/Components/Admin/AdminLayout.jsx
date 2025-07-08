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
  IconButton,
  Slide,
  useDisclosure,
} from '@chakra-ui/react';
import { Link, usePage } from '@inertiajs/react';
import AdminNotificationBell from './AdminNotificationBell';
import { FaUsers, FaFileAlt, FaHome, FaFlag, FaClock, FaChartPie, FaBars } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const { auth } = usePage().props;
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <Flex minH="100vh" bg="gray.100">
      <Slide direction="left" in={isOpen} style={{ width: '200px' }}>
        <Box w="200px" bg="brand.600" color="white" p={4} h="100vh" position="fixed">
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
      </Slide>
      <Box flex="1" ml={isOpen ? '200px' : 0} transition="margin 0.2s" bg="gray.50">
        <Flex as="header" bg="white" px={4} py={2} justify="space-between" align="center" shadow="sm" position="sticky" top={0} zIndex={1}>
          <IconButton icon={<FaBars />} variant="ghost" onClick={onToggle} aria-label="Toggle menu" />
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
