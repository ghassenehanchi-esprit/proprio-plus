import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  Stack,
  Button,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { EmailIcon, PhoneIcon, CalendarIcon } from '@chakra-ui/icons';

export default function Profile({ user }) {
  const pageUser = user || usePage().props.auth.user;

  if (!pageUser) {
    return null;
  }

  const fullName = `${pageUser.first_name} ${pageUser.last_name}`;

  return (
    <Flex justify="center" p={{ base: 4, md: 8 }}>
      <Box
        bg="white"
        p={8}
        rounded="xl"
        shadow="lg"
        w="full"
        maxW="2xl"
        bgGradient="linear(to-br, white, gray.50)"
      >
        <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align="center">
          <Avatar name={fullName} size="2xl" />
          <Box flex="1">
            <Heading size="lg" mb={4} fontWeight="medium">
              {fullName}
            </Heading>
            <Stack spacing={2} fontSize="md" color="gray.600">
              <HStack>
                <Icon as={EmailIcon} />
                <Text>{pageUser.email}</Text>
              </HStack>
              {pageUser.phone && (
                <HStack>
                  <Icon as={PhoneIcon} />
                  <Text>{pageUser.phone}</Text>
                </HStack>
              )}
              <HStack>
                <Icon as={CalendarIcon} />
                <Text>
                  Membre depuis {new Date(pageUser.created_at).toLocaleDateString()}
                </Text>
              </HStack>
            </Stack>
          </Box>
        </Stack>
        <Flex mt={8} justify={{ base: 'center', md: 'flex-end' }}>
          <Button as={Link} href="/account/settings" variant="fancy" px={8}>
            Modifier mon profil
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
