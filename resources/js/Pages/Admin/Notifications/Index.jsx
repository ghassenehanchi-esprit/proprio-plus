import { Box, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import AdminLayout from '@/Components/Admin/AdminLayout';

export default function Index() {
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const { data } = await axios.get(route('admin.notifications.index'));
    setNotifications(data);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await axios.post(route('admin.notifications.read', id));
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  };

  const markUnread = async (id) => {
    await axios.post(route('admin.notifications.unread', id));
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read_at: null } : n));
  };

  return (
    <Box>
      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>Utilisateur</Th>
            <Th>Type</Th>
            <Th>Date</Th>
            <Th>Statut</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {notifications.map(n => (
            <Tr key={n.id}>
              <Td>{n.user ? `${n.user.first_name} ${n.user.last_name}` : '-'}</Td>
              <Td>{n.type.split('\\').pop()}</Td>
              <Td>{new Date(n.created_at).toLocaleString()}</Td>
              <Td>{n.read_at ? 'Lu' : 'Non lu'}</Td>
              <Td>
                {n.read_at ? (
                  <Button size="xs" onClick={() => markUnread(n.id)}>Marquer non lu</Button>
                ) : (
                  <Button size="xs" onClick={() => markRead(n.id)}>Marquer lu</Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
