import {
  AppShell,
  Container,
  Title,
  Group,
  Text,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { IconDna2 } from '@tabler/icons-react';

import { MoonStar, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <AppShell
      padding="md"
      header={
        <Container fluid h="100%" px="md">
          <Group h="100%" align="center">
            <IconDna2 size={30} stroke={2} />
            <div>
              <Title order={3}>Gene Table Viewer </Title>
              <Text size="xs" c="dimmed">
                datavisyn Coding Challenge
              </Text>
            </div>
            <div>
              <Text>
                <ActionIcon
                  variant="outline"
                  color={dark ? 'yellow' : 'blue'}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                  className="themeToggle"
                  type="button"
                >
                  {dark ? <Sun size={16} /> : <MoonStar size={16} />}
                </ActionIcon>
              </Text>
            </div>
          </Group>
        </Container>
      }
    >
      {children}
    </AppShell>
  );
}
