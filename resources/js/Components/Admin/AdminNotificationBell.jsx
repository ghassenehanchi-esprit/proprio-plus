import {
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
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

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markAsRead = async id => {
    await axios.post(`/admin/notifications/${id}/read`);
    setNotifications(ns => ns.map(n => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  };

  return (
    <Menu>
      <MenuButton as={IconButton} variant="ghost" icon={<BellIcon />} aria-label="Notifications" position="relative" mr={2}>
        {unreadCount > 0 && (
          <Badge position="absolute" top="0" right="0" bg="brand.500" color="white" borderRadius="full">
            {unreadCount}
          </Badge>
        )}
      </MenuButton>
      <MenuList maxW="300px">
        {notifications.length === 0 ? (
          <MenuItem>Aucune notification</MenuItem>
        ) : (
          notifications.map(n => (
            <MenuItem key={n.id} bg={n.read_at ? 'white' : 'gray.100'} _hover={{ bg: 'gray.50' }} onClick={() => markAsRead(n.id)}>
              <Text fontSize="sm">Nouvelle demande de certification de {n.data.name}</Text>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
}
