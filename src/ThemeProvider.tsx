import { useState, useEffect, useMemo } from 'react';
import {
  MantineProvider,
  ColorSchemeProvider,
  Global,
  type ColorScheme,
} from '@mantine/core';
import App from './App';

function ThemeProvider() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  useEffect(() => {
    const savedScheme = localStorage.getItem('color-scheme') as ColorScheme;
    if (savedScheme) {
      setColorScheme(savedScheme);
    }
  }, []);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextScheme);
    localStorage.setItem('color-scheme', nextScheme);
  };

  const theme = useMemo(
    () => ({
      colorScheme,
      breakpoints: {
        xs: '30em',
        sm: '48em',
        md: '64em',
        lg: '74em',
        xl: '90em',
      },
    }),
    [colorScheme]
  );

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        {/* Global CSS */}
        <Global
          styles={theme => ({
            '*, *::before, *::after': {
              boxSizing: 'border-box',
            },
            body: {
              ...theme.fn.fontStyles(),
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[7]
                  : theme.white,
              color: theme.colorScheme === 'dark' ? theme.white : theme.black,
              lineHeight: theme.lineHeight,
              margin: 0,
              padding: 0,
            },
            a: {
              color:
                theme.colorScheme === 'dark'
                  ? theme.white
                  : theme.colors[theme.primaryColor][6],
              textDecoration: 'none',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
          })}
        />
        <App />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default ThemeProvider;
