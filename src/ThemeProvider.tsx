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
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <App />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default ThemeProvider;
