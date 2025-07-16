import { Box, Text, HStack, Button, VStack } from '@chakra-ui/react';

export default function OfferCard({ offer, onAction }) {
  return (
    <Box bg="surfaceSubtle" p={4} borderRadius="md" shadow="sm">
      <VStack align="stretch" spacing={2}>
        <Text fontWeight="bold">Offre proposée</Text>
        {offer.message && <Text>{offer.message}</Text>}
        <Text fontWeight="bold">{Number(offer.price).toLocaleString()} €</Text>
        {offer.status === 'pending' && (
          <HStack pt={2} spacing={2} justify="flex-end">
            <Button size="sm" colorScheme="green" onClick={() => onAction('accepted')}>Accepter</Button>
            <Button size="sm" variant="outline" onClick={() => onAction('declined')}>Refuser</Button>
            <Button size="sm" onClick={() => onAction('discuss')}>Discuter</Button>
          </HStack>
        )}
        {offer.status === 'accepted' && (
          <Text color="green.500" fontWeight="medium">Offre acceptée 🎉 — Prochaine étape : notaire</Text>
        )}
      </VStack>
    </Box>
  );
}
