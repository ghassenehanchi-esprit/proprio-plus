import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Text,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await axios.get('/admin/notifications');
      setNotifications(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markAsRead = async (id) => {
    await axios.post(`/admin/notifications/${id}/read`);
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<FaBell />}
        variant="ghost"
        position="relative"
      >
        {unreadCount > 0 && (
          <Badge
            colorScheme="red"
            borderRadius="full"
            position="absolute"
            top="0"
            right="0"
            fontSize="0.6em"
          >
            {unreadCount}
          </Badge>
        )}
      </MenuButton>
      <MenuList>
        {notifications.length === 0 ? (
          <MenuItem>Aucune notification</MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => markAsRead(n.id)}
              color={n.read_at ? undefined : 'blue.600'}
            >
              <Text fontSize="sm">
                Nouvelle demande de certification de {n.data.name}
              </Text>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
}
