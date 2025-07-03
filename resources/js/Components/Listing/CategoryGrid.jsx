import { Box, Image, Text, SimpleGrid } from '@chakra-ui/react';

export default function CategoryGrid({ categories = [], value, onChange }) {
  return (
    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
      {categories.map((c) => (
        <Box
          key={c.id}
          borderWidth={value === c.id ? '2px' : '1px'}
          borderColor={value === c.id ? 'brand.500' : 'gray.200'}
          p={3}
          rounded="md"
          textAlign="center"
          cursor="pointer"
          onClick={() => onChange(c.id)}
        >
          <Image src={c.icon_url} alt={c.name} boxSize="60px" mx="auto" mb={2} />
          <Text fontSize="sm">{c.name}</Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
