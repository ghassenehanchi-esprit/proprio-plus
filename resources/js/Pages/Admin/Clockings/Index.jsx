import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Button,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import AdminLayout from '@/Components/Admin/AdminLayout';

export default function Index() {
  const [clockings, setClockings] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const load = async () => {
    const { data } = await axios.get(route('admin.clockings.data'), { params: { page } });
    setClockings(data.data);
    setLastPage(data.last_page || 1);
  };

  useEffect(() => { load(); }, [page]);

  return (
    <Box>
      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>Utilisateur</Th>
            <Th>Entrée</Th>
            <Th>Sortie</Th>
            <Th>Note</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clockings.map(c => (
            <Tr key={c.id}>
              <Td>{c.user.first_name} {c.user.last_name}</Td>
              <Td>{new Date(c.clock_in_at).toLocaleString()}</Td>
              <Td>{c.clock_out_at ? new Date(c.clock_out_at).toLocaleString() : '—'}</Td>
              <Td>{c.note || '—'}</Td>
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
