import { Box, Heading, Image, VStack } from '@chakra-ui/react';

const sanitize = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,iframe,object,embed').forEach(el => el.remove());
  return doc.body.innerHTML;
};

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
              <Box dangerouslySetInnerHTML={{ __html: sanitize(section.text) }} />
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

