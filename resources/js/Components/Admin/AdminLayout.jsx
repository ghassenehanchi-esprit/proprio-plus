import { AppShell, Navbar, NavLink, Header, Group, Menu, Button } from '@mantine/core';
import { Link, usePage } from '@inertiajs/react';
import AdminNotificationBell from './AdminNotificationBell';
import { FaUsers, FaFileAlt, FaHome } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const { auth } = usePage().props;

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 200 }} p="xs">
          <Navbar.Section>
            <NavLink component={Link} href="/admin/users" label="Utilisateurs" icon={<FaUsers size={14} />} />
            <NavLink component={Link} href="/admin/listings" label="Annonces" icon={<FaHome size={14} />} />
            <NavLink component={Link} href="/admin/pages" label="Pages" icon={<FaFileAlt size={14} />} />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Group position="apart" sx={{ height: '100%' }}>
            <Group>
              <Link href="/">Accueil</Link>
            </Group>
            <Group>
              <AdminNotificationBell />
              <Menu>
                <Menu.Target>
                  <Button variant="subtle">{auth.user.first_name}</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} href="/">Aller au site</Menu.Item>
                  <Menu.Item component={Link} href="/admin/logout" method="post">Déconnexion</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
