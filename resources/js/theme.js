import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Playfair Display, serif',
  },
  colors: {
    brand: {
      50: '#e7eef8',
      100: '#c2d4e9',
      200: '#9ab8da',
      300: '#729cca',
      400: '#4e83be',
      500: '#2a6ab2',
      600: '#215999',
      700: '#17447f',
      800: '#0e3066',
      900: '#041b4d',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.100',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'xl',
      },
      variants: {
        fancy: {
          bgGradient: 'linear(to-r, brand.600, orange.400)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, brand.700, orange.500)',
          },
        },
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

export default theme;
