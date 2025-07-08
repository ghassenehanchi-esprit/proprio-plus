import { Box, Flex, VStack, HStack, Avatar, Text, Button, IconButton, Input, useBreakpointValue } from '@chakra-ui/react';
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

  const send = () => {
    if (!content) return;
    // send logic placeholder
    setContent('');
  };

  return (
    <Flex direction={flexDir} h="full" bg="gray.50" borderRadius="md" overflow="hidden">
      <VStack
        align="stretch"
        spacing={0}
        w={{ base: 'full', md: '300px' }}
        maxH={{ base: '200px', md: 'auto' }}
        overflowY="auto"
        borderRightWidth={{ md: '1px' }}
        borderColor="gray.200"
        bg="white"
      >
        {conversations.map(c => (
          <HStack
            key={c.id}
            p={3}
            spacing={3}
            bg={c.id === activeId ? 'orange.100' : 'white'}
            _hover={{ bg: 'orange.100' }}
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
      <Flex direction="column" flex="1" bg="white">
        {activeConv && (
          <>
            <HStack justify="space-between" p={4} borderBottomWidth="1px" borderColor="gray.200">
              <Box>
                <Text fontWeight="bold">{activeConv.user.name}</Text>
                <Text fontSize="sm" color="gray.500">{activeConv.listingTitle}</Text>
              </Box>
              <HStack>
                <Button size="sm" variant="outline" colorScheme="orange">Faire une offre</Button>
                <Button size="sm" colorScheme="orange">Acheter</Button>
              </HStack>
            </HStack>
            <VStack flex="1" spacing={3} p={4} overflowY="auto" align="stretch" bg="gray.50">
              {messages.map(m => (
                <MessageBubble key={m.id} message={m} isMe={m.from_user_id === currentUserId} />
              ))}
            </VStack>
            <HStack p={4} borderTopWidth="1px" borderColor="gray.200">
              <Input value={content} onChange={e => setContent(e.target.value)} placeholder="Votre message" />
              <IconButton icon={<FaPaperPlane />} colorScheme="orange" onClick={send} aria-label="envoyer" />
            </HStack>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export { MessageBubble };
