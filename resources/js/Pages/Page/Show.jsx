import { Box, Heading, Text, Image, VStack } from '@chakra-ui/react';

export default function Show({ page }) {
  return (
    <Box>
      <Heading mb={6}>{page.title}</Heading>
      <VStack spacing={8} align="stretch">
        {page.sections && page.sections.map(section => (
          <Box key={section.id}>
            {section.image && (
              <Image src={section.image} alt="" mb={2} borderRadius="md" />
            )}
            {section.text && (
              <Text whiteSpace="pre-line">{section.text}</Text>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

