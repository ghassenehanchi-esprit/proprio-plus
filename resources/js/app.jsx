import './bootstrap';
import '../scss/index.scss';

import * as React from 'react';
import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import theme from './theme';
import LayoutWrapper from './Components/Layout/LayoutWrapper';

createInertiaApp({
  title: title => `${title} - ProprioPlus`,
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    let page = pages[`./Pages/${name}.jsx`];
    page.default.layout = page?.default?.layout || (page => <LayoutWrapper>{page}</LayoutWrapper>);
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <App {...props} />
        </ChakraProvider>
      </RecoilRoot>
    );
  },
});
