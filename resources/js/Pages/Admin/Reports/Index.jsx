import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Select,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import AdminLayout from '@/Components/Admin/AdminLayout';

export default function Index() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const load = async () => {
    const { data } = await axios.get(route('admin.reports.data'), { params: { page } });
    setReports(data.data);
    setLastPage(data.last_page || 1);
  };

  useEffect(() => { load(); }, [page]);

  const updateStatus = async (id, status) => {
    await axios.post(route('admin.reports.status', id), { status });
    load();
  };

  return (
    <Box>
      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>Reporter</Th>
            <Th>Signalé</Th>
            <Th>Annonce</Th>
            <Th>Raison</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reports.map(r => (
            <Tr key={r.id}>
              <Td>{r.reporter.first_name} {r.reporter.last_name}</Td>
              <Td>{r.reported ? r.reported.first_name + ' ' + r.reported.last_name : '—'}</Td>
              <Td>{r.conversation ? r.conversation.listing.title : '—'}</Td>
              <Td>{r.reason}</Td>
              <Td>
                <Select size="xs" value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}>
                  <option value="pending">pending</option>
                  <option value="reviewed">reviewed</option>
                  <option value="blocked">blocked</option>
                </Select>
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
