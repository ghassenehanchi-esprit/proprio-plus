import { Box, Table, TextInput, Button, Flex, Text, Anchor } from '@mantine/core';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Components/Admin/AdminLayout';

export default function Index() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [sort, setSort] = useState('id');
  const [dir, setDir] = useState('asc');

  const fetchUsers = async () => {
    const { data } = await axios.get(route('admin.users.data'), {
      params: { search: query, page, sort, dir }
    });
    setUsers(data.data);
    setLastPage(data.last_page || 1);
  };

  useEffect(() => {
    fetchUsers();
  }, [query, page, sort, dir]);

  const handleSort = column => {
    if (sort === column) {
      setDir(dir === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(column);
      setDir('asc');
    }
  };

  const certify = (id) => {
    router.post(route('admin.users.certify', id), {}, { onSuccess: fetchUsers });
  };

  const refuse = (id) => {
    router.post(route('admin.users.refuse', id), {}, { onSuccess: fetchUsers });
  };

  const reupload = (id) => {
    router.post(route('admin.users.reupload', id), {}, { onSuccess: fetchUsers });
  };

  const viewDocument = (id) => {
    window.open(route('admin.users.document', id), '_blank');
  };

  return (
    <Box>
      <TextInput
        placeholder="Rechercher..."
        mb="sm"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />
      <Table striped withTableBorder>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('last_name')}>Nom {sort === 'last_name' && (dir === 'asc' ? '▲' : '▼')}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>Email {sort === 'email' && (dir === 'asc' ? '▲' : '▼')}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('certification_status')}>Status {sort === 'certification_status' && (dir === 'asc' ? '▲' : '▼')}</th>
            <th>Document</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>{u.certification_status || '—'}</td>
              <td>
                {u.identity_document && (
                  <Anchor onClick={() => viewDocument(u.id)}>Voir</Anchor>
                )}
              </td>
              <td>
                <Button size="xs" mr={4} onClick={() => certify(u.id)}>Certifier</Button>
                <Button size="xs" mr={4} variant="outline" onClick={() => refuse(u.id)}>Refuser</Button>
                <Button size="xs" variant="default" onClick={() => reupload(u.id)}>Demander nouveau doc</Button>
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
