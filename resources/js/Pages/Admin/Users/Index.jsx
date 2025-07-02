import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Button } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Index({ users = [] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(u => (
      `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(q)
    ));
  }, [query, users]);

  const certify = (id) => {
    router.post(route('admin.users.certify', id));
  };

  const refuse = (id) => {
    router.post(route('admin.users.refuse', id));
  };

  return (
    <Box>
      <Input placeholder="Rechercher..." mb={4} value={query} onChange={(e) => setQuery(e.target.value)} />
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Nom</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map(u => (
            <Tr key={u.id}>
              <Td>{u.first_name} {u.last_name}</Td>
              <Td>{u.email}</Td>
              <Td>{u.certification_status || '—'}</Td>
              <Td>
                <Button size="sm" mr={2} onClick={() => certify(u.id)}>Certifier</Button>
                <Button size="sm" variant="outline" onClick={() => refuse(u.id)}>Refuser</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
