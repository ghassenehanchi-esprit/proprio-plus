import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Flex, Text, Select } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import AdminLayout from '@/Components/Admin/AdminLayout';
import { usePage } from '@inertiajs/react';

export default function Index({ filters = {} }) {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [status, setStatus] = useState(filters.status || '');

  const fetchListings = async () => {
    const { data } = await axios.get(route('admin.listings.data'), { params: { page, status } });
    setListings(data.data);
    setLastPage(data.last_page || 1);
  };

  useEffect(() => { fetchListings(); }, [page, status]);

  const updateStatus = async (id, status) => {
    await axios.post(route('admin.listings.status', id), { status });
    fetchListings();
  };

  return (
    <Box>
      <Flex mb={2} gap={2}>
        <Select placeholder="Statut" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} w="200px">
          <option value="active">active</option>
          <option value="pending">pending</option>
          <option value="vendue">vendue</option>
          <option value="archivée">archivée</option>
        </Select>
      </Flex>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Titre</Th>
            <Th>Propriétaire</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
            <Th>Documents</Th>
          </Tr>
        </Thead>
        <Tbody>
          {listings.map(l => (
            <Tr key={l.id}>
              <Td>{l.title}</Td>
              <Td>{l.user.first_name} {l.user.last_name}</Td>
              <Td>{l.status}</Td>
              <Td>
                <Select size="sm" value={l.status} onChange={e => updateStatus(l.id, e.target.value)}>
                  <option value="active">active</option>
                  <option value="pending">pending</option>
                  <option value="vendue">vendue</option>
                  <option value="archivée">archivée</option>
                </Select>
              </Td>
              <Td>
                <Button size="xs" as="a" href={route('admin.listings.documents', l.id)}>
                  Voir
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex mt={4} justify="space-between" align="center">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} isDisabled={page === 1}>Précédent</Button>
        <Text>{page} / {lastPage}</Text>
        <Button onClick={() => setPage(p => Math.min(lastPage, p + 1))} isDisabled={page === lastPage}>Suivant</Button>
      </Flex>
    </Box>
  );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>;
