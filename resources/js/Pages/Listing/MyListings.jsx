import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Heading, Text } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import sweetAlert from '@/libs/sweetalert';

export default function MyListings({ listings: initial = [] }) {
  const [listings, setListings] = useState(initial);

  const remove = async (id) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      await axios.delete(`/listings/${id}`);
      setListings(ls => ls.filter(l => l.id !== id));
      sweetAlert('Annonce supprimée', 'success');
    } catch (e) {
      sweetAlert("Erreur lors de la suppression");
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>Mes annonces</Heading>
      {listings.length === 0 ? (
        <Text>Aucune annonce pour le moment.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Titre</Th>
              <Th>Status</Th>
              <Th>Demandes</Th>
              <Th>Fans</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {listings.map(l => (
              <Tr key={l.id}>
                <Td>{l.title}</Td>
                <Td>{l.status}</Td>
                <Td>{l.conversations_count}</Td>
                <Td>{l.favorites_count}</Td>
                <Td>
                  <Button as={Link} href={`/listings/${l.id}/edit`} size="xs" mr={2}>Modifier</Button>
                  <Button size="xs" colorScheme="red" variant="outline" onClick={() => remove(l.id)}>
                    Supprimer
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
