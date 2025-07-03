import { Box, Table, Flex, Button, Text } from '@mantine/core';
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
      <Table striped withTableBorder>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Entrée</th>
            <th>Sortie</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {clockings.map(c => (
            <tr key={c.id}>
              <td>{c.user.first_name} {c.user.last_name}</td>
              <td>{new Date(c.clock_in_at).toLocaleString()}</td>
              <td>{c.clock_out_at ? new Date(c.clock_out_at).toLocaleString() : '—'}</td>
              <td>{c.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Flex mt="md" justify="space-between" align="center">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Précédent</Button>
        <Text>{page} / {lastPage}</Text>
        <Button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}>Suivant</Button>
      </Flex>
    </Box>
  );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>;
