import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
  },
  colors: {
    brand: {
      50: '#ffeae9',
      100: '#ffc9c5',
      200: '#ffa39d',
      300: '#ff7c75',
      400: '#ff5a54',
      500: '#ff453f',
      600: '#e63a37',
      700: '#cc2f2f',
      800: '#b32427',
      900: '#8a181b',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'xl',
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

export default theme;
