import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Box, Flex, Avatar, Heading, Text, Stack, Button } from '@chakra-ui/react';

export default function Profile({ user }) {
  const pageUser = user || usePage().props.auth.user;

  if (!pageUser) {
    return null;
  }

  const fullName = `${pageUser.first_name} ${pageUser.last_name}`;

  return (
    <Flex justify="center" p={4}>
      <Box bg="white" p={6} rounded="md" shadow="sm" w="full" maxW="lg">
        <Stack direction={{ base: 'column', md: 'row' }} spacing={6} align="center">
          <Avatar name={fullName} size="xl" />
          <Box flex="1">
            <Heading size="md" mb={1}>{fullName}</Heading>
            <Text color="gray.600">{pageUser.email}</Text>
            {pageUser.phone && (
              <Text color="gray.600">{pageUser.phone}</Text>
            )}
            <Text mt={2} fontSize="sm" color="gray.500">
              Membre depuis {new Date(pageUser.created_at).toLocaleDateString()}
            </Text>
          </Box>
        </Stack>
        <Flex mt={6} justify={{ base: 'center', md: 'flex-end' }}>
          <Button as={Link} href="/account/settings" width={{ base: 'full', md: 'auto' }}>
            Modifier mon profil
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
