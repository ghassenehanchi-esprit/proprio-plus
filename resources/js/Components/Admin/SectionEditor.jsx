import { Box, FormControl, FormLabel, IconButton, Input, Flex } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import RichTextEditor from './RichTextEditor';

export default function SectionEditor({ section, onChange, onRemove }) {
  const update = (field, value) => {
    onChange && onChange({ ...section, [field]: value });
  };

  return (
    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} mb={4} bg="white">
      <Flex justify="flex-end">
        {onRemove && (
          <IconButton size="sm" icon={<CloseIcon />} aria-label="remove" onClick={onRemove} />
        )}
      </Flex>
      <FormControl mb={3}>
        <FormLabel>Image (URL)</FormLabel>
        <Input value={section.image || ''} onChange={(e) => update('image', e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Texte</FormLabel>
        <RichTextEditor value={section.text || ''} onChange={(val) => update('text', val)} />
      </FormControl>
    </Box>
  );
}
