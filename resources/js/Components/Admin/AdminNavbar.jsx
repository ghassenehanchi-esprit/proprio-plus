import { Flex, Spacer, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, usePage } from '@inertiajs/react';
import AdminNotificationBell from './AdminNotificationBell';

export default function AdminNavbar() {
  const { auth } = usePage().props;

  return (
    <Flex as="nav" bg="gray.800" color="white" p={4} align="center" gap={4}>
      <Link href="/admin/users">Utilisateurs</Link>
      <Link href="/admin/pages">Pages</Link>
      <Spacer />
      <AdminNotificationBell />
      <Menu>
        <MenuButton as={Button} variant="ghost" rightIcon={<HamburgerIcon />}>{auth.user.first_name}</MenuButton>
        <MenuList>
          <MenuItem as={Link} href="/">Aller au site</MenuItem>
          <MenuItem as={Link} href="/logout" method="post">Déconnexion</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
