import { Box, Heading, HStack, VStack, Text, Input, Button, Avatar, IconButton } from '@chakra-ui/react';
import { FaCheckDouble, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Index({ conversations: initial = {}, current }) {
  const { auth } = usePage().props;
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [content, setContent] = useState('');
  const [conversations, setConversations] = useState(initial.data || []);
  const [nextPage, setNextPage] = useState(initial.next_page_url);

  const loadConversation = async (conv) => {
    setActive(conv);
    const res = await axios.get(`/conversations/${conv.id}`);
    setMessages(res.data.messages);
    const other = res.data.seller_id === auth.user.id ? res.data.buyer : res.data.seller;
    setPartner(other);
  };

  const loadMore = async () => {
    if (!nextPage) return;
    const res = await axios.get(nextPage);
    setConversations(cs => [...cs, ...res.data.data]);
    setNextPage(res.data.next_page_url);
  };

  const toggleRead = async (conv) => {
    if (conv.unread_count > 0) {
      await axios.post(`/conversations/${conv.id}/read`);
      setConversations(cs => cs.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c));
    } else {
      await axios.post(`/conversations/${conv.id}/unread`);
      setConversations(cs => cs.map(c => c.id === conv.id ? { ...c, unread_count: 1 } : c));
    }
  };

  const refreshMessages = async () => {
    if (!active) return;
    const res = await axios.get(`/conversations/${active.id}`);
    setMessages(res.data.messages);
    const other = res.data.seller_id === auth.user.id ? res.data.buyer : res.data.seller;
    setPartner(other);
  };

  const send = async () => {
    if (!content) return;
    const res = await axios.post(`/conversations/${active.id}/messages`, { content });
    setContent('');
    setMessages((ms) => [...ms, res.data]);
  };

  useEffect(() => {
    if (conversations.length) {
      const first = current ? conversations.find(c => c.id == current) : conversations[0];
      if (first) loadConversation(first);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(refreshMessages, 5000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <HStack align="start" spacing={6}>
      <VStack align="stretch" w="250px" spacing={1}>
        {conversations.map(c => (
          <Box
            key={c.id}
            p={3}
            bg={active?.id === c.id ? 'brand.100' : c.unread_count > 0 ? 'gray.100' : 'white'}
            borderRadius="md"
            borderWidth="1px"
            borderColor={c.unread_count > 0 ? 'brand.200' : 'gray.200'}
            cursor="pointer"
            _hover={{ bg: c.unread_count > 0 ? 'gray.200' : 'gray.50' }}
            onClick={() => loadConversation(c)}
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={0} flex="1">
                <Text fontWeight="bold" noOfLines={1}>{c.listing.title}</Text>
                {c.unread_count > 0 && (
                  <Text fontSize="xs" color="brand.600">{c.unread_count} nouveau(x)</Text>
                )}
              </VStack>
              <IconButton
                icon={c.unread_count > 0 ? <FaEnvelopeOpen /> : <FaEnvelope />}
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); toggleRead(c); }}
                aria-label="toggle read"
              />
            </HStack>
          </Box>
        ))}
        {nextPage && (
          <Button variant="ghost" onClick={loadMore}>Charger plus</Button>
        )}
      </VStack>
      <Box flex="1" bg="white" p={4} borderRadius="md">
        {active ? (
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading size="md">{active.subject || active.listing.title}</Heading>
              {partner && (
                <HStack>
                  <Avatar size="sm" name={`${partner.first_name} ${partner.last_name}`} />
                  <Text fontSize="sm" color="gray.600">
                    Dernière connexion : {partner.last_active_at ? new Date(partner.last_active_at).toLocaleString() : 'N/A'}
                  </Text>
                </HStack>
              )}
            </HStack>
            <VStack align="stretch" spacing={2} maxH="400px" overflowY="auto">
              {messages.map(m => (
                <Box key={m.id} alignSelf={m.sender_id === auth.user.id ? 'flex-end' : 'flex-start'} bg={m.sender_id === auth.user.id ? 'brand.200' : 'gray.100'} borderRadius="md" p={2}>
                  <HStack>
                    <Text>{m.content}</Text>
                    {m.sender_id === auth.user.id && (
                      <FaCheckDouble color={m.is_read ? 'blue' : 'gray'} />
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
            <HStack>
              <Input value={content} onChange={e => setContent(e.target.value)} />
              <Button colorScheme="brand" onClick={send}>Envoyer</Button>
            </HStack>
          </VStack>
        ) : (
          <Text>Aucune conversation</Text>
        )}
      </Box>
    </HStack>
  );
}
