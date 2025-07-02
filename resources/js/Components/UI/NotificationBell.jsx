import {
  Box,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

export default function NotificationBell() {
  const { unreadNotifications = 0 } = usePage().props;
  const [notifications, setNotifications] = useState([]);
  const firstLoad = useRef(true);
  const toast = useToast();

  const loadNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      const data = res.data;

      if (firstLoad.current) {
        setNotifications(data);
        firstLoad.current = false;
        return;
      }

      const currentIds = notifications.map(n => n.id);
      data.forEach(n => {
        if (!currentIds.includes(n.id)) {
          toast({
            title: 'Nouveau message',
            description: n.data.content,
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
        }
      });
      setNotifications(data);
    } catch (e) {}
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    await axios.post(`/notifications/${id}/read`);
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  };

  const markAsUnread = async (id) => {
    await axios.post(`/notifications/${id}/unread`);
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read_at: null } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length || unreadNotifications;

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
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              bg={n.read_at ? 'white' : 'gray.100'}
              _hover={{ bg: n.read_at ? 'gray.50' : 'gray.200' }}
              as={Link}
              href={`/messages?conversation=${n.data.conversation_id}`}
            >
              <HStack align="start" spacing={3} w="100%">
                <Avatar size="sm" name={`${n.sender.first_name} ${n.sender.last_name}`} />
                <Box flex="1">
                  <Text fontSize="sm" mb={1}>{n.data.content}</Text>
                  {n.read_at ? (
                    <Button size="xs" onClick={(e) => { e.preventDefault(); markAsUnread(n.id); }}>Marquer comme non lue</Button>
                  ) : (
                    <Button size="xs" onClick={(e) => { e.preventDefault(); markAsRead(n.id); }}>Marquer comme lue</Button>
                  )}
                </Box>
              </HStack>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
}
