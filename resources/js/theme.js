import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
  },
  colors: {
    brand: {
      500: '#FF3C00',
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'xl',
      },
    },
  },
});

export default theme;
