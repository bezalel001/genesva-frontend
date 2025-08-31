import { useState } from 'react';
import {
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
} from '@mantine/core';
import App from './App';

function ThemeProvider() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    (localStorage.getItem('color-scheme') as ColorScheme) || 'light'
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextScheme);
    localStorage.setItem('color-scheme', nextScheme);
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          breakpoints: {
            xs: '30em',
            sm: '48em',
            md: '64em',
            lg: '74em',
            xl: '90em',
          },
        }}
      >
        <App />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default ThemeProvider;
