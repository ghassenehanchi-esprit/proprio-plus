import { Box, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Admin/AdminLayout';
import { route } from 'ziggy-js';

export default function Edit({ page }) {
  const { data, setData, post, processing } = useForm({
    title: page.title || '',
    sections: JSON.stringify(page.sections || [], null, 2),
    images: null,
  });

  const submit = e => {
    e.preventDefault();
    post(route('admin.pages.update', page.id), { forceFormData: true });
  };

  return (
    <Box as="form" onSubmit={submit} maxW="2xl" mx="auto">
      <FormControl mb={4}>
        <FormLabel>Titre</FormLabel>
        <Input value={data.title} onChange={e => setData('title', e.target.value)} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Sections (JSON)</FormLabel>
        <Textarea
          value={data.sections}
          onChange={e => setData('sections', e.target.value)}
          rows={10}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Galerie</FormLabel>
        <Input type="file" multiple onChange={e => setData('images', e.target.files)} />
      </FormControl>
      <Button type="submit" colorScheme="brand" isLoading={processing}>Enregistrer</Button>
    </Box>
  );
}

Edit.layout = page => <AdminLayout>{page}</AdminLayout>;

