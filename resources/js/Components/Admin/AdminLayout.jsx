import { AppShell, NavLink, Group, Menu, Button } from '@mantine/core';
import { Link, usePage } from '@inertiajs/react';
import AdminNotificationBell from './AdminNotificationBell';
import { FaUsers, FaFileAlt, FaHome, FaFlag, FaClock } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const { auth } = usePage().props;

  return (
    <AppShell padding="md" navbar={{ width: 200 }} header={{ height: 60 }}>
      <AppShell.Navbar p="xs">
        <NavLink component={Link} href="/admin/users" label="Utilisateurs" icon={<FaUsers size={14} />} />
        <NavLink component={Link} href="/admin/listings" label="Annonces" icon={<FaHome size={14} />} />
        <NavLink component={Link} href="/admin/pages" label="Pages" icon={<FaFileAlt size={14} />} />
        <NavLink component={Link} href="/admin/reports" label="Signalements" icon={<FaFlag size={14} />} />
        <NavLink component={Link} href="/admin/clockings" label="Pointages" icon={<FaClock size={14} />} />
      </AppShell.Navbar>

      <AppShell.Header p="xs">
        <Group justify="space-between" h="100%">
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
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
