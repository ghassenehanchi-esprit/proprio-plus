import { Box, List, ListItem, Link } from '@chakra-ui/react';
import AdminLayout from '@/Components/Admin/AdminLayout';
import { route } from 'ziggy-js';

export default function Index({ pages = [] }) {
  return (
    <Box>
      <List spacing={3}>
        {pages.map(p => (
          <ListItem key={p.id}>
            <Link href={route('admin.pages.edit', p.id)} color="blue.500">{p.title}</Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>;

