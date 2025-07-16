import { Box, Text, HStack, Avatar, Link, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCheckDouble } from 'react-icons/fa';

const MotionBox = motion(Box);

export default function ChatMessage({ message, isMe }) {
  return (
    <HStack justify={isMe ? 'flex-end' : 'flex-start'} align="end" spacing={2}>
      {!isMe && (
        <Avatar size="sm" src={message.sender?.avatar} name={`${message.sender?.first_name || ''} ${message.sender?.last_name || ''}`} />
      )}
      <MotionBox
        bg={isMe ? 'brand.500' : 'inputBg'}
        color={isMe ? 'white' : 'inherit'}
        borderRadius="lg"
        px={3}
        py={2}
        maxW="75%"
        shadow="md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Text whiteSpace="pre-wrap">{message.content}</Text>
        {message.file_url && (
          <Link href={message.file_url} isExternal display="block" mt={1} fontSize="sm">
            Fichier
          </Link>
        )}
        <HStack fontSize="xs" color={useColorModeValue('gray.600', 'whiteAlpha.700')} justify="flex-end" mt={1}>
          <Text>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          {isMe && <FaCheckDouble color={message.is_read ? 'limegreen' : 'gray'} />}
        </HStack>
      </MotionBox>
    </HStack>
  );
}
