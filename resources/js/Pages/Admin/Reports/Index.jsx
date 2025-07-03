import { Box, Table, Flex, Button, Select, Text } from '@mantine/core';
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
      <Table striped withTableBorder>
        <thead>
          <tr>
            <th>Reporter</th>
            <th>Signalé</th>
            <th>Annonce</th>
            <th>Raison</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{r.reporter.first_name} {r.reporter.last_name}</td>
              <td>{r.reported ? r.reported.first_name + ' ' + r.reported.last_name : '—'}</td>
              <td>{r.conversation ? r.conversation.listing.title : '—'}</td>
              <td>{r.reason}</td>
              <td>
                <Select size="xs" value={r.status} onChange={val => updateStatus(r.id, val)} data={[
                  { value: 'pending', label: 'pending' },
                  { value: 'reviewed', label: 'reviewed' },
                  { value: 'blocked', label: 'blocked' },
                ]} />
              </td>
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
