import { Box, FormControl, FormLabel, IconButton, Input, Flex } from '@chakra-ui/react';
import { CloseIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import RichTextEditor from './RichTextEditor';

export default function SectionEditor({ section, onChange, onRemove, onMoveUp, onMoveDown }) {
  const update = (field, value) => {
    onChange && onChange({ ...section, [field]: value });
  };

  return (
    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} mb={4} bg="white">
      <Flex justify="space-between" mb={2}>
        <Flex gap={1}>
          {onMoveUp && (
            <IconButton size="sm" icon={<ArrowUpIcon />} aria-label="move up" onClick={onMoveUp} />
          )}
          {onMoveDown && (
            <IconButton size="sm" icon={<ArrowDownIcon />} aria-label="move down" onClick={onMoveDown} />
          )}
        </Flex>
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
