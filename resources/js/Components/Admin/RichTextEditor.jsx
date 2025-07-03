import { Box, Flex, IconButton, Select } from '@chakra-ui/react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { useRef, useEffect } from 'react';

export default function RichTextEditor({ value = '', onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const exec = (command, arg = null) => {
    ref.current.focus();
    document.execCommand(command, false, arg);
    onChange && onChange(ref.current.innerHTML);
  };

  const handleInput = () => {
    onChange && onChange(ref.current.innerHTML);
  };

  return (
    <Box border="1px" borderColor="gray.300" borderRadius="md">
      <Flex bg="gray.100" p={2} gap={1} wrap="wrap">
        <IconButton icon={<FaBold />} size="sm" aria-label="bold" onClick={() => exec('bold')} />
        <IconButton icon={<FaItalic />} size="sm" aria-label="italic" onClick={() => exec('italic')} />
        <IconButton icon={<FaUnderline />} size="sm" aria-label="underline" onClick={() => exec('underline')} />
        <Select width="auto" size="sm" onChange={(e) => exec('fontSize', e.target.value)}>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">Larger</option>
          <option value="6">Huge</option>
        </Select>
        <input type="color" onChange={(e) => exec('foreColor', e.target.value)} style={{ width: 28, height: 28, border: 'none' }} />
      </Flex>
      <Box
        ref={ref}
        contentEditable
        onInput={handleInput}
        p={2}
        minH="120px"
      />
    </Box>
  );
}
