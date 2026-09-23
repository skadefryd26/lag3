import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mantine/core/styles.css';
import { Skadeko } from './features/skadeko/components/Skadeko';
import { Stresspause } from './features/stresspause/components/Stresspause';
import { theme } from './theme';

const queryClient = new QueryClient();

/** Enkel hash-navigasjon: #stresspause viser mini-spillene, alt annet viser skadekøen. */
function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const oppdater = () => setHash(window.location.hash);
    window.addEventListener('hashchange', oppdater);
    return () => window.removeEventListener('hashchange', oppdater);
  }, []);

  if (hash === '#stresspause') return <Stresspause />;
  return (
    <>
      <Skadeko />
      <Button component="a" href="#stresspause" color="teal" radius="xl" pos="fixed" bottom={20} right={20} style={{ zIndex: 10 }}>
        🧘 Stresspause
      </Button>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
