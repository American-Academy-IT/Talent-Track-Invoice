import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import CurrentUserProvider from './context/user-context';
import { THEME } from './data/constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      retry: false,
    },
  },
});

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <ChakraProvider theme={THEME}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </ChakraProvider>
      </CurrentUserProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
