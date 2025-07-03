import { Box, Heading, Text, Image } from '@chakra-ui/react';

export default function Show({ page }) {
  return (
    <Box>
      <Heading mb={4}>{page.title}</Heading>
      <Text whiteSpace="pre-line" mb={4}>{page.content}</Text>
      {page.photos && page.photos.map((url, i) => (
        <Image key={i} src={url} alt="" mb={4} />
      ))}
    </Box>
  );
}

