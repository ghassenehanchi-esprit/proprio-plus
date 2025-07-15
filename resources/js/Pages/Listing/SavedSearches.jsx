import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Switch, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import sweetAlert from '@/libs/sweetalert';
import { Link } from '@inertiajs/react';

export default function SavedSearches({ searches: initial = [] }) {
  const [searches, setSearches] = useState(initial);

  useEffect(() => {
    if (initial.length === 0) {
      axios.get('/saved-searches').then(r => setSearches(r.data));
    }
  }, []);

  const toggleNotify = async (search) => {
    try {
      const { data } = await axios.patch(`/saved-searches/${search.id}`, { notify: !search.notify });
      setSearches(ss => ss.map(s => s.id === search.id ? data : s));
    } catch (e) {
      sweetAlert("Impossible de mettre à jour");
    }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette recherche ?')) return;
    try {
      await axios.delete(`/saved-searches/${id}`);
      setSearches(ss => ss.filter(s => s.id !== id));
      sweetAlert('Recherche supprimée', 'success');
    } catch (e) {
      sweetAlert("Erreur lors de la suppression");
    }
  };

  const searchLink = (params) => {
    const query = new URLSearchParams(params).toString();
    return `/listings/search?${query}`;
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>Mes recherches sauvegardées</Heading>
      {searches.length === 0 ? (
        <Text>Aucune recherche enregistrée.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Notifications</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {searches.map(s => (
              <Tr key={s.id}>
                <Td>
                  <Button as={Link} href={searchLink(s.params)} variant="link">
                    {s.name || 'Recherche du ' + new Date(s.created_at).toLocaleDateString()}
                  </Button>
                </Td>
                <Td>
                  <Switch isChecked={s.notify} onChange={() => toggleNotify(s)} />
                </Td>
                <Td>
                  <Button size="xs" colorScheme="red" onClick={() => remove(s.id)}>Supprimer</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
