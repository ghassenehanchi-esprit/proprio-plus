import { Button as ChakraButton } from '@chakra-ui/react';

export default function Button({ children, ...props }) {
  return (
    <ChakraButton variant="fancy" {...props}>
      {children}
    </ChakraButton>
  );
}
