import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import ThemeProvider from './ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider />
  </StrictMode>
);
