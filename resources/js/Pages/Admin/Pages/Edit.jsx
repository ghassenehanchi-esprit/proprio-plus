import { Box, FormControl, FormLabel, Input, Button, Heading } from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Components/Admin/AdminLayout';
import SectionEditor from '@/Components/Admin/SectionEditor';
import { route } from 'ziggy-js';

export default function Edit({ page }) {
  const { data, setData, post, processing } = useForm({
    title: page.title || '',
    images: null,
  });

  const [sections, setSections] = useState(page.sections || []);

  const updateSection = (index, updated) => {
    setSections((secs) => secs.map((s, i) => (i === index ? updated : s)));
  };

  const addSection = () => {
    setSections((secs) => [
      ...secs,
      { id: Date.now().toString(), text: '', image: '' },
    ]);
  };

  const removeSection = (index) => {
    setSections((secs) => secs.filter((_, i) => i !== index));
  };

  const moveSection = (index, delta) => {
    setSections((secs) => {
      const next = [...secs];
      const target = index + delta;
      if (target < 0 || target >= secs.length) return secs;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setData('sections', JSON.stringify(sections));
    post(route('admin.pages.update', page.id), { forceFormData: true });
  };

  return (
    <Box as="form" onSubmit={submit} maxW="3xl" mx="auto">
      <Heading size="lg" mb={6}>Modifier la page</Heading>
      <FormControl mb={4}>
        <FormLabel>Titre</FormLabel>
        <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
      </FormControl>
      {sections.map((section, index) => (
        <SectionEditor
          key={section.id}
          section={section}
          onChange={(sec) => updateSection(index, sec)}
          onRemove={() => removeSection(index)}
          onMoveUp={() => moveSection(index, -1)}
          onMoveDown={() => moveSection(index, 1)}
        />
      ))}
      <Button size="sm" mb={4} onClick={addSection} variant="outline">
        Ajouter une section
      </Button>
      <FormControl mb={4}>
        <FormLabel>Galerie</FormLabel>
        <Input type="file" multiple onChange={(e) => setData('images', e.target.files)} />
      </FormControl>
      <Button type="submit" colorScheme="brand" isLoading={processing}>
        Enregistrer
      </Button>
    </Box>
  );
}

Edit.layout = page => <AdminLayout>{page}</AdminLayout>;

