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
import { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';

export default function NotificationBell() {
  const { unreadNotifications = 0 } = usePage().props;
  const [notifications, setNotifications] = useState([]);
  const firstLoad = useRef(true);

  const loadNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      const data = Array.isArray(res.data) ? res.data : [];

      if (firstLoad.current) {
        setNotifications(data);
        firstLoad.current = false;
        return;
      }

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

  const getInfo = (n) => {
    const name = n.sender ? `${n.sender.first_name} ${n.sender.last_name}` : '';

    if (n.type.includes('NewMessageNotification')) {
      return {
        text: `${name} vous a envoyé un message${countText}`,
        href: `/messages?conversation=${n.data.conversation_id}`,
      };
    }
    if (n.type.includes('MeetingProposalNotification')) {
      const base =
        n.data.type === 'visit'
          ? `${name} vous a demandé une visite`
          : `${name} vous propose un rendez-vous`;
      return { text: `${base}${countText}`, href: `/messages?conversation=${n.data.conversation_id}` };
    }
    if (n.type.includes('ListingFavoritedNotification')) {
      return { text: `Votre annonce a été ajoutée aux favoris`, href: `/listings/${n.data.listing_id}`, hideSender: true };

    }
    return { text: (n.data.content || 'Notification') + countText, href: '#' };
  };

  const unreadCount =
    (Array.isArray(notifications)
      ? notifications.filter((n) => !n.read_at).length
      : 0) || unreadNotifications;

  const groupedNotifications = useMemo(() => {
    const groups = {};
    notifications.forEach((n) => {
      const key = n.data.conversation_id ?? n.data.listing_id ?? n.id;
      const existing = groups[key];
      if (!existing || new Date(n.created_at) > new Date(existing.created_at)) {
        groups[key] = { ...n, unread_count: existing ? existing.unread_count : 0 };
      }
      if (!n.read_at) {
        groups[key].unread_count = (groups[key].unread_count || 0) + 1;
      }
    });
    return Object.values(groups).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [notifications]);

  return (
    <Menu>
      <MenuButton as={IconButton} variant="ghost" icon={<BellIcon />} aria-label="Notifications" position="relative" mr={2}>
        {unreadCount > 0 && (
          <Badge position="absolute" top="0" right="0" bg="brand.500" color="white" borderRadius="full">
            {unreadCount}
          </Badge>
        )}
      </MenuButton>
      <MenuList w={{ base: '100%', sm: '300px' }} maxH="60vh" overflowY="auto">
        {groupedNotifications.length === 0 ? (
          <MenuItem>Aucune notification</MenuItem>
        ) : (
          notifications.map((n) => {
            const { text, href, hideSender } = getInfo(n);

            return (
              <MenuItem
                key={n.id}
                bg={n.read_at ? 'surface' : 'inputBg'}
                _hover={{ bg: n.read_at ? 'surfaceSubtle' : 'gray.200' }}
                as={Link}
                href={href}
              >
                <HStack align="start" spacing={3} w="100%">
                  {!hideSender && (
                    <Avatar size="sm" name={`${n.sender.first_name} ${n.sender.last_name}`} />
                  )}
                  <Box flex="1">
                    <Text fontSize="sm" mb={1}>{text}</Text>
                    {n.read_at ? (
                      <Button size="xs" onClick={(e) => { e.preventDefault(); markAsUnread(n.id); }}>Marquer comme non lue</Button>
                    ) : (
                      <Button size="xs" onClick={(e) => { e.preventDefault(); markAsRead(n.id); }}>Marquer comme lue</Button>
                    )}
                  </Box>
                </HStack>
              </MenuItem>
            );
          })
        )}
      </MenuList>
    </Menu>
  );
}
