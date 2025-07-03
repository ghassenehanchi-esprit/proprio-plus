import { Box, Heading, HStack, VStack, Text, Input, Button, Avatar, IconButton } from '@chakra-ui/react';
import { FaCheckDouble, FaEnvelope, FaEnvelopeOpen, FaReply } from 'react-icons/fa';
import ListingCard from '@/Components/Listing/ListingCard';
import { usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import sweetAlert from '@/libs/sweetalert';

export default function Index({ conversations: initial = {}, current }) {
  const { auth } = usePage().props;
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [content, setContent] = useState('');
  const [conversations, setConversations] = useState(initial.data || []);
  const [nextPage, setNextPage] = useState(initial.next_page_url);
  const reportUser = async () => {
    if (!partner) return;
    await axios.post('/reports', {
      reported_user_id: partner.id,
      reason: 'inappropriate behavior',
      conversation_id: active.id,
    });
  };
  const messagesEndRef = useRef(null);

  const errorShown = useRef(false);

  const loadConversation = async (conv) => {
    try {
      setActive(conv);
      const res = await axios.get(`/conversations/${conv.id}`);
      const messagesRes = await axios.get(`/conversations/${conv.id}/messages`);
      setMessages(messagesRes.data);
      const other = res.data.seller_id === auth.user.id ? res.data.buyer : res.data.seller;
      setPartner(other);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
      errorShown.current = false;
    } catch (e) {
      if (!errorShown.current) {
        sweetAlert('Erreur lors du chargement de la conversation');
        errorShown.current = true;
      }
    }
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


  const send = async () => {
    if (!content) return;
    try {
      const res = await axios.post(`/conversations/${active.id}/messages`, { content });
      setContent('');
      setMessages((ms) => [...ms, res.data]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
      errorShown.current = false;
    } catch (e) {
      if (!errorShown.current) {
        sweetAlert('Erreur lors de l\'envoi du message');
        errorShown.current = true;
      }
    }
  };

  useEffect(() => {
    if (!conversations.length) return;
    const target = current ? conversations.find(c => c.id == current) : conversations[0];
    if (target && target.id !== active?.id) {
      loadConversation(target);
    }
  }, [conversations, current]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <HStack align="start" spacing={6}>
      <VStack align="stretch" w={{ base: 'full', md: '250px' }} spacing={1}>
        {conversations.map(c => {
          const owner = c.seller_id === auth.user.id ? c.buyer : c.seller;
          return (
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
                  <Text fontSize="xs" color="gray.600" noOfLines={1}>{owner.first_name} {owner.last_name}</Text>
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
          );
        })}
        {nextPage && (
          <Button variant="ghost" onClick={loadMore}>Charger plus</Button>
        )}
      </VStack>
      <Box flex="1" bg="white" p={4} borderRadius="md">
        {active ? (
          <VStack align="stretch" spacing={4} h={{ base: '400px', md: '500px' }}>
            <HStack justify="space-between" wrap="wrap" gap={2}>
              <Heading size="md">{active.subject || active.listing.title}</Heading>
              {partner && (
                <HStack>
                  <Avatar size="sm" name={`${partner.first_name} ${partner.last_name}`} />
                  <Text fontSize="sm" color="gray.600">
                    Dernière connexion : {partner.last_active_at ? new Date(partner.last_active_at).toLocaleString() : 'N/A'}
                  </Text>
                  <Button size="xs" variant="outline" onClick={reportUser}>Signaler</Button>
                </HStack>
              )}
            </HStack>
            <VStack align="stretch" spacing={2} flex="1" overflowY="auto">
              {messages.map((m, idx) => {
                const isMe = m.sender_id === auth.user.id;
                const isFirstFromBuyer = idx === 0 && m.sender_id === active.buyer_id;
                if (isFirstFromBuyer) {
                  return (
                    <Box key={m.id} alignSelf="flex-start" bg="gray.100" borderRadius="md" p={2}>
                      <VStack align="stretch" spacing={2}>
                        <ListingCard listing={active.listing} />
                        <HStack fontSize="sm" color="gray.600">
                          <FaReply />
                          <Text>En réponse à cette annonce</Text>
                        </HStack>
                        <HStack>
                          <Text>{m.content}</Text>
                          {isMe && <FaCheckDouble color={m.is_read ? 'blue' : 'gray'} />}
                        </HStack>
                      </VStack>
                    </Box>
                  );
                }

                return (
                  <Box key={m.id} alignSelf={isMe ? 'flex-end' : 'flex-start'} bg={isMe ? 'brand.200' : 'gray.100'} borderRadius="md" p={2}>
                    <HStack>
                      <Text>{m.content}</Text>
                      {isMe && (
                        <FaCheckDouble color={m.is_read ? 'blue' : 'gray'} />
                      )}
                    </HStack>
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
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
