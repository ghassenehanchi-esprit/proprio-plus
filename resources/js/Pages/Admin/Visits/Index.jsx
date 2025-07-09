import { Box, Table, Thead, Tbody, Tr, Th, Td, Flex, Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import AdminLayout from '@/Components/Admin/AdminLayout';

export default function Index() {
  const [visits, setVisits] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const load = async () => {
    const { data } = await axios.get(route('admin.visits.data'), { params: { page } });
    setVisits(data.data);
    setLastPage(data.last_page || 1);
  };

  useEffect(() => { load(); }, [page]);

  return (
    <Box>
      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>Annonce</Th>
            <Th>Visiteur</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {visits.map(v => (
            <Tr key={v.id}>
              <Td>{v.listing.title}</Td>
              <Td>{v.user.first_name} {v.user.last_name}</Td>
              <Td>{new Date(v.visit_datetime).toLocaleString()}</Td>
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
