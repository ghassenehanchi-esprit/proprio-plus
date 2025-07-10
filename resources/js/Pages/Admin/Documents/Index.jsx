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
  Text
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import AdminLayout from '@/Components/Admin/AdminLayout';
import sweetAlert from '@/libs/sweetalert';

export default function Index() {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchDocuments = async () => {
    const { data } = await axios.get(route('admin.documents.data'), {
      params: { page }
    });
    setDocuments(data.data);
    setLastPage(data.last_page || 1);
  };

  useEffect(() => {
    fetchDocuments();
  }, [page]);

  const approve = async id => {
    await axios.post(route('admin.documents.approve', id));
    sweetAlert('Document approuvé', 'success');
    fetchDocuments();
  };

  return (
    <Box>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Annonce</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Approuvé par</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents.map(d => (
            <Tr key={d.id}>
              <Td>{d.id}</Td>
              <Td>{d.listing?.title}</Td>
              <Td>{d.type}</Td>
              <Td>{d.status}</Td>
              <Td>{d.approved_by ? `${d.approved_by.first_name} ${d.approved_by.last_name}` : '-'}</Td>
              <Td>
                {!d.approved_at && (
                  <Button size="xs" onClick={() => approve(d.id)}>Approuver</Button>
                )}
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
