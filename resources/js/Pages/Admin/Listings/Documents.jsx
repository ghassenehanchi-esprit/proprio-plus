import { Box, Heading, VStack, Flex, Link, Text, Button } from '@chakra-ui/react';
import AdminLayout from '@/Components/Admin/AdminLayout';
import { route } from 'ziggy-js';

export default function Documents({ listing, documents = [] }) {
  return (
    <Box>
      <Heading size="md" mb={4}>Documents pour: {listing.title}</Heading>
      <VStack align="start" spacing={4}>
        {documents.map(doc => (
          <Flex key={doc.id} align="center" gap={2}>
            <Link href={doc.url} isExternal>{doc.name || doc.path.split('/').pop()}</Link>
          </Flex>
        ))}
        {documents.length === 0 && <Text>Aucun document fourni.</Text>}
      </VStack>
      <Button mt={4} as="a" href={route('admin.listings.index')}>Retour</Button>
    </Box>
  );
}

Documents.layout = page => <AdminLayout>{page}</AdminLayout>;
