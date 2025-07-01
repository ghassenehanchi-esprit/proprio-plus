import { FormControl, FormLabel, Input as ChakraInput } from '@chakra-ui/react';

export default function Input({ name, label, type = "text", defaultValue = "", ...props }) {
  return (
    <FormControl>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraInput
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        {...props}
      />
    </FormControl>
  );
}
