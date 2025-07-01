import { Button as ChakraButton } from '@chakra-ui/react';

export default function Button({ children, ...props }) {
  return (
    <ChakraButton colorScheme="primary" {...props}>
      {children}
    </ChakraButton>
  );
}
