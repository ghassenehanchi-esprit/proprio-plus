import { Box, Heading, HStack, VStack, Text, Input, Button, Avatar } from '@chakra-ui/react';
import { FaCheckDouble } from 'react-icons/fa';
import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Index({ conversations = [], current }) {
  const { auth } = usePage().props;
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [content, setContent] = useState('');

  const loadConversation = async (conv) => {
    setActive(conv);
    const res = await axios.get(`/conversations/${conv.id}`);
    setMessages(res.data.messages);
    const other = res.data.seller_id === auth.user.id ? res.data.buyer : res.data.seller;
    setPartner(other);
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
          <Box key={c.id} p={3} bg={active?.id === c.id ? 'brand.100' : 'white'} borderRadius="md" cursor="pointer" onClick={() => loadConversation(c)}>
            <Text fontWeight="bold">{c.listing.title}</Text>
          </Box>
        ))}
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
