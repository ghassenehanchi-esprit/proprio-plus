import { Badge, Menu, MenuButton, MenuList, MenuItem, IconButton, Avatar, HStack, Text } from '@chakra-ui/react';
import { FaEnvelope } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, usePage } from '@inertiajs/react';

export default function MessagesBell() {
  const { auth, unreadMessages = 0 } = usePage().props;
  const [conversations, setConversations] = useState([]);

  const loadConversations = async () => {
    try {
      const res = await axios.get('/conversations?limit=5');
      const data = res.data.data || [];
      setConversations(data);
    } catch (e) {}
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount =
    conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0) || unreadMessages;

  const getPartner = (conv) => {
    return conv.seller_id === auth.user.id ? conv.buyer : conv.seller;
  };

  return (
    <Menu>
      <MenuButton as={IconButton} variant="ghost" icon={<FaEnvelope />} aria-label="Messages" position="relative" mr={2}>
        {unreadCount > 0 && (
          <Badge position="absolute" top="0" right="0" bg="brand.500" color="white" borderRadius="full">
            {unreadCount}
          </Badge>
        )}
      </MenuButton>
      <MenuList w={{ base: '100%', sm: '300px' }}>
        {conversations.length === 0 ? (
          <MenuItem>Aucune conversation</MenuItem>
        ) : (
          conversations.map((c) => {
            const partner = getPartner(c);
            return (
              <MenuItem
                key={c.id}
                as={Link}
                href={`/messages?conversation=${c.id}`}
                bg={c.unread_count > 0 ? 'inputBg' : 'surface'}
                _hover={{ bg: c.unread_count > 0 ? 'gray.200' : 'surfaceSubtle' }}
              >
                <HStack align="start" spacing={3} w="100%">
                  <Avatar size="sm" name={`${partner.first_name} ${partner.last_name}`} />
                  <Text flex="1" noOfLines={1}>{c.subject || c.listing.title}</Text>
                  {c.unread_count > 0 && <Badge colorScheme="brand">{c.unread_count}</Badge>}
                </HStack>
              </MenuItem>
            );
          })
        )}
      </MenuList>
    </Menu>
  );
}
