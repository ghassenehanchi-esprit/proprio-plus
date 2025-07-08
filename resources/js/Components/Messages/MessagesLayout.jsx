import { Box, Flex, VStack, HStack, Avatar, Text, Button, IconButton, Input, useBreakpointValue, Image } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { FaPaperPlane } from 'react-icons/fa';
import { useState } from 'react';

function formatRelative(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `il y a ${Math.floor(diff)} secondes`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} minutes`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} heures`;
  return `il y a ${Math.floor(diff / 86400)} jours`;
}

function MessageBubble({ message, isMe }) {
  return (
    <Box
      alignSelf={isMe ? 'flex-end' : 'flex-start'}
      bg={isMe ? 'orange.100' : 'gray.100'}
      px={3}
      py={2}
      borderRadius="lg"
      maxW="70%"
      mt={2}
    >
      <Text>{message.body}</Text>
      <Text fontSize="xs" color="gray.500" textAlign="right" mt={1}>
        {formatRelative(message.created_at)}
      </Text>
    </Box>
  );
}

export default function MessagesLayout({ conversations = [], messages = [], currentUserId }) {
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [content, setContent] = useState('');
  const flexDir = useBreakpointValue({ base: 'column', md: 'row' });
  const activeConv = conversations.find(c => c.id === activeId);
  const listingPhoto = activeConv && activeConv.listing ? (() => {
    const photos = Array.isArray(activeConv.listing.photos)
      ? activeConv.listing.photos
      : JSON.parse(activeConv.listing.photos || '[]');
    return photos[0];
  })() : null;

  const send = () => {
    if (!content) return;
    // send logic placeholder
    setContent('');
  };

  return (
    <Flex direction={flexDir} h="100vh" bg="gray.50" overflow="hidden">
      <Flex direction="column" w={{ base: 'full', md: '320px' }} bg="white" h="full" borderRightWidth={{ md: '1px' }} borderColor="gray.200">
        <Box p={4} borderBottomWidth="1px" borderColor="gray.200">
          <Text fontWeight="bold">Messages</Text>
        </Box>
        <VStack align="stretch" spacing={0} overflowY="auto" flex="1">
        {conversations.map(c => (
          <HStack
            key={c.id}
            py={3}
            px={4}
            spacing={2}
            bg={c.id === activeId ? 'gray.100' : 'white'}
            borderLeftWidth={c.id === activeId ? '4px' : '0'}
            borderLeftColor={c.id === activeId ? 'brand.500' : 'transparent'}
            _hover={{ bg: 'gray.100' }}
            cursor="pointer"
            onClick={() => setActiveId(c.id)}
            alignItems="center"
          >
            <Avatar size="sm" src={c.user.avatar} name={c.user.name} />
            <Box flex="1" overflow="hidden">
              <Text fontWeight="bold" noOfLines={1}>{c.user.name}</Text>
              <Text fontSize="sm" color="gray.600" noOfLines={1}>{c.lastMessage}</Text>
            </Box>
            <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
              {formatRelative(c.updated_at)}
            </Text>
          </HStack>
        ))}
        </VStack>
      </Flex>
      <Flex direction="column" flex="1" bg="white">
        {activeConv && (
          <>
            <HStack justify="space-between" p={4} borderBottomWidth="1px" borderColor="gray.200">
              <Box flex="1">
                <Text fontWeight="semibold" textAlign="center">{activeConv.user.name}</Text>
              </Box>
              <IconButton icon={<InfoIcon />} variant="ghost" aria-label="info" />
            </HStack>
            <HStack p={4} spacing={4} borderBottomWidth="1px" borderColor="gray.200">
              {listingPhoto && (
                <Image src={listingPhoto} boxSize="50px" objectFit="cover" borderRadius="md" />
              )}
              <VStack align="start" spacing={0} flex="1">
                <Text fontWeight="semibold">{activeConv.listingTitle}</Text>
                <Text fontWeight="bold">{activeConv.listingPrice} €</Text>
              </VStack>
              <HStack>
                <Button size="sm" variant="outline">Faire une offre</Button>
                <Button size="sm" colorScheme="green">Acheter</Button>
              </HStack>
            </HStack>
            <VStack flex="1" spacing={3} px={4} py={2} overflowY="auto" align="stretch" bg="gray.50">
              {messages.map(m => (
                <MessageBubble key={m.id} message={m} isMe={m.from_user_id === currentUserId} />
              ))}
            </VStack>
            <HStack p={4} borderTopWidth="1px" borderColor="gray.200" position="sticky" bottom="0" bg="white">
              <Input
                flex="1"
                variant="filled"
                placeholder="Envoyer un message"
                rounded="full"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <IconButton icon={<FaPaperPlane />} colorScheme="brand" onClick={send} aria-label="envoyer" />
            </HStack>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export { MessageBubble };
