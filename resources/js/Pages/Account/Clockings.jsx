import { Box, Heading, Button, VStack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

export default function Clockings() {
  const { auth } = usePage().props;
  const [clockings, setClockings] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await axios.get('/clockings');
    setClockings(data);
  };

  useEffect(() => { load(); }, []);

  const active = clockings.find(c => !c.clock_out_at);

  const clockIn = async () => {
    setLoading(true);
    await axios.post('/clockings');
    await load();
    setLoading(false);
  };

  const clockOut = async () => {
    if (!active) return;
    setLoading(true);
    await axios.post(`/clockings/${active.id}/clock-out`);
    await load();
    setLoading(false);
  };

  return (
    <Box p={8} maxW="xl" mx="auto" bg="white" rounded="md" shadow="md">
      <Heading size="md" mb={4}>Pointage</Heading>
      <VStack align="stretch" spacing={2} mb={4} maxH="300px" overflowY="auto">
        {clockings.map(c => (
          <Box key={c.id} p={2} borderWidth="1px" rounded="md">
            <Text>Entrée : {new Date(c.clock_in_at).toLocaleString()}</Text>
            <Text>Sortie : {c.clock_out_at ? new Date(c.clock_out_at).toLocaleString() : '—'}</Text>
          </Box>
        ))}
      </VStack>
      {active ? (
        <Button colorScheme="red" onClick={clockOut} isLoading={loading}>Pointer la sortie</Button>
      ) : (
        <Button colorScheme="green" onClick={clockIn} isLoading={loading}>Pointer l'entrée</Button>
      )}
    </Box>
  );
}
