import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Flex,
  Text,
  Link,
} from '@chakra-ui/react';
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
      <Input
        placeholder="Rechercher..."
        mb={2}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />
      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => handleSort('last_name')}>Nom {sort === 'last_name' && (dir === 'asc' ? '▲' : '▼')}</Th>
            <Th cursor="pointer" onClick={() => handleSort('email')}>Email {sort === 'email' && (dir === 'asc' ? '▲' : '▼')}</Th>
            <Th cursor="pointer" onClick={() => handleSort('phone')}>Téléphone {sort === 'phone' && (dir === 'asc' ? '▲' : '▼')}</Th>
            <Th cursor="pointer" onClick={() => handleSort('certification_status')}>Status {sort === 'certification_status' && (dir === 'asc' ? '▲' : '▼')}</Th>
            <Th>Dernière activité</Th>
            <Th>Document</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(u => (
            <Tr key={u.id}>
              <Td>{u.first_name} {u.last_name}</Td>
              <Td>{u.email}</Td>
              <Td>{u.phone}</Td>
              <Td>{u.certification_status || '—'}</Td>
              <Td>{u.last_active_at ? new Date(u.last_active_at).toLocaleString() : '—'}</Td>
              <Td>
                {u.identity_document && (
                  <Link onClick={() => viewDocument(u.id)}>Voir</Link>
                )}
              </Td>
              <Td>
                <Button size="xs" mr={2} onClick={() => certify(u.id)}>Certifier</Button>
                <Button size="xs" mr={2} variant="outline" onClick={() => refuse(u.id)}>Refuser</Button>
                <Button size="xs" variant="ghost" onClick={() => reupload(u.id)}>Demander nouveau doc</Button>
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
